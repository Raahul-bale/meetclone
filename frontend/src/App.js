import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import {
  HomePage,
  MeetingRoom,
  JoinMeetingPage,
  PreMeetingLobby
} from './components';

// Main App Component
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/join" element={<JoinMeetingPage />} />
          <Route path="/lobby/:meetingId" element={<PreMeetingLobby />} />
          <Route path="/meeting/:meetingId" element={<MeetingRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;