import React, { useEffect, useState } from 'react';
import { Room, RoomEvent, RemoteParticipant, RemoteTrack, RemoteTrackPublication, Track } from 'livekit-client';

interface VoiceInterfaceProps {
  token: string;
  serverUrl: string;
  roomName: string;
}

export default function VoiceInterface({ token, serverUrl, roomName }: VoiceInterfaceProps) {
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
    <div className="voice-interface">
      <div className="text-center space-y-3">
        <h3 className="text-lg font-semibold text-white mb-3">Voice Session</h3>
        
        {isConnecting && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-blue-400 text-sm">Connecting...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {isConnected && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium text-sm">Connected</span>
            </div>
            <p className="text-gray-300 text-xs">Speak naturally with your meditation guide</p>
          </div>
        )}

        {transcript && (
          <div className="bg-gray-700/50 rounded-lg p-3 max-h-32 overflow-y-auto">
            <h4 className="text-white font-medium text-sm mb-1">Conversation:</h4>
            <div className="text-gray-300 text-xs whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        )}

        {!isConnected && !isConnecting && !error && (
          <button
            onClick={connectToRoom}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
          >
            Connect to Voice Session
          </button>
        )}
        
        {isConnected && (
          <button
            onClick={disconnect}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}
