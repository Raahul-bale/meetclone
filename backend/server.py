from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import uuid
from datetime import datetime
import json
import socketio


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class MeetingCreate(BaseModel):
    host_name: str
    meeting_title: Optional[str] = "Quick Meeting"

class MeetingJoin(BaseModel):
    meeting_id: str
    participant_name: str

class Meeting(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    meeting_id: str
    host_name: str
    meeting_title: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    participants: List[str] = []
    is_active: bool = True

# Store active connections and meetings
active_connections: Dict[str, Dict[str, WebSocket]] = {}
active_meetings: Dict[str, Meeting] = {}

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Google Meet Clone API"}

@api_router.post("/meetings", response_model=Meeting)
async def create_meeting(meeting_data: MeetingCreate):
    """Create a new meeting room"""
    meeting_id = str(uuid.uuid4())[:8].upper()  # Short meeting ID
    meeting = Meeting(
        meeting_id=meeting_id,
        host_name=meeting_data.host_name,
        meeting_title=meeting_data.meeting_title
    )
    active_meetings[meeting_id] = meeting
    
    # Store in database
    await db.meetings.insert_one(meeting.dict())
    return meeting

@api_router.get("/meetings/{meeting_id}")
async def get_meeting(meeting_id: str):
    """Get meeting details"""
    if meeting_id in active_meetings:
        return active_meetings[meeting_id]
    
    # Check database
    meeting_data = await db.meetings.find_one({"meeting_id": meeting_id})
    if meeting_data:
        return Meeting(**meeting_data)
    
    return {"error": "Meeting not found"}

@api_router.post("/meetings/{meeting_id}/join")
async def join_meeting(meeting_id: str, join_data: MeetingJoin):
    """Join an existing meeting"""
    if meeting_id not in active_meetings:
        # Try to load from database
        meeting_data = await db.meetings.find_one({"meeting_id": meeting_id})
        if not meeting_data:
            return {"error": "Meeting not found"}
        active_meetings[meeting_id] = Meeting(**meeting_data)
    
    meeting = active_meetings[meeting_id]
    if join_data.participant_name not in meeting.participants:
        meeting.participants.append(join_data.participant_name)
        # Update database
        await db.meetings.update_one(
            {"meeting_id": meeting_id},
            {"$push": {"participants": join_data.participant_name}}
        )
    
    return {"message": "Joined successfully", "meeting": meeting}

# WebSocket endpoint for real-time signaling
@app.websocket("/ws/{meeting_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, meeting_id: str, user_id: str):
    await websocket.accept()
    
    # Initialize meeting room if it doesn't exist
    if meeting_id not in active_connections:
        active_connections[meeting_id] = {}
    
    # Add user to room
    active_connections[meeting_id][user_id] = websocket
    
    # Notify other users that someone joined
    await broadcast_to_room(meeting_id, {
        "type": "user_joined",
        "user_id": user_id,
        "participants": list(active_connections[meeting_id].keys())
    }, exclude_user=user_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message["type"] == "offer":
                await send_to_user(meeting_id, message["target"], message)
            elif message["type"] == "answer":
                await send_to_user(meeting_id, message["target"], message)
            elif message["type"] == "ice-candidate":
                await send_to_user(meeting_id, message["target"], message)
            elif message["type"] == "chat":
                await broadcast_to_room(meeting_id, message)
            elif message["type"] == "mute":
                await broadcast_to_room(meeting_id, message, exclude_user=user_id)
            elif message["type"] == "video_toggle":
                await broadcast_to_room(meeting_id, message, exclude_user=user_id)
            
    except WebSocketDisconnect:
        # Remove user from room
        if meeting_id in active_connections and user_id in active_connections[meeting_id]:
            del active_connections[meeting_id][user_id]
            
            # Notify other users that someone left
            await broadcast_to_room(meeting_id, {
                "type": "user_left",
                "user_id": user_id,
                "participants": list(active_connections[meeting_id].keys())
            })
            
            # Clean up empty rooms
            if not active_connections[meeting_id]:
                del active_connections[meeting_id]

async def send_to_user(meeting_id: str, user_id: str, message: dict):
    """Send message to specific user in meeting"""
    if meeting_id in active_connections and user_id in active_connections[meeting_id]:
        try:
            await active_connections[meeting_id][user_id].send_text(json.dumps(message))
        except:
            # Connection might be closed, remove it
            del active_connections[meeting_id][user_id]

async def broadcast_to_room(meeting_id: str, message: dict, exclude_user: str = None):
    """Broadcast message to all users in meeting room"""
    if meeting_id not in active_connections:
        return
    
    for user_id, websocket in active_connections[meeting_id].items():
        if exclude_user and user_id == exclude_user:
            continue
        try:
            await websocket.send_text(json.dumps(message))
        except:
            # Connection might be closed, will be cleaned up later
            pass

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
