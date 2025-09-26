import React, { useState } from 'react';

interface VoiceAgentProps {
  onSessionStart?: () => void;
  onSessionEnd?: () => void;
  className?: string;
}

export default function VoiceAgent({ onSessionStart, onSessionEnd, className = '' }: VoiceAgentProps) {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      
      // Get token from backend API
      const response = await fetch('/api/voice/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomName: `meditation_room_${Math.floor(Math.random() * 10_000)}`,
          participantName: 'MindSphere User'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get connection token');
      }
      
      const connectionData = await response.json();
      
      // Open the voice interface in a new window with connection data
      const voiceUrl = `/voice-interface?token=${encodeURIComponent(connectionData.token)}&serverUrl=${encodeURIComponent(connectionData.serverUrl)}&roomName=${encodeURIComponent(connectionData.roomName)}`;
      const newWindow = window.open(voiceUrl, '_blank', 'width=1200,height=800');
      
      if (newWindow) {
        setSessionStarted(true);
        onSessionStart?.();
      } else {
        throw new Error('Failed to open voice session window');
      }
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to start voice session. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const endSession = () => {
    setSessionStarted(false);
    onSessionEnd?.();
  };

  return (
    <div className={`voice-agent-container ${className}`}>
      {!sessionStarted ? (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            Voice Meditation Assistant
          </h3>
          <p className="text-gray-400 mb-6">
            Start a voice conversation with your AI meditation guide
          </p>
          <button
            onClick={startSession}
            disabled={isConnecting}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            {isConnecting ? 'Opening...' : 'Start Voice Session'}
          </button>
          <p className="text-gray-500 text-sm">
            Opens in a new window for the best voice experience
          </p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Voice Session Active</span>
            </div>
            <p className="text-gray-300 text-sm">
              Voice session is running in a separate window
            </p>
          </div>
          
          <button
            onClick={endSession}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            End Session
          </button>
        </div>
      )}
    </div>
  );
}
