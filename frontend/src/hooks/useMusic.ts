import { useState, useRef, useEffect } from 'react';

export function useMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayAttemptedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio('/textures/interstellar.mp3');
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Auto-play after 1 second (silenciosamente, pois pode ser bloqueado)
    if (!autoPlayAttemptedRef.current) {
      autoPlayAttemptedRef.current = true;
      setTimeout(() => {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay bloqueado pelo navegador - comportamento esperado
          // Não logar erro, pois é normal e o usuário pode iniciar manualmente
        });
      }, 1000);
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error('Erro ao reproduzir música:', err);
      });
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return {
    isPlaying,
    volume,
    setVolume,
    play,
    pause,
    toggle,
  };
}

