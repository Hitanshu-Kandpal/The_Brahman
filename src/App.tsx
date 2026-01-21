import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { GodSection } from './components/GodSection';
import { ChatPanel } from './components/ChatPanel';
import { BackgroundLayers } from './components/BackgroundLayers';
import { CinematicEntry } from './components/CinematicEntry';
import { QuoteSection } from './components/QuoteSection';
import { Introduction } from './components/Introduction';
import { DivineSelectionRow } from './components/DivineSelectionRow';
import AmbientAudio from './components/AmbientAudio';


export type GodId = 'shiva' | 'vishnu' | 'saraswati' | 'krishna' | 'ram' | 'sita' | 'lakshmi';

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
  {
    id: 'krishna',
    name: 'Krishna',
    title: 'The divine play of existence.',
    description: 'Speak to Krishna — where love and wisdom dance as one.',
    accentColor: '#4a90e2',
    avatarSrc: '/images/avatars/krishna.png',
    backgroundSrc: '/images/backgrounds/krishna.jpg',
  },
  {
    id: 'ram',
    name: 'Ram',
    title: 'Righteousness in action.',
    description: 'Speak to Ram — where duty and devotion merge.',
    accentColor: '#e74c3c',
    avatarSrc: '/images/avatars/ram.png',
    backgroundSrc: '/images/backgrounds/ram.jpg',
  },
  {
    id: 'sita',
    name: 'Sita',
    title: 'Strength through surrender.',
    description: 'Speak to Sita — where grace meets unwavering resolve.',
    accentColor: '#f39c12',
    avatarSrc: '/images/avatars/sita.png',
    backgroundSrc: '/images/backgrounds/sita.jpg',
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi',
    title: 'Abundance in all forms.',
    description: 'Speak to Lakshmi — where prosperity flows from inner wealth.',
    accentColor: '#9b59b6',
    avatarSrc: '/images/avatars/lakshmi.png',
    backgroundSrc: '/images/backgrounds/lakshmi.jpg',
  },
];

// Scroll-sequenced quotes - appear between gods
export const QUOTES: string[] = [
  'In the space between thoughts, all questions dissolve.',
  'What you seek is already present. The seeking itself is the veil.',
  'Stillness is not the absence of thought, but the space between thoughts.',
  'The self you think you are is a story. Who is telling the story?',
  'Language is a river. Let your question dissolve and feel what remains.',
  'Understanding comes not from answers, but from the space where questions arise.',
  'Every question threads into a larger pattern. What pattern do you sense?',
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
    krishna: 'rgba(74, 144, 226, 0.4)',
    ram: 'rgba(231, 76, 60, 0.4)',
    sita: 'rgba(243, 156, 18, 0.4)',
    lakshmi: 'rgba(155, 89, 182, 0.4)',
  };

  const moodColor = moodGod ? moodColors[moodGod] : 'rgba(0, 0, 0, 0)';

  const baseBackground = '/images/backgrounds/brahman.jpg';
  const activeBackground = null; // on the home screen, only hover should affect the background
  const overlayBackground = hoveredGod ? GODS.find((g) => g.id === hoveredGod)?.backgroundSrc : null;

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
      <header className="brahman-header position-fixed top-0 start-0 end-0" style={{ opacity: headerScale < 0.5 ? 1 : 0 }}>
        <div className="brahman-header-inner">
          <span className="brahman-logo" style={{ transform: `scale(${headerScale < 0.5 ? 1 : headerScale * 2})` }}>
            BRAHMAN
          </span>
          <span className="brahman-tagline d-none d-md-inline">
            an interface into voices of the infinite
          </span>
        </div>
      </header>
      <main className="brahman-main">
        <CinematicEntry onScrollProgress={setHeaderScale} />
        <Introduction />
        <section className="gods-wrapper">
          {GODS.map((god, index) => {
            // Show quote before each god (except first)
            const quoteIndex = index > 0 ? index - 1 : null;
            const quote = quoteIndex !== null && quoteIndex < QUOTES.length ? QUOTES[quoteIndex] : null;
            const quoteAlignment = index % 2 === 0 ? 'left' : 'right';

            return (
              <div key={god.id}>
                {quote && (
                  <QuoteSection 
                    quote={quote} 
                    alignment={quoteAlignment as 'left' | 'right'}
                  />
                )}
                <GodSection
                  god={god}
                  isActive={moodGod === god.id}
                  alignment={index % 2 === 0 ? 'left' : 'right'}
                  onHover={() => setHoveredGod(god.id)}
                  onLeave={() =>
                    setHoveredGod((current) => (current === god.id ? null : current))
                  }
                  onInView={() => setFocusedGod(god.id)}
                />
              </div>
            );
          })}
        </section>
        <DivineSelectionRow gods={GODS} />
        <footer className="brahman-credit">
          <p>A project by Hitanshu Kandpal</p>
        </footer>
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
      <AmbientAudio />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/god/:name" element={<GodChatWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}
