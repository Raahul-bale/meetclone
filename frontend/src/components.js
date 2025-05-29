import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import {
  FiVideo, FiVideoOff, FiMic, FiMicOff, FiMonitor, FiMessageSquare,
  FiUsers, FiSettings, FiMoreVertical, FiPhone, FiPhoneOff,
  FiSend, FiX, FiCopy, FiShare2, FiCamera, FiCalendar
} from 'react-icons/fi';

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Sample participant avatars
const AVATAR_IMAGES = [
  'https://images.unsplash.com/photo-1576558656222-ba66febe3dec',
  'https://images.unsplash.com/photo-1657128344786-360c3f8e57e5',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7'
];

const VIRTUAL_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
  'https://images.unsplash.com/photo-1533090161767-e6ffed986c88',
  'https://images.pexels.com/photos/373883/pexels-photo-373883.jpeg'
];

// HomePage Component
export const HomePage = () => {
  const navigate = useNavigate();
  const [hostName, setHostName] = useState('');
  const [isCreatingMeeting, setIsCreatingMeeting] = useState(false);

  const createMeeting = async () => {
    if (!hostName.trim()) {
      alert('Please enter your name');
      return;
    }

    setIsCreatingMeeting(true);
    try {
      const response = await fetch(`${API_BASE}/api/meetings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host_name: hostName,
          meeting_title: 'Quick Meeting'
        }),
      });
      
      const meeting = await response.json();
      localStorage.setItem('userName', hostName);
      navigate(`/lobby/${meeting.meeting_id}`);
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Failed to create meeting');
    } finally {
      setIsCreatingMeeting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <FiVideo className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Google Meet</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-800">Support</button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Sign in
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                Premium video meetings.<br />
                Now free for everyone.
              </h2>
              <p className="text-lg text-gray-600">
                We re-engineered the service we built for secure business meetings, 
                Google Meet, to make it free and available for all.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={createMeeting}
                  disabled={isCreatingMeeting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  <FiVideo className="w-5 h-5" />
                  <span>{isCreatingMeeting ? 'Creating...' : 'New meeting'}</span>
                </button>
                <button
                  onClick={() => navigate('/join')}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                >
                  <FiUsers className="w-5 h-5" />
                  <span>Join a meeting</span>
                </button>
              </div>

              {/* Name Input */}
              <div className="max-w-sm">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p>Learn more about <span className="text-blue-600 cursor-pointer hover:underline">Google Meet</span></p>
            </div>
          </div>

          {/* Right Content - Video Preview */}
          <div className="relative">
            <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video">
              <img
                src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b"
                alt="Video meeting preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Join Meeting Page
export const JoinMeetingPage = () => {
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const joinMeeting = async () => {
    if (!meetingId.trim() || !participantName.trim()) {
      alert('Please enter meeting ID and your name');
      return;
    }

    setIsJoining(true);
    try {
      const response = await fetch(`${API_BASE}/api/meetings/${meetingId.toUpperCase()}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meeting_id: meetingId.toUpperCase(),
          participant_name: participantName
        }),
      });
      
      const result = await response.json();
      if (result.error) {
        alert(result.error);
        return;
      }
      
      localStorage.setItem('userName', participantName);
      navigate(`/lobby/${meetingId.toUpperCase()}`);
    } catch (error) {
      console.error('Error joining meeting:', error);
      alert('Failed to join meeting');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUsers className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Join a meeting</h2>
          <p className="text-gray-600 mt-2">Enter the meeting ID to join</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting ID
            </label>
            <input
              type="text"
              placeholder="Enter meeting ID"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={joinMeeting}
            disabled={isJoining}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium"
          >
            {isJoining ? 'Joining...' : 'Join meeting'}
          </button>

          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:underline text-sm"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pre-Meeting Lobby
export const PreMeetingLobby = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef();
  const [localStream, setLocalStream] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [meeting, setMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get meeting details
    const fetchMeeting = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/meetings/${meetingId}`);
        const meetingData = await response.json();
        setMeeting(meetingData);
      } catch (error) {
        console.error('Error fetching meeting:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId]);

  useEffect(() => {
    // Get user media
    const getUserMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    getUserMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const joinMeeting = () => {
    navigate(`/meeting/${meetingId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold mb-2">Ready to join?</h1>
          <p className="text-gray-300">
            {meeting?.meeting_title || 'Meeting'} • {meetingId}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Video Preview */}
          <div className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!videoEnabled && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
                  <FiCamera className="w-8 h-8 text-gray-400" />
                </div>
              </div>
            )}
            
            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
              <button
                onClick={toggleVideo}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {videoEnabled ? <FiVideo className="w-6 h-6" /> : <FiVideoOff className="w-6 h-6" />}
              </button>
              <button
                onClick={toggleAudio}
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {audioEnabled ? <FiMic className="w-6 h-6" /> : <FiMicOff className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Meeting Info */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Meeting details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Meeting ID:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-mono text-lg">{meetingId}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(meetingId)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <FiCopy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Host:</span>
                  <div className="mt-1">{meeting?.host_name}</div>
                </div>
                <div>
                  <span className="text-gray-400">Participants:</span>
                  <div className="mt-1">{meeting?.participants?.length || 0} joined</div>
                </div>
              </div>
            </div>

            <button
              onClick={joinMeeting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg"
            >
              Join now
            </button>

            <div className="text-center">
              <button
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-gray-300"
              >
                Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Meeting Room Component
export const MeetingRoom = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [localStream, setLocalStream] = useState(null);
  const [peers, setPeers] = useState({});
  const [participants, setParticipants] = useState([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [userName] = useState(localStorage.getItem('userName') || 'Anonymous');
  const [userId] = useState(uuidv4());

  // Refs
  const localVideoRef = useRef();
  const peersRef = useRef({});
  const socketRef = useRef();

  // WebSocket and WebRTC setup
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize WebSocket connection
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = process.env.REACT_APP_BACKEND_URL?.replace('http://', '').replace('https://', '') || 'localhost:8000';
        const ws = new WebSocket(`${wsProtocol}//${wsHost}/ws/${meetingId}/${userId}`);
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          socketRef.current = ws;
          setSocket(ws);
        };

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          handleSocketMessage(message, stream);
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected');
        };

      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeConnection();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      Object.values(peersRef.current).forEach(peer => peer.destroy());
    };
  }, [meetingId, userId]);

  const handleSocketMessage = (message, stream) => {
    switch (message.type) {
      case 'user_joined':
        if (message.user_id !== userId) {
          createPeerConnection(message.user_id, true, stream);
          setParticipants(prev => [...new Set([...prev, message.user_id])]);
        }
        break;
      case 'user_left':
        if (peersRef.current[message.user_id]) {
          peersRef.current[message.user_id].destroy();
          delete peersRef.current[message.user_id];
          setPeers(prev => {
            const newPeers = { ...prev };
            delete newPeers[message.user_id];
            return newPeers;
          });
        }
        setParticipants(prev => prev.filter(id => id !== message.user_id));
        break;
      case 'offer':
        handleOffer(message, stream);
        break;
      case 'answer':
        handleAnswer(message);
        break;
      case 'ice-candidate':
        handleIceCandidate(message);
        break;
      case 'chat':
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          user: message.user || 'Anonymous',
          message: message.message,
          timestamp: new Date().toLocaleTimeString()
        }]);
        break;
    }
  };

  const createPeerConnection = (targetUserId, initiator, stream) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    peer.on('signal', (data) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: initiator ? 'offer' : 'answer',
          target: targetUserId,
          signal: data,
          user: userName
        }));
      }
    });

    peer.on('stream', (remoteStream) => {
      setPeers(prev => ({
        ...prev,
        [targetUserId]: {
          peer,
          stream: remoteStream,
          userId: targetUserId
        }
      }));
    });

    peer.on('error', (error) => {
      console.error('Peer error:', error);
    });

    if (stream) {
      peer.addStream(stream);
    }

    peersRef.current[targetUserId] = peer;
    return peer;
  };

  const handleOffer = (message, stream) => {
    const peer = createPeerConnection(message.user, false, stream);
    peer.signal(message.signal);
  };

  const handleAnswer = (message) => {
    const peer = peersRef.current[message.user];
    if (peer) {
      peer.signal(message.signal);
    }
  };

  const handleIceCandidate = (message) => {
    const peer = peersRef.current[message.user];
    if (peer) {
      peer.signal(message.signal);
    }
  };

  // Media controls
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
        
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({
            type: 'mute',
            user: userName,
            muted: !audioTrack.enabled
          }));
        }
      }
    }
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setIsScreenSharing(true);
      
      // Replace video track with screen share
      const videoTrack = screenStream.getVideoTracks()[0];
      Object.values(peersRef.current).forEach(peer => {
        const sender = peer._pc.getSenders().find(s => s.track?.kind === 'video');
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      });

      videoTrack.addEventListener('ended', () => {
        setIsScreenSharing(false);
        // Switch back to camera
        if (localStream) {
          const cameraTrack = localStream.getVideoTracks()[0];
          Object.values(peersRef.current).forEach(peer => {
            const sender = peer._pc.getSenders().find(s => s.track?.kind === 'video');
            if (sender) {
              sender.replaceTrack(cameraTrack);
            }
          });
        }
      });
    } catch (error) {
      console.error('Error starting screen share:', error);
    }
  };

  const sendChatMessage = () => {
    if (newMessage.trim() && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'chat',
        user: userName,
        message: newMessage.trim()
      }));
      setNewMessage('');
    }
  };

  const leaveMeeting = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    Object.values(peersRef.current).forEach(peer => peer.destroy());
    navigate('/');
  };

  // Generate participant grid
  const allParticipants = [
    {
      id: userId,
      name: userName,
      isLocal: true,
      stream: localStream,
      videoEnabled,
      audioEnabled
    },
    ...Object.values(peers).map(peerData => ({
      id: peerData.userId,
      name: `Participant ${peerData.userId.slice(0, 8)}`,
      isLocal: false,
      stream: peerData.stream,
      videoEnabled: true,
      audioEnabled: true
    }))
  ];

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">Meeting: {meetingId}</h1>
          <span className="text-sm text-gray-400">{allParticipants.length} participants</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">12:34 PM</span>
          <button className="text-gray-400 hover:text-white">
            <FiMoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Video Area */}
        <div className="flex-1 p-4">
          <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allParticipants.map((participant) => (
              <ParticipantVideo
                key={participant.id}
                participant={participant}
                isLocal={participant.isLocal}
                localVideoRef={participant.isLocal ? localVideoRef : null}
              />
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-blue-400">{msg.user}</span>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                  <div className="text-gray-300">{msg.message}</div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendChatMessage}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={toggleAudio}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              audioEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {audioEnabled ? <FiMic className="w-6 h-6" /> : <FiMicOff className="w-6 h-6" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              videoEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {videoEnabled ? <FiVideo className="w-6 h-6" /> : <FiVideoOff className="w-6 h-6" />}
          </button>

          <button
            onClick={startScreenShare}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <FiMonitor className="w-6 h-6" />
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              showChat ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <FiMessageSquare className="w-6 h-6" />
          </button>

          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
          >
            <FiUsers className="w-6 h-6" />
          </button>

          <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center">
            <FiSettings className="w-6 h-6" />
          </button>

          <button
            onClick={leaveMeeting}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center"
          >
            <FiPhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Participant Video Component
const ParticipantVideo = ({ participant, isLocal, localVideoRef }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (!isLocal && videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream, isLocal]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
      <video
        ref={isLocal ? localVideoRef : videoRef}
        autoPlay
        muted={isLocal}
        playsInline
        className="w-full h-full object-cover"
      />
      
      {!participant.videoEnabled && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-xl font-semibold text-white">
              {participant.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <span className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          {participant.name} {isLocal && '(You)'}
        </span>
        <div className="flex space-x-1">
          {!participant.audioEnabled && (
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
              <FiMicOff className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};