import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Room, RoomEvent, RemoteParticipant, RemoteTrack, RemoteTrackPublication, Track } from 'livekit-client';

export default function VoiceInterface() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const serverUrl = searchParams.get('serverUrl') || '';
  const roomName = searchParams.get('roomName') || '';
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');

  useEffect(() => {
    if (!token || !serverUrl || !roomName) {
      setError('Missing connection parameters');
      return;
    }

    connectToRoom();
    
    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [token, serverUrl, roomName]);

  const connectToRoom = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
        publishDefaults: {
          videoSimulcastLayers: [],
        },
      });

      // Set up event handlers
      newRoom.on(RoomEvent.Connected, () => {
        console.log('Connected to room');
        setIsConnected(true);
        setIsConnecting(false);
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from room');
        setIsConnected(false);
      });

      newRoom.on(RoomEvent.DataReceived, (payload: Uint8Array, participant?: RemoteParticipant) => {
        const decoder = new TextDecoder();
        const message = decoder.decode(payload);
        setTranscript(prev => prev + message + '\n');
      });

      newRoom.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        if (track.kind === Track.Kind.Audio) {
          const audioElement = track.attach();
          audioElement.play();
        }
      });

      // Connect to the room
      await newRoom.connect(serverUrl, token);
      setRoom(newRoom);

    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect');
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (room) {
      room.disconnect();
      setRoom(null);
      setIsConnected(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Voice Meditation Assistant
          </h1>
          
          {isConnecting && (
            <div className="text-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Connecting to voice session...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {isConnected && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">Connected to Voice Session</span>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                You can now speak with your AI meditation guide. The assistant will respond to your voice.
              </p>
              <button
                onClick={disconnect}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                End Session
              </button>
            </div>
          )}

          {transcript && (
            <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
              <h3 className="text-white font-medium mb-2">Conversation:</h3>
              <div className="text-gray-300 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                {transcript}
              </div>
            </div>
          )}

          <div className="text-center text-gray-500 text-sm">
            <p>Room: {roomName}</p>
            <p>Status: {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
