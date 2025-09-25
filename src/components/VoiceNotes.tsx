import { useState, useRef, useEffect } from 'react';
import { useSTT } from '../api/hooks';
import { MicrophoneIcon, MicrophoneRecordingIcon } from './LuxuryIcons';

type Props = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  userId: string;
};

type RecordingState = 'idle' | 'recording' | 'processing';

export default function VoiceNotes({ value, onChange, disabled, userId }: Props) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const stt = useSTT();

  // Initialize audio context and analyser for waveform
  useEffect(() => {
    if (recordingState === 'recording' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(streamRef.current!);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (recordingState !== 'recording') return;
        
        analyser.getByteFrequencyData(dataArray);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * canvas.height;
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          
          x += barWidth + 1;
        }

        animationRef.current = requestAnimationFrame(draw);
      };

      draw();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [recordingState]);

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      setRecordingTime(0);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;

      // Set up MediaRecorder - prioritize formats that Whisper supports well
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/wav'
      ];

      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          console.log('Selected MIME type for recording:', mimeType);
          break;
        }
      }
      
      if (!selectedMimeType) {
        console.warn('No supported MIME type found, using default');
        selectedMimeType = 'audio/webm';
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType || undefined
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: selectedMimeType || 'audio/webm' 
        });
        processRecording(audioBlob);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setRecordingState('recording');

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Microphone access denied. Please allow microphone access and try again.');
      setRecordingState('idle');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('processing');
    }
  };

  // Cancel recording
  const cancelRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setRecordingState('idle');
    setRecordingTime(0);
    audioChunksRef.current = [];
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Process recording with STT
  const processRecording = async (audioBlob: Blob) => {
    try {
      setRecordingState('processing');
      
      const audioFile = new File([audioBlob], 'recording.webm', { 
        type: audioBlob.type || 'audio/webm' 
      });

      console.log('Sending audio file to STT:', {
        name: audioFile.name,
        type: audioFile.type,
        size: audioFile.size,
        blobType: audioBlob.type
      });

      const result = await stt.mutateAsync({
        audio: audioFile,
        user_id: userId
      });

      // Append transcription to existing notes
      const newValue = value ? `${value} ${result.text}` : result.text;
      onChange(newValue);
      
      setRecordingState('idle');
      setRecordingTime(0);

    } catch (error) {
      console.error('STT error:', error);
      setError('Transcription failed. Please try again.');
      setRecordingState('idle');
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-silver">Notes (optional)</label>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Add your thoughts or use voice notes..."
          className="w-full bg-graphite text-white border border-white/10 rounded-lg px-3 py-2 placeholder-silver/60 focus:outline-none focus:ring-2 focus:ring-white/10 text-xs resize-none"
          rows={3}
          disabled={disabled || recordingState === 'processing'}
        />
        
        {/* Voice controls */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          {recordingState === 'idle' && (
            <button
              onClick={startRecording}
              disabled={disabled}
              className="w-8 h-8 flex items-center justify-center text-silver hover:text-white transition-colors rounded-lg hover:bg-white/10"
              title="Record voice note"
              aria-label="Start recording voice note"
            >
              <MicrophoneIcon className="w-4 h-4" />
            </button>
          )}
          
          {recordingState === 'recording' && (
            <>
              <div className="text-xs text-silver">
                {formatTime(recordingTime)}
              </div>
              <button
                onClick={stopRecording}
                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors rounded-lg hover:bg-red-500/10"
                title="Stop recording"
                aria-label="Stop recording"
              >
                ⏹
              </button>
              <button
                onClick={cancelRecording}
                className="w-8 h-8 flex items-center justify-center text-silver hover:text-white transition-colors rounded-lg hover:bg-white/10"
                title="Cancel recording"
                aria-label="Cancel recording"
              >
                ✕
              </button>
            </>
          )}
          
          {recordingState === 'processing' && (
            <div className="w-8 h-8 flex items-center justify-center text-silver">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>

      {/* Waveform visualization */}
      {recordingState === 'recording' && (
        <div className="h-8 bg-black/20 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={200}
            height={32}
            className="w-full h-full"
          />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-xs text-red-400 flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-silver hover:text-white"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* STT error */}
      {stt.isError && (
        <div className="text-xs text-red-400 flex items-center gap-2">
          <span>⚠️</span>
          <span>Transcription failed. Please try again.</span>
          <button
            onClick={() => stt.reset()}
            className="text-silver hover:text-white"
            aria-label="Retry transcription"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
