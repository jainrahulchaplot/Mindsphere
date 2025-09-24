import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

interface AudioContextType {
  currentAudio: HTMLAudioElement | null;
  currentAudioType: 'ambient' | 'session' | null;
  playAudio: (audio: HTMLAudioElement, type: 'ambient' | 'session') => void;
  stopAllAudio: () => void;
  isPlaying: (type: 'ambient' | 'session') => boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [currentAudioType, setCurrentAudioType] = useState<'ambient' | 'session' | null>(null);

  const stopAllAudio = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setCurrentAudioType(null);
    }
  }, [currentAudio]);

  const playAudio = useCallback((audio: HTMLAudioElement, type: 'ambient' | 'session') => {
    // Stop any currently playing audio
    stopAllAudio();
    
    // Set up the new audio
    setCurrentAudio(audio);
    setCurrentAudioType(type);
    
    // Play the new audio
    audio.play().catch((error) => {
      console.warn('Audio play failed:', error);
      setCurrentAudio(null);
      setCurrentAudioType(null);
    });
  }, [stopAllAudio]);

  const isPlaying = useCallback((type: 'ambient' | 'session') => {
    return currentAudioType === type && currentAudio && !currentAudio.paused;
  }, [currentAudioType, currentAudio]);

  return (
    <AudioContext.Provider value={{
      currentAudio,
      currentAudioType,
      playAudio,
      stopAllAudio,
      isPlaying
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
