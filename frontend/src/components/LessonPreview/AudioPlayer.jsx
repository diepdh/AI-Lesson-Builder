import React, { useEffect, useRef, useState } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ src, script }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    setAudioError(false);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(err => {
        console.warn('Audio auto-play blocked or failed:', err);
        setIsPlaying(false);
      });
    }
  }, [src]);

  const handleAudioError = () => {
    console.warn('Audio file failed to load, falling back to TTS');
    setAudioError(true);
    handleTTS();
  };

  const handleTTS = () => {
    if (!script || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = 'vi-VN';
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS error:', err);
      setIsPlaying(false);
    }
  };

  const handleReplay = () => {
    if (audioError) {
      handleTTS();
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch (err) {
          // ignore
        }
      }
    };
  }, []);

  return (
    <div className="audio-player">
      <audio 
        ref={audioRef} 
        src={src} 
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={handleAudioError}
      />
      <button className="replay-btn" onClick={handleReplay} title="Phát lại lời giảng">
        {isPlaying ? '🔊 Đang phát...' : '▶️ Phát lại lời giảng'}
        {audioError && <span className="tts-indicator">(TTS)</span>}
      </button>
    </div>
  );
};

export default AudioPlayer;
