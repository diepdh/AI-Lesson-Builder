import React, { useEffect, useRef, useState } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ src, script, forceTTS = false }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);

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

  useEffect(() => {
    setAudioError(false);
    if (forceTTS) {
      handleTTS();
      return;
    }
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch((err) => {
        console.warn('Audio auto-play blocked or failed:', err);
        setIsPlaying(false);
      });
    }
  }, [src, forceTTS]);

  const handleAudioError = () => {
    console.warn('Audio file failed to load, falling back to TTS');
    setAudioError(true);
    handleTTS();
  };

  const handleReplay = () => {
    if (forceTTS || audioError) {
      handleTTS();
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

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
        style={{ display: forceTTS ? 'none' : 'block' }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={handleAudioError}
      />
      <button className="replay-btn" onClick={handleReplay} title="Phat lai loi giang">
        {isPlaying ? 'Dang phat...' : 'Phat lai loi giang'}
        {(audioError || forceTTS) && <span className="tts-indicator">(TTS)</span>}
      </button>
    </div>
  );
};

export default AudioPlayer;
