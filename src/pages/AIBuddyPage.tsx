import { useState, useEffect, useRef } from 'react';
import { Room, RoomEvent, Track, RemoteParticipant, RemoteTrack } from 'livekit-client';
import { api } from '../api/client';

export default function AIBuddyPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conversationLog, setConversationLog] = useState<string[]>([]);
  const [audioDebug, setAudioDebug] = useState<string[]>([]);
  const [roomInfo, setRoomInfo] = useState<any>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element for playback
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = 0.8;
    }
  }, []);

  const connectToRoom = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Get LiveKit token from backend
      const response = await api.post('/livekit/token');
      const { token, url, roomName, roomId } = response.data;
      
      setAudioDebug(prev => [...prev, `Token received for room: ${roomName}`]);
      setRoomInfo({ roomName, roomId, url });

      // Create new room instance
      const newRoom = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      // Set up event listeners BEFORE connecting
      newRoom.on(RoomEvent.Connected, () => {
        console.log('🎤 Connected to LiveKit room');
        setIsConnected(true);
        setIsConnecting(false);
        setConversationLog(prev => [...prev, 'Connected to AI Buddy']);
        setAudioDebug(prev => [...prev, `Connected to room: ${newRoom.name}`]);
        
        // Debug participants - now safe to access after connection
        console.log("me:", newRoom.localParticipant.identity);
        console.log("remote count:", newRoom.participants?.size || 0);
        if (newRoom.participants) {
          for (const [id, p] of newRoom.participants) {
            console.log("remote:", id, p.identity);
            setAudioDebug(prev => [...prev, `Remote participant: ${p.identity}`]);
          }
        }
        
        // Start audio to unlock playback
        newRoom.startAudio().catch(console.error);
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log('🎤 Disconnected from LiveKit room');
        setIsConnected(false);
        setConversationLog(prev => [...prev, 'Disconnected from AI Buddy']);
      });

      newRoom.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _publication, participant: RemoteParticipant) => {
        console.log('🎵 Track subscribed:', track.kind, 'from', participant.identity);
        setAudioDebug(prev => [...prev, `Track subscribed: ${track.kind} from ${participant.identity}`]);
        
        if (track.kind === Track.Kind.Audio) {
          // Play the audio track
          const audioElement = track.attach();
          if (audioRef.current && audioElement) {
            audioRef.current.srcObject = audioElement as unknown as MediaStream;
            audioRef.current.play().catch(console.error);
            setAudioDebug(prev => [...prev, `Audio track attached and playing`]);
          }
        }
      });

      newRoom.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
        console.log('🎵 Track unsubscribed:', track.kind);
        track.detach();
      });

      newRoom.on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        console.log('👤 Participant connected:', participant.identity);
        setConversationLog(prev => [...prev, `AI Buddy joined the conversation`]);
        setAudioDebug(prev => [...prev, `Participant connected: ${participant.identity}`]);
        
        // Debug current participants after new one joins
        console.log("Updated remote count:", newRoom.participants.size);
        for (const [id, p] of newRoom.participants) {
          console.log("remote:", id, p.identity);
        }
      });

      newRoom.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        console.log('👤 Participant disconnected:', participant.identity);
        setConversationLog(prev => [...prev, `AI Buddy left the conversation`]);
        setAudioDebug(prev => [...prev, `Participant disconnected: ${participant.identity}`]);
        
        // Debug current participants after one leaves
        console.log("Updated remote count:", newRoom.participants.size);
        for (const [id, p] of newRoom.participants) {
          console.log("remote:", id, p.identity);
        }
      });

      // Connect to room
      await newRoom.connect(url, token);
      setRoom(newRoom);

      // Enable microphone
      await newRoom.localParticipant.enableCameraAndMicrophone();

    } catch (err: any) {
      console.error('❌ Failed to connect to room:', err);
      setError(err.message || 'Failed to connect to AI Buddy');
      setIsConnecting(false);
    }
  };

  const disconnectFromRoom = async () => {
    if (room) {
      try {
        // Notify backend to disconnect agent
        await api.post('/livekit/disconnect', { roomName: room.name });
      } catch (error) {
        console.error('Failed to notify backend of disconnect:', error);
      }
      
      await room.disconnect();
      setRoom(null);
      setIsConnected(false);
      setConversationLog(prev => [...prev, 'Disconnected from AI Buddy']);
    }
  };

  const toggleMute = async () => {
    if (room) {
      if (isMuted) {
        await room.localParticipant.setMicrophoneEnabled(true);
        setIsMuted(false);
      } else {
        await room.localParticipant.setMicrophoneEnabled(false);
        setIsMuted(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container-narrow py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">
            AI Buddy
          </h1>
          <p className="text-gray-400 text-lg">
            Your personal AI companion for mindfulness and growth
          </p>
        </div>
        
        {/* Connection Status */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-white font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              {!isConnected && (
                <button
                  onClick={connectToRoom}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isConnecting ? 'Connecting...' : 'Start Conversation'}
                </button>
              )}
              
              {isConnected && (
                <button
                  onClick={disconnectFromRoom}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  End Conversation
                </button>
              )}
            </div>

            {isConnected && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={toggleMute}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isMuted 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
                
                <div className="text-sm text-gray-400">
                  {isMuted ? 'Microphone is muted' : 'Microphone is active'}
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Room Info */}
        {roomInfo && (
          <div className="max-w-2xl mx-auto mb-4">
            <div className="bg-blue-900/50 rounded-2xl p-6 border border-blue-700/50">
              <h3 className="text-blue-200 font-medium mb-4">Room Information</h3>
              <div className="text-sm text-blue-300 space-y-1">
                <div>Room Name: {roomInfo.roomName}</div>
                <div>Room ID: {roomInfo.roomId}</div>
                <div>URL: {roomInfo.url}</div>
              </div>
            </div>
          </div>
        )}

        {/* Audio Debug */}
        {audioDebug.length > 0 && (
          <div className="max-w-2xl mx-auto mb-4">
            <div className="bg-yellow-900/50 rounded-2xl p-6 border border-yellow-700/50">
              <h3 className="text-yellow-200 font-medium mb-4">Audio Debug</h3>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {audioDebug.map((log, index) => (
                  <div key={index} className="text-sm text-yellow-300">{log}</div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conversation Log */}
        {conversationLog.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-white font-medium mb-4">Conversation Log</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {conversationLog.map((log, index) => (
                  <div key={index} className="text-sm text-gray-300">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!isConnected && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  Ready to Talk?
                </h2>
                <p className="text-gray-400">
                  Click "Start Conversation" to begin talking with your AI buddy. 
                  The AI will listen to you speak and respond with voice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
