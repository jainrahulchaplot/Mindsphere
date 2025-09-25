import { useState, useRef, useEffect } from 'react';
import { useVoiceSTT } from '../api/hooks';
import { MicrophoneIcon, MicrophoneRecordingIcon, StopIcon, LoadingIcon } from './LuxuryIcons';
import Card from './Card';

type Props = {
  onTranscription: (text: string) => void;
  userId?: string;
  sessionId?: string;
};

export default function VoiceJournal({ onTranscription, userId, sessionId }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const sttMutation = useVoiceSTT();

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Find supported mime type
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg'
      ];
      
      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType || undefined
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Microphone access denied. Please check your browser settings.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      if (userId) formData.append('user_id', userId);
      if (sessionId) formData.append('session_id', sessionId);
      formData.append('duration_sec', duration.toString());
      
      const result = await sttMutation.mutateAsync(formData);
      onTranscription(result.text);
      
    } catch (err) {
      console.error('STT error:', err);
      setError('Failed to transcribe audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <div className="heading">Voice Journal</div>
      <div className="subtle mt-1">Tap and hold to record</div>
      
      <div className="mt-3 flex items-center gap-3">
        <button
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
            isRecording 
              ? 'border-red-500 bg-red-500/20 animate-pulse' 
              : 'border-white/30 bg-white/10 hover:bg-white/20'
          }`}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          disabled={isProcessing}
        >
          {isProcessing ? <LoadingIcon className="w-5 h-5" /> : isRecording ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
        </button>
        
        <div className="flex-1">
          {isRecording && (
            <div className="text-xs text-silver">
              Recording: {formatDuration(duration)}
            </div>
          )}
          {isProcessing && (
            <div className="text-xs text-silver">
              Processing...
            </div>
          )}
          {!isRecording && !isProcessing && (
            <div className="text-xs text-silver">
              Hold to record
            </div>
          )}
          
          {/* Progress bar */}
          {(isRecording || isProcessing) && (
            <div className="mt-1 w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/30 rounded-full transition-all duration-1000"
                style={{ 
                  width: isProcessing ? '100%' : `${Math.min((duration / 60) * 100, 100)}%` 
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
          {error}
        </div>
      )}
    </Card>
  );
}
