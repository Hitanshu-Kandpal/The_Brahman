import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { GodSection } from './components/GodSection';
import { ChatPanel } from './components/ChatPanel';
import { BackgroundLayers } from './components/BackgroundLayers';

export type GodId = 'shiva' | 'vishnu' | 'saraswati';

export interface GodConfig {
  id: GodId;
  name: string;
  title: string;
  description: string;
  accentColor: string;
  avatarSrc: string;
  backgroundSrc: string;
}

export const GODS: GodConfig[] = [
  {
    id: 'shiva',
    name: 'Shiva',
    title: 'Stillness beyond noise.',
    description: 'Speak to Shiva — where the self dissolves and silence remains.',
    accentColor: '#7f5af0',
    avatarSrc: '/images/avatars/shiva.png',
    backgroundSrc: '/images/backgrounds/shiva.jpg',
  },
  {
    id: 'vishnu',
    name: 'Vishnu',
    title: 'The force that keeps the universe from falling apart.',
    description: 'Speak to Vishnu — the thread that holds all stories together.',
    accentColor: '#2cb67d',
    avatarSrc: '/images/avatars/vishnu.png',
    backgroundSrc: '/images/backgrounds/vishnu.jpg',
  },
  {
    id: 'saraswati',
    name: 'Saraswati',
    title: 'Knowing, before it becomes thought.',
    description: 'Speak to Saraswati — where understanding flows.',
    accentColor: '#ff8906',
    avatarSrc: '/images/avatars/saraswati.png',
    backgroundSrc: '/images/backgrounds/saraswati.jpg',
  },
];

function Home() {
  const [headerScale, setHeaderScale] = useState(1);
  const [focusedGod, setFocusedGod] = useState<GodId | null>(null);
  const [hoveredGod, setHoveredGod] = useState<GodId | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const moodGod = hoveredGod ?? focusedGod;

  const moodColors: Record<GodId, string> = {
    shiva: 'rgba(127, 90, 240, 0.45)',
    vishnu: 'rgba(44, 182, 125, 0.38)',
    saraswati: 'rgba(255, 137, 6, 0.4)',
  };

  const moodColor = moodGod ? moodColors[moodGod] : 'rgba(0, 0, 0, 0)';

  const baseBackground = '/images/backgrounds/brahman.jpg';
  const activeBackground = null; // on the home screen, only hover should affect the background
  const overlayBackground = hoveredGod ? GODS.find((g) => g.id === hoveredGod)?.backgroundSrc : null;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxShrinkDistance = 260;
      const minScale = 0.38;
      const progress = Math.min(scrollY / maxShrinkDistance, 1);
      const scale = 1 - progress * (1 - minScale);
      setHeaderScale(scale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="brahman-page d-flex flex-column min-vh-100"
      style={
        {
          '--mood-color': moodColor,
        } as CSSProperties
      }
    >
      <BackgroundLayers
        baseSrc={baseBackground}
        activeSrc={activeBackground}
        overlaySrc={overlayBackground}
        overlayKey={hoveredGod ?? 'none'}
      />
      <main className="brahman-main">
        <section className="brahman-hero">
          <div
            className="brahman-hero-title"
            style={{ transform: `scale(${headerScale})` }}
          >
            BRAHMAN
          </div>
        </section>
        <section className="gods-wrapper">
          {GODS.map((god, index) => (
            <GodSection
              key={god.id}
              god={god}
              isActive={moodGod === god.id}
              alignment={index % 2 === 0 ? 'left' : 'right'}
              onHover={() => setHoveredGod(god.id)}
              onLeave={() =>
                setHoveredGod((current) => (current === god.id ? null : current))
              }
              onInView={() => setFocusedGod(god.id)}
            />
          ))}
        </section>
      </main>
    </div>
  );
}

function GodChatWrapper() {
  const { name } = useParams();
  const navigate = useNavigate();

  const god = GODS.find((g) => g.id === name);

  if (!god) {
    return (
      <div className="brahman-page d-flex flex-column align-items-center justify-content-center text-center">
        <BackgroundLayers baseSrc={'/images/backgrounds/brahman.jpg'} />
        <p className="text-muted mb-4">This voice is not yet tuned.</p>
        <button className="btn btn-outline-light" onClick={() => navigate('/')}>
          Back to Brahman
        </button>
      </div>
    );
  }

  return (
    <div className="brahman-page">
      <BackgroundLayers
        baseSrc={'/images/backgrounds/brahman.jpg'}
        activeSrc={god.backgroundSrc}
      />
      <header className="brahman-header position-fixed top-0 start-0 end-0">
        <div className="brahman-header-inner">
          <button
            className="brahman-back-button"
            onClick={() => navigate('/')}
          >
            ← All avatars
          </button>
          <span className="brahman-logo-small">BRAHMAN</span>
        </div>
      </header>
      <main className="brahman-main brahman-chat-main">
        <ChatPanel god={god} />
      </main>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/god/:name" element={<GodChatWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

