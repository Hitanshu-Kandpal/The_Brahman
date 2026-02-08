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
  const [hasStarted, setHasStarted] = useState(false);

  // Initial autoplay attempt on mount
  useEffect(() => {
    const playAudio = async () => {
      if (!audioRef.current) return;
      audioRef.current.volume = 0.4;
      audioRef.current.muted = false;
      try {
        await audioRef.current.play();
        setHasStarted(true);
      } catch (err) {
        // Autoplay blocked - will play on first user interaction
      }
    };

    const timer = setTimeout(playAudio, 100);
    return () => clearTimeout(timer);
  }, []);

  // When track changes, play the new track
  useEffect(() => {
    if (!audioRef.current || !hasStarted) return;
    audioRef.current.volume = 0.4;
    audioRef.current.muted = false;
    audioRef.current.play().catch(() => {});
  }, [activeDeity, hasStarted]);

  const toggleMute = () => {
    if (!audioRef.current) return;

    const newMutedState = !muted;
    audioRef.current.muted = newMutedState;

    if (newMutedState === false) {
      audioRef.current.play().catch(() => {});
      if (!hasStarted) setHasStarted(true);
    }
    setMuted(newMutedState);
  };

  const changeTrack = (deity: Deity) => {
    if (!audioRef.current) return;

    setActiveDeity(deity);
    audioRef.current.src = TRACKS[deity].src;
    audioRef.current.muted = false;
    audioRef.current.play().catch(() => {});
    if (!hasStarted) setHasStarted(true);
    setMuted(false);
    setOpen(false);
  };

  return (
    <>
      <audio ref={audioRef} src={TRACKS[activeDeity].src} loop muted={muted} />

      <div className="ambient-audio-wrapper">
        <button
          className="ambient-audio-toggle"
          onClick={toggleMute}
          aria-label="Toggle ambient audio"
        >
          {muted ? '🔇' : '🔊'}
        </button>

        <div
          className={`ambient-audio-dropdown ${open ? 'open' : ''}`}
        >
          {(Object.keys(TRACKS) as Deity[]).map((deity) => (
            <button
              key={deity}
              className={`audio-avatar ${
                activeDeity === deity ? 'active' : ''
              }`}
              onClick={() => changeTrack(deity)}
            >
              <img src={TRACKS[deity].avatar} alt={deity} />
            </button>
          ))}
        </div>

        <button
          className="ambient-audio-expand"
          onClick={() => setOpen(!open)}
          aria-label="Select deity audio"
        >
          ☰
        </button>
      </div>
    </>
  );
}
