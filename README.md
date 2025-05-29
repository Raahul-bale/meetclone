# Google Meet Clone 🎥

A fully functional Google Meet clone with real-time video conferencing, screen sharing, chat messaging, and participant management. Built with modern web technologies including WebRTC, React.js, FastAPI, and MongoDB.

![Google Meet Clone Homepage](https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&h=400&fit=crop)

## 🚀 Features

### ✅ Core Video Conferencing
- **Real-time video/audio streaming** using WebRTC
- **Peer-to-peer communication** with STUN/TURN servers
- **Multiple participants support** with dynamic grid layout
- **Camera and microphone controls** (mute/unmute, video on/off)
- **Low-latency streaming** optimized for performance

### ✅ Meeting Management
- **Create instant meetings** with unique meeting IDs
- **Join meetings via ID or direct link**
- **Pre-meeting lobby** with camera preview
- **Participant management** (join/leave notifications)
- **Meeting persistence** with MongoDB storage

### ✅ Communication Features
- **Real-time chat messaging** during meetings
- **Screen sharing capability**
- **Live participant indicators**
- **Audio/video status indicators**
- **Meeting room notifications**

### ✅ User Interface
- **Pixel-perfect Google Meet replica**
- **Responsive design** for all screen sizes
- **Material Design components**
- **Smooth animations and transitions**
- **Professional meeting controls**

## 🛠️ Technology Stack

### Frontend
- **React.js 18+** - Modern UI framework
- **React Router Dom** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **Socket.io Client** - Real-time communication
- **Simple Peer** - WebRTC wrapper for easy P2P connections
- **UUID** - Unique identifier generation

### Backend
- **FastAPI** - Modern Python web framework
- **Python Socket.IO** - WebSocket support
- **Motor** - Async MongoDB driver
- **Uvicorn** - ASGI server
- **WebSockets** - Real-time bi-directional communication
- **CORS Middleware** - Cross-origin resource sharing

### Database
- **MongoDB** - NoSQL database for meeting data
- **Motor (AsyncIO)** - Async MongoDB integration

### Real-time Communication
- **WebRTC** - Peer-to-peer video/audio streaming
- **Socket.io** - WebSocket-based signaling server
- **STUN Servers** - NAT traversal (Google STUN servers)
- **Simple Peer** - WebRTC abstraction library

### Development Tools
- **VS Code** - Recommended IDE
- **Yarn** - Package manager
- **Supervisor** - Process management
- **Docker** - Containerization (optional)

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (v4.4 or higher)
- **Yarn** package manager
- **VS Code** (recommended)

### VS Code Extensions (Recommended)
- **Python** (ms-python.python)
- **JavaScript and TypeScript** (ms-vscode.vscode-typescript-next)
- **React Extension Pack** (jawandarajbir.react-vscode-extension-pack)
- **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss)
- **MongoDB for VS Code** (mongodb.mongodb-vscode)

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/google-meet-clone.git
cd google-meet-clone
```

### 2. Environment Setup

#### Backend Environment
```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file in `/backend` directory:
```env
MONGO_URL=mongodb://localhost:27017/google_meet_clone
PORT=8000
```

#### Frontend Environment
```bash
cd frontend
yarn install
```

Create `.env` file in `/frontend` directory:
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

### 3. Start MongoDB
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 4. Run the Application

#### Option A: Using Supervisor (Recommended)
```bash
# Install supervisor
pip install supervisor

# Start all services
sudo supervisorctl start all
```

#### Option B: Manual Start
```bash
# Terminal 1 - Backend
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
yarn start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔧 Running in VS Code

### 1. Open Project in VS Code
```bash
code google-meet-clone
```

### 2. Configure VS Code Workspace

Create `.vscode/settings.json`:
```json
{
  "python.defaultInterpreterPath": "./backend/venv/bin/python",
  "python.terminal.activateEnvironment": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "HTML"
  },
  "files.associations": {
    "*.js": "javascriptreact"
  }
}
```

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/backend/server.py",
      "console": "integratedTerminal",
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "PYTHONPATH": "${workspaceFolder}/backend"
      }
    },
    {
      "name": "Launch React",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/frontend",
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["start"]
    }
  ]
}
```

### 3. Install VS Code Extensions
```bash
# Install recommended extensions
code --install-extension ms-python.python
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension jawandarajbir.react-vscode-extension-pack
code --install-extension bradlc.vscode-tailwindcss
code --install-extension mongodb.mongodb-vscode
```

### 4. Debug Configuration

#### Debug Backend (F5)
1. Open `backend/server.py`
2. Set breakpoints
3. Press F5 or go to Run → Start Debugging
4. Select "Python: FastAPI"

#### Debug Frontend
1. Open `frontend/src/App.js`
2. Press F5 or go to Run → Start Debugging
3. Select "Launch React"

### 5. Integrated Terminal Setup
```bash
# Split terminal for both frontend and backend
# Terminal 1: Backend
cd backend && python -m uvicorn server:app --reload

# Terminal 2: Frontend  
cd frontend && yarn start
```

## 📁 Project Structure

```
google-meet-clone/
├── frontend/                    # React frontend application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components.js       # All React components
│   │   ├── App.js             # Main App component
│   │   ├── App.css            # Styles and animations
│   │   └── index.js           # Entry point
│   ├── package.json           # Frontend dependencies
│   └── .env                   # Frontend environment variables
├── backend/                    # FastAPI backend application
│   ├── server.py              # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Backend environment variables
├── tests/                     # Test files
├── scripts/                   # Utility scripts
├── .vscode/                   # VS Code configuration
│   ├── settings.json          # Workspace settings
│   └── launch.json           # Debug configurations
├── supervisord.conf           # Process management
└── README.md                  # Project documentation
```

## 🔗 API Endpoints

### Meeting Management
```http
POST   /api/meetings                    # Create new meeting
GET    /api/meetings/{meeting_id}       # Get meeting details
POST   /api/meetings/{meeting_id}/join  # Join existing meeting
```

### WebSocket Endpoints
```http
WS     /ws/{meeting_id}/{user_id}       # Real-time meeting communication
```

### Example API Usage

#### Create Meeting
```bash
curl -X POST "http://localhost:8000/api/meetings" \
     -H "Content-Type: application/json" \
     -d '{"host_name": "John Doe", "meeting_title": "Team Standup"}'
```

#### Join Meeting
```bash
curl -X POST "http://localhost:8000/api/meetings/ABC123/join" \
     -H "Content-Type: application/json" \
     -d '{"meeting_id": "ABC123", "participant_name": "Jane Smith"}'
```

## 🚦 Usage Guide

### Creating a Meeting
1. Open http://localhost:3000
2. Enter your name in the input field
3. Click "New meeting" button
4. You'll be redirected to the pre-meeting lobby
5. Adjust your camera/microphone settings
6. Click "Join now" to enter the meeting

### Joining a Meeting
1. Go to http://localhost:3000/join
2. Enter the meeting ID (e.g., "645127CD")
3. Enter your name
4. Click "Join meeting"
5. You'll enter the pre-meeting lobby
6. Click "Join now" to enter the meeting

### During the Meeting
- **Mute/Unmute**: Click the microphone button
- **Video On/Off**: Click the camera button
- **Screen Share**: Click the monitor button
- **Chat**: Click the message button to open chat panel
- **Participants**: Click the people button to see participants
- **Leave**: Click the red phone button to exit

### Inviting Others
Share either:
- **Meeting ID**: `645127CD` (users join via /join page)
- **Direct Link**: `http://localhost:3000/meeting/645127CD`
- **Lobby Link**: `http://localhost:3000/lobby/645127CD`

## 🛠️ Development

### Adding New Features

#### Frontend Development
```bash
cd frontend
yarn start          # Start development server
yarn build          # Build for production
yarn test           # Run tests
```

#### Backend Development
```bash
cd backend
uvicorn server:app --reload    # Start with hot reload
python -m pytest              # Run tests
pip install -r requirements.txt  # Install dependencies
```

### Code Structure

#### Frontend Components
- `HomePage` - Landing page with meeting creation
- `JoinMeetingPage` - Meeting joining interface
- `PreMeetingLobby` - Camera preview and settings
- `MeetingRoom` - Main video conferencing interface
- `ParticipantVideo` - Individual participant video component

#### Backend Architecture
- FastAPI application with WebSocket support
- MongoDB for meeting persistence
- Real-time signaling for WebRTC connections
- RESTful API for meeting management

## 🔧 Configuration

### WebRTC Configuration
STUN servers are configured in the frontend:
```javascript
{
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
}
```

### MongoDB Configuration
Database collections:
- `meetings` - Meeting room data and participants
- `messages` - Chat message history (optional)

### Environment Variables

#### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

#### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017/google_meet_clone
PORT=8000
```

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

#### MongoDB Connection Issues
```bash
# Check MongoDB status
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux

# Restart MongoDB
brew services restart mongodb-community  # macOS
sudo systemctl restart mongod           # Linux
```

#### Camera/Microphone Access
- Ensure HTTPS is used in production
- Check browser permissions for camera/microphone
- Test in Chrome/Firefox (best WebRTC support)

#### WebSocket Connection Issues
- Check firewall settings
- Verify backend is running on correct port
- Check CORS configuration

### Debug Mode

#### Enable Verbose Logging
```javascript
// Frontend - Add to components.js
const DEBUG = true;
if (DEBUG) console.log('Debug info:', data);
```

```python
# Backend - Add to server.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

## 📱 Browser Support

| Browser | Version | Video | Audio | Screen Share |
|---------|---------|-------|-------|--------------|
| Chrome  | 70+     | ✅     | ✅     | ✅            |
| Firefox | 60+     | ✅     | ✅     | ✅            |
| Safari  | 12+     | ✅     | ✅     | ⚠️            |
| Edge    | 79+     | ✅     | ✅     | ✅            |

## 🚀 Deployment

### Production Build
```bash
# Frontend
cd frontend
yarn build

# Backend
cd backend
pip install gunicorn
gunicorn server:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Docker Deployment
```dockerfile
# Dockerfile example
FROM node:16 AS frontend
WORKDIR /app/frontend
COPY frontend/ .
RUN yarn install && yarn build

FROM python:3.9
WORKDIR /app
COPY backend/ ./backend/
COPY --from=frontend /app/frontend/build ./frontend/build
RUN pip install -r backend/requirements.txt
CMD ["uvicorn", "backend.server:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow PEP 8 for Python code
- Use ESLint for JavaScript code
- Add tests for new features
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Meet for design inspiration
- WebRTC community for excellent documentation
- React and FastAPI teams for amazing frameworks
- All contributors and testers

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation at `/docs`

---

**Made with ❤️ using React, FastAPI, and WebRTC**

*Happy video conferencing! 🎥*