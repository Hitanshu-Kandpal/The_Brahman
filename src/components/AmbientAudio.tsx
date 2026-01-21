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
    if (!audioRef.current) return;
    audioRef.current.volume = 0.4;
    audioRef.current.play().catch(() => {});
  }, [activeDeity]);

  const toggleMute = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = !muted;
    if (muted) audioRef.current.play().catch(() => {});
    setMuted(!muted);
  };

  const changeTrack = (deity: Deity) => {
    if (!audioRef.current) return;

    setActiveDeity(deity);
    audioRef.current.src = TRACKS[deity].src;
    audioRef.current.play().catch(() => {});
    setOpen(false);
  };

  return (
    <>
      <audio ref={audioRef} src={TRACKS[activeDeity].src} loop />

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
