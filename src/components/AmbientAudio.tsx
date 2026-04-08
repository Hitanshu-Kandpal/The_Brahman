import { useEffect, useRef, useState } from 'react';

type Deity = 'krishna' | 'shiva' | 'ram';

const TRACKS: Record<Deity, { src: string; avatar: string }> = {
  krishna: {
    src: '/audio/krishna.mp3',
    avatar: '/images/audio-avatars/krishna.png',
  },
  shiva: {
    src: '/audio/shiva.mp3',
    avatar: '/images/audio-avatars/shiva.png',
  },
  ram: {
    src: '/audio/ram.mp3',
    avatar: '/images/audio-avatars/ram.png',
  },
};

export default function AmbientAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeDeity, setActiveDeity] = useState<Deity>('krishna');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const attemptPlay = () => {
      audio.volume = 0.4;
      audio.muted = muted;
      audio.play().catch(() => {});
    };

    audio.preload = 'auto';
    audio.load();
    attemptPlay();

    const retryOnGesture = () => {
      if (!muted) {
        attemptPlay();
      }
    };

    const retryEvents: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'touchstart', 'focus'];
    retryEvents.forEach((eventName) => window.addEventListener(eventName, retryOnGesture));
    document.addEventListener('visibilitychange', retryOnGesture);
    audio.addEventListener('canplay', attemptPlay);
    audio.addEventListener('loadeddata', attemptPlay);

    return () => {
      retryEvents.forEach((eventName) => window.removeEventListener(eventName, retryOnGesture));
      document.removeEventListener('visibilitychange', retryOnGesture);
      audio.removeEventListener('canplay', attemptPlay);
      audio.removeEventListener('loadeddata', attemptPlay);
    };
  }, [activeDeity, muted]);

  const toggleMute = () => {
    if (!audioRef.current) return;

    const nextMuted = !muted;
    audioRef.current.muted = nextMuted;
    if (!nextMuted) {
      audioRef.current.play().catch(() => {});
    }
    setMuted(nextMuted);
  };

  const changeTrack = (deity: Deity) => {
    setActiveDeity(deity);
    setOpen(false);
  };

  return (
    <>
      <audio ref={audioRef} src={TRACKS[activeDeity].src} loop autoPlay preload="auto" playsInline muted={muted} />

      <div className="ambient-audio-wrapper">
        <button className="ambient-audio-toggle" onClick={toggleMute} aria-label="Toggle ambient audio">
          {muted ? '🔇' : '🔊'}
        </button>

        <div className={`ambient-audio-dropdown ${open ? 'open' : ''}`}>
          {(Object.keys(TRACKS) as Deity[]).map((deity) => (
            <button
              key={deity}
              className={`audio-avatar ${activeDeity === deity ? 'active' : ''}`}
              onClick={() => changeTrack(deity)}
            >
              <img src={TRACKS[deity].avatar} alt={deity} />
            </button>
          ))}
        </div>

        <button className="ambient-audio-expand" onClick={() => setOpen(!open)} aria-label="Select deity audio">
          ☰
        </button>
      </div>
    </>
  );
}
