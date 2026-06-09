import React, { useEffect, useRef, useState } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({
  src,
  script,
  forceTTS = false,
  autoPlay = true,
  autoPlayDelay = 0,
  startLabel = 'Phat lai loi giang',
  replayLabel = 'Phat lai loi giang',
  onStarted,
  onEnded
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const handleTTS = () => {
    if (!script || !window.speechSynthesis) {
      onEnded?.();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = 'vi-VN';
      utterance.onstart = () => {
        setIsPlaying(true);
        onStarted?.();
      };
      utterance.onend = () => {
        setIsPlaying(false);
        setHasPlayed(true);
        onEnded?.();
      };
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS error:', err);
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    setAudioError(false);
    setHasPlayed(false);
    setIsPlaying(false);
    if (forceTTS) {
      if (!autoPlay) return;
      const timer = setTimeout(handleTTS, autoPlayDelay);
      return () => clearTimeout(timer);
    }
    if (!autoPlay) {
      if (audioRef.current) audioRef.current.load();
      return;
    }
    if (audioRef.current) {
      audioRef.current.load();
      const timer = setTimeout(() => {
        audioRef.current?.play().catch((err) => {
          console.warn('Audio auto-play blocked or failed:', err);
          setIsPlaying(false);
        });
      }, autoPlayDelay);
      return () => clearTimeout(timer);
    }
  }, [src, forceTTS, autoPlay, autoPlayDelay]);

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
        onPlay={() => {
          setIsPlaying(true);
          onStarted?.();
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setHasPlayed(true);
          onEnded?.();
        }}
        onError={handleAudioError}
      />
      <button className="replay-btn" onClick={handleReplay} title="Phat lai loi giang">
        {isPlaying ? 'Dang phat...' : (hasPlayed ? replayLabel : startLabel)}
        {(audioError || forceTTS) && <span className="tts-indicator">(TTS)</span>}
      </button>
    </div>
  );
};

export default AudioPlayer;
