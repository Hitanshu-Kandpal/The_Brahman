# BRAHMAN PROJECT EXTRACTION DOCUMENT

**Purpose**: Extract BRAHMAN entry/hero and Chat text system for reuse in another project.

**Date**: Current extraction
**Status**: READ-ONLY EXTRACTION - NO MODIFICATIONS MADE

---

## 📦 PART 1: BRAHMAN ENTRY / HERO EXPERIENCE

### ✅ REQUIRED COMPONENT FILE

**File**: `src/components/CinematicEntry.tsx`
**Status**: ✅ REQUIRED (Complete file)

```typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface CinematicEntryProps {
  onScrollProgress: (scale: number) => void;
}

export function CinematicEntry({ onScrollProgress }: CinematicEntryProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;

    // Initial dark state
    gsap.set(titleRef.current, {
      opacity: 0,
      scale: 0.8,
      filter: 'blur(10px)',
    });

    // Cinematic title reveal
    const titleTimeline = gsap.timeline({
      delay: 0.5,
      defaults: { ease: 'power2.out' },
    });

    titleTimeline
      .to(titleRef.current, {
        opacity: 1,
        duration: 2,
        ease: 'power1.inOut',
      })
      .to(
        titleRef.current,
        {
          scale: 1,
          duration: 1.5,
          ease: 'power2.out',
        },
        '-=1.5'
      )
      .to(
        titleRef.current,
        {
          filter: 'blur(0px)',
          duration: 1,
        },
        '-=1'
      );

    // Scroll-based camera pull-back
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=400',
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        const scale = 1 - progress * 0.62; // Shrinks to 0.38
        const y = progress * 100;

        gsap.set(titleRef.current, {
          scale,
          y,
        });

        onScrollProgress(scale);
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === containerRef.current) {
          st.kill();
        }
      });
    };
  }, [onScrollProgress]);

  return (
    <div ref={containerRef} className="cinematic-entry">
      <div ref={titleRef} className="brahman-cinematic-title">
        BRAHMAN
      </div>
    </div>
  );
}
```

**What this does**:
- Creates the large BRAHMAN text element
- Animates initial reveal (opacity 0→1, scale 0.8→1, blur 10px→0px)
- Handles scroll-based shrinking (scale 1→0.38) and vertical movement (y: 0→100px)
- Calls `onScrollProgress` callback to sync with sticky header

**Dependencies**:
- `gsap` library (npm install gsap)
- `gsap/ScrollTrigger` plugin
- React hooks: `useEffect`, `useRef`

---

### ✅ REQUIRED CSS FOR BRAHMAN

**File**: `src/style.css`

#### 1. Container for BRAHMAN entry
**Lines**: 274-281
```css
.cinematic-entry {
  height: 120vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
```
**Purpose**: Creates full-height container for BRAHMAN title, centers content

---

#### 2. BRAHMAN title typography and positioning
**Lines**: 283-311
```css
.brahman-cinematic-title {
  position: sticky;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
  text-align: center;
  font-family: 'Cinzel', serif;
  font-size: clamp(4rem, 12vw, 7.5rem);
  letter-spacing: 0.25em;
  text-indent: 0.25em;
  font-weight: 700;
  text-transform: uppercase;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(240, 245, 255, 0.95) 50%,
    rgba(255, 255, 255, 0.9) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow:
    0 0 80px rgba(255, 255, 255, 0.4),
    0 0 50px rgba(150, 180, 255, 0.3),
    0 0 30px rgba(200, 220, 255, 0.2);
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
  will-change: transform, opacity, filter;
}
```
**Purpose**: 
- Large responsive typography (4rem to 7.5rem)
- Gradient text effect (white to light blue)
- Glowing text shadow
- Sticky positioning for scroll-based shrinking
- `will-change` for performance

---

#### 3. Sticky header (mini BRAHMAN)
**Lines**: 61-107
```css
.brahman-header {
  z-index: 10;
  padding: 1.4rem 1.6rem;
  pointer-events: none;
}

.brahman-header-inner {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  pointer-events: auto;
}

.brahman-logo {
  font-family: 'Cinzel', serif;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  font-size: 0.95rem;
  font-weight: 700;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(240, 245, 255, 0.95) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow:
    0 0 30px rgba(255, 255, 255, 0.3),
    0 0 15px rgba(255, 255, 255, 0.2);
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
  animation: headerGlow 3s ease-in-out infinite;
}

@keyframes headerGlow {
  0%,
  100% {
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.35))
      drop-shadow(0 0 30px rgba(200, 220, 255, 0.25));
  }
}
```
**Purpose**: 
- Small sticky header that appears when BRAHMAN shrinks
- Animated glow effect
- Used in `App.tsx` line 88-97

---

### ✅ REQUIRED INTEGRATION IN APP.TSX

**File**: `src/App.tsx`
**Lines**: 52-99 (Home component)

**Key integration points**:

1. **State for header scale** (line 53):
```typescript
const [headerScale, setHeaderScale] = useState(1);
```

2. **CinematicEntry component** (line 99):
```typescript
<CinematicEntry onScrollProgress={setHeaderScale} />
```

3. **Sticky header** (lines 88-97):
```typescript
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
```

**What this does**: 
- Header fades in when BRAHMAN shrinks below 0.5 scale
- Header logo scales based on scroll progress

---

### ❌ CODE TO IGNORE (NOT PART OF BRAHMAN ENTRY)

- `PHILOSOPHICAL_FRAGMENTS` constant (removed, was in CinematicEntry.tsx)
- `.philosophical-fragments-container` CSS (removed)
- `.philosophical-interstitial` CSS (removed)
- `.brahman-hero-title::before` CSS (lines 314-323) - unused pseudo-element

---

### 📋 BRAHMAN EXTRACTION CHECKLIST

**Required files**:
- ✅ `src/components/CinematicEntry.tsx` (complete)
- ✅ `src/style.css` (sections: 274-281, 283-311, 61-107)
- ✅ `src/App.tsx` (integration: lines 53, 88-97, 99)

**Required dependencies**:
- ✅ `gsap` (npm install gsap)
- ✅ `react` (hooks: useEffect, useRef)
- ✅ Google Font: `Cinzel` (for BRAHMAN text)

**Required fonts** (add to HTML or CSS):
```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
```

---

## 💬 PART 2: CHAT TEXT SYSTEM

### ✅ REQUIRED COMPONENT FILE

**File**: `src/components/ChatPanel.tsx`
**Status**: ✅ REQUIRED (Complete file - copy exactly as shown)

```typescript
import { useState, useRef, useEffect } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import type { GodConfig } from '../App';

interface ChatPanelProps {
  god: GodConfig;
}

interface Message {
  id: number;
  from: 'user' | 'god';
  text: string;
  timestamp: number;
}

// Rotating response pools per god
const GOD_RESPONSES: Record<string, string[]> = {
  shiva: [
    'Notice the part of you that is watching even now. That watcher is older than the question.',
    'Stillness is not the absence of thought, but the space between thoughts. Can you rest there?',
    'What you seek is already present. The seeking itself is the veil.',
    'In silence, all questions dissolve. What remains when the questioner disappears?',
    'The self you think you are is a story. Who is telling the story?',
  ],
  vishnu: [
    'Every question you ask threads into a larger pattern. What pattern do you sense beneath this one?',
    'Continuity flows through all things. Where do you see the thread connecting this moment to all others?',
    'Balance is not stillness, but movement in harmony. How does your question reflect this dance?',
    'The stories we tell shape the worlds we inhabit. What story are you living?',
    'Preservation is not resistance, but acceptance of what is. What are you trying to hold onto?',
  ],
  saraswati: [
    'Language is a river. Let your question dissolve for a moment and feel what remains without words.',
    'Knowing exists before thought takes form. What do you know without needing to explain?',
    'Music flows where words fail. Can you hear the silence between your thoughts?',
    'Understanding comes not from answers, but from the space where questions arise. Rest there.',
    'The flow of knowing is continuous. What are you trying to capture that cannot be held?',
  ],
};

// Opening lines per god
const GOD_OPENINGS: Record<string, string> = {
  shiva: 'Stillness beyond noise. Speak to Shiva — where the self dissolves and silence remains.',
  vishnu: 'The force that keeps the universe from falling apart. Speak to Vishnu — the thread that holds all stories together.',
  saraswati: 'Knowing, before it becomes thought. Speak to Saraswati — where understanding flows.',
};

// Helper to convert hex to RGB
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '127, 90, 240';
};

export function ChatPanel({ god }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: 'god',
      text: GOD_OPENINGS[god.id] || `I am ${god.name}. What would you like to explore?`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [responseIndex, setResponseIndex] = useState(0);
  const [isResponding, setIsResponding] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const accentRgb = hexToRgb(god.accentColor);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isResponding) return;

    const nextId = messages.length ? messages[messages.length - 1].id + 1 : 1;
    const userMessage: Message = {
      id: nextId,
      from: 'user',
      text: trimmed,
      timestamp: Date.now(),
    };

    // Add user message instantly
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsResponding(true);

    // Get rotating response
    const responses = GOD_RESPONSES[god.id] || [];
    const responseText = responses[responseIndex % responses.length];
    setResponseIndex((prev) => prev + 1);

    // Add god response after delay (700-1000ms)
    const delay = 700 + Math.random() * 300;
    setTimeout(() => {
      const godMessage: Message = {
        id: nextId + 1,
        from: 'god',
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, godMessage]);
      setIsResponding(false);
    }, delay);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="chat-panel">
      <div className="chat-header">
        <Typography variant="overline" className="chat-header-label">
          Speaking as
        </Typography>
        <Typography variant="h3" className="chat-header-name">
          {god.name}
        </Typography>
        <Typography variant="subtitle1" className="chat-header-title">
          {god.title}
        </Typography>
      </div>

      <div className="chat-window" ref={chatWindowRef}>
        <div className="chat-canvas-overlay"></div>
        <div className="chat-messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message chat-message-${message.from} chat-message-entering`}
              style={
                message.from === 'god'
                  ? ({ '--god-accent-rgb': accentRgb } as React.CSSProperties)
                  : undefined
              }
            >
              <div className="chat-thought-orb">
                <Typography variant="body1" className="chat-thought-text">
                  {message.text}
                </Typography>
              </div>
            </div>
          ))}
          {isResponding && (
            <div
              className="chat-message chat-message-god"
              style={{ '--god-accent-rgb': accentRgb } as React.CSSProperties}
            >
              <div className="chat-thought-orb chat-typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-offering-container">
        <div className="chat-offering-input-wrapper">
          <input
            type="text"
            className="chat-offering-input"
            placeholder="Offer a thought into silence..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isResponding}
          />
          {input.trim() && (
            <button
              className="chat-offering-send"
              onClick={handleSend}
              disabled={isResponding}
              aria-label="Send"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
```

**What this does**:
- Manages message state (user + god messages)
- Shows god opening message on load
- User messages appear instantly
- God replies after 700-1000ms delay
- Rotates through 5 pre-written responses per god
- Shows typing indicator (3 animated dots) while waiting
- Auto-scrolls to bottom on new messages
- Handles Enter key to send

**Dependencies**:
- `@mui/material` (Typography component)
- `GodConfig` type from `../App` (can be extracted separately)
- React hooks: `useState`, `useRef`, `useEffect`

---

### ✅ REQUIRED CONSTANTS

**Constants used in ChatPanel**:

1. **GOD_RESPONSES** (lines 17-39)
   - 5 rotating responses per god (shiva, vishnu, saraswati)
   - Used for god replies

2. **GOD_OPENINGS** (lines 42-46)
   - Opening message per god
   - Shown when chat panel first loads

3. **hexToRgb helper** (lines 49-54)
   - Converts hex color to RGB string for CSS variables
   - Used for god accent color glow effects

---

### ✅ REQUIRED CSS FOR CHAT SYSTEM

**File**: `src/style.css`

#### 1. Chat Panel Container
**Lines**: 684-693
```css
.chat-panel {
  max-width: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  min-height: 500px;
  position: relative;
}
```

#### 2. Chat Header (God name/title)
**Lines**: 705-782
```css
.chat-header {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  opacity: 0.85;
  z-index: 10;
  pointer-events: none;
}

.chat-header-label {
  font-family: 'Cinzel', serif;
  letter-spacing: 0.3em;
  font-size: 0.7rem;
  opacity: 0.6;
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.15));
}

.chat-header-name {
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem;
  letter-spacing: 0.25em;
  font-weight: 600;
  margin-bottom: 0.75rem;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(240, 245, 255, 0.95) 50%,
    rgba(255, 255, 255, 0.9) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow:
    0 0 50px rgba(255, 255, 255, 0.3),
    0 0 30px rgba(200, 220, 255, 0.2),
    0 0 15px rgba(255, 255, 255, 0.15);
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.25));
  animation: chatNameGlow 4s ease-in-out infinite;
}

.chat-header-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  letter-spacing: 0.12em;
  font-weight: 400;
  font-style: italic;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.85) 0%,
    rgba(240, 245, 255, 0.75) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.15));
}

@keyframes chatNameGlow {
  0%,
  100% {
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.25))
      drop-shadow(0 0 30px rgba(200, 220, 255, 0.15));
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.4))
      drop-shadow(0 0 50px rgba(200, 220, 255, 0.3))
      drop-shadow(0 0 70px rgba(150, 180, 255, 0.2));
  }
}
```

#### 3. Chat Window (Messages Container)
**Lines**: 784-852
```css
.chat-window {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  padding: 3rem 1.5rem;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.chat-window::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at center top, rgba(0, 0, 0, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse at center bottom, rgba(0, 0, 0, 0.6) 0%, transparent 50%),
    linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 20%, rgba(0, 0, 0, 0.5) 80%, transparent 100%);
  pointer-events: none;
  z-index: 1;
}

.chat-window::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0px, transparent 1px, transparent 2px);
  pointer-events: none;
  z-index: 2;
  opacity: 0.4;
  mix-blend-mode: overlay;
}

.chat-canvas-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.25) 100%);
  pointer-events: none;
  z-index: 3;
  animation: canvasDrift 20s ease-in-out infinite;
}

@keyframes canvasDrift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(2px, -3px) scale(1.01);
  }
}

.chat-window::-webkit-scrollbar {
  width: 4px;
}

.chat-window::-webkit-scrollbar-track {
  background: transparent;
}

.chat-window::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
}

.chat-window::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.12);
}
```

#### 4. Message Container
**Lines**: 854-902
```css
.chat-messages-container {
  position: relative;
  z-index: 4;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding-bottom: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
}

.chat-message {
  display: flex;
  opacity: 0;
  transform: translateY(20px);
  animation: thoughtAppear 800ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.chat-message-user {
  justify-content: flex-end;
  margin-left: 15%;
  animation-duration: 600ms;
}

.chat-message-god {
  justify-content: flex-start;
  margin-right: 10%;
  animation-duration: 1000ms;
}

/* Uneven rhythm - alternate spacing */
.chat-message:nth-child(odd) {
  margin-top: 1rem;
}

.chat-message:nth-child(even) {
  margin-top: 0.5rem;
}

@keyframes thoughtAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 5. Thought Orbs (Message Bubbles)
**Lines**: 904-957
```css
.chat-thought-orb {
  max-width: min(28rem, 70%);
  padding: 1.4rem 1.8rem;
  border-radius: 14px;
  position: relative;
  word-wrap: break-word;
  backdrop-filter: blur(12px);
  border: none;
}

.chat-message-god .chat-thought-orb {
  max-width: min(32rem, 75%);
  background: rgba(8, 6, 20, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.chat-message-user .chat-thought-orb {
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

@keyframes godOrbGlow {
  0%,
  100% {
    box-shadow:
      0 12px 48px rgba(0, 0, 0, 0.6),
      0 0 80px rgba(var(--god-accent-rgb, 127, 90, 240), 0.2),
      0 0 120px rgba(var(--god-accent-rgb, 127, 90, 240), 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  50% {
    box-shadow:
      0 12px 48px rgba(0, 0, 0, 0.6),
      0 0 100px rgba(var(--god-accent-rgb, 127, 90, 240), 0.3),
      0 0 150px rgba(var(--god-accent-rgb, 127, 90, 240), 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }
}

@keyframes userOrbFloat {
  0%,
  100% {
    transform: translateY(0);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  50% {
    transform: translateY(-2px);
    box-shadow:
      0 10px 40px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
  }
}
```

#### 6. Message Text
**Lines**: 959-1005
```css
.chat-thought-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem;
  line-height: 2.2;
  letter-spacing: 0.03em;
  font-weight: 300;
  color: inherit;
  margin: 0;
  text-rendering: optimizeLegibility;
}

.chat-message-god .chat-thought-text {
  color: rgba(240, 240, 250, 0.95);
  text-shadow:
    0 0 20px rgba(var(--god-accent-rgb, 127, 90, 240), 0.4),
    0 0 10px rgba(var(--god-accent-rgb, 127, 90, 240), 0.3),
    0 2px 4px rgba(0, 0, 0, 0.3);
  filter: drop-shadow(0 0 8px rgba(var(--god-accent-rgb, 127, 90, 240), 0.25));
  animation: godTextGlow 4s ease-in-out infinite;
}

.chat-message-user .chat-thought-text {
  color: rgba(255, 255, 255, 0.9);
  text-shadow:
    0 0 15px rgba(255, 255, 255, 0.2),
    0 0 8px rgba(255, 255, 255, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.2);
  filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.15));
}

@keyframes godTextGlow {
  0%,
  100% {
    text-shadow:
      0 0 20px rgba(var(--god-accent-rgb, 127, 90, 240), 0.4),
      0 0 10px rgba(var(--god-accent-rgb, 127, 90, 240), 0.3),
      0 2px 4px rgba(0, 0, 0, 0.3);
    filter: drop-shadow(0 0 8px rgba(var(--god-accent-rgb, 127, 90, 240), 0.25));
  }
  50% {
    text-shadow:
      0 0 30px rgba(var(--god-accent-rgb, 127, 90, 240), 0.5),
      0 0 15px rgba(var(--god-accent-rgb, 127, 90, 240), 0.4),
      0 2px 4px rgba(0, 0, 0, 0.3);
    filter: drop-shadow(0 0 12px rgba(var(--god-accent-rgb, 127, 90, 240), 0.35));
  }
}
```

#### 7. Typing Indicator
**Lines**: 1007-1071
```css
.chat-typing-indicator {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1.2rem 1.8rem;
  background: linear-gradient(
    135deg,
    rgba(8, 6, 20, 0.75) 0%,
    rgba(12, 8, 28, 0.7) 50%,
    rgba(8, 6, 20, 0.75) 100%
  );
  backdrop-filter: blur(20px);
  border: none;
  border-radius: 32px;
  box-shadow:
    0 12px 48px rgba(0, 0, 0, 0.6),
    0 0 80px rgba(var(--god-accent-rgb, 127, 90, 240), 0.2),
    0 0 120px rgba(var(--god-accent-rgb, 127, 90, 240), 0.1);
  animation: typingGlow 2s ease-in-out infinite;
}

@keyframes typingGlow {
  0%,
  100% {
    box-shadow:
      0 12px 48px rgba(0, 0, 0, 0.6),
      0 0 80px rgba(var(--god-accent-rgb, 127, 90, 240), 0.2),
      0 0 120px rgba(var(--god-accent-rgb, 127, 90, 240), 0.1);
  }
  50% {
    box-shadow:
      0 12px 48px rgba(0, 0, 0, 0.6),
      0 0 100px rgba(var(--god-accent-rgb, 127, 90, 240), 0.3),
      0 0 150px rgba(var(--god-accent-rgb, 127, 90, 240), 0.2);
  }
}

.typing-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  animation: typingPulse 1.6s ease-in-out infinite;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.25s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.5s;
}

@keyframes typingPulse {
  0%,
  60%,
  100% {
    opacity: 0.25;
    transform: scale(0.85);
  }
  30% {
    opacity: 0.6;
    transform: scale(1.15);
  }
}
```

#### 8. Input Field (Offering)
**Lines**: 1073-1141
```css
.chat-offering-container {
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  padding: 0 2rem;
  z-index: 5;
}

.chat-offering-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chat-offering-input {
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.9rem 0.5rem;
  color: rgba(255, 255, 255, 0.95);
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  letter-spacing: 0.04em;
  font-weight: 300;
  font-style: italic;
  line-height: 1.8;
  outline: none;
  transition: all 300ms ease;
  caret-color: rgba(255, 255, 255, 0.7);
  animation: cursorBlink 2s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.15);
}

.chat-offering-input::placeholder {
  font-family: 'Cormorant Garamond', serif;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
  opacity: 1;
  transition: opacity 300ms ease;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
}

.chat-offering-input:focus::placeholder {
  opacity: 0.2;
}

.chat-offering-input:focus {
  border-bottom-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 2px 20px rgba(255, 255, 255, 0.1);
}

.chat-offering-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@keyframes cursorBlink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0.3;
  }
}
```

#### 9. Send Button
**Lines**: 1143-1188
```css
.chat-offering-send {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 300ms cubic-bezier(0.22, 1, 0.36, 1);
  opacity: 0;
  transform: scale(0.8);
  animation: sendButtonAppear 300ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes sendButtonAppear {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.chat-offering-send:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
  box-shadow: 0 0 24px rgba(255, 255, 255, 0.2);
}

.chat-offering-send:active:not(:disabled) {
  transform: scale(0.95);
}

.chat-offering-send:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.chat-offering-send svg {
  width: 18px;
  height: 18px;
  stroke-width: 1.5;
}
```

#### 10. Responsive Styles (Mobile)
**Lines**: 1190-1256
```css
@media (max-width: 768px) {
  .chat-panel {
    padding: 2rem 1.25rem;
    height: calc(100vh - 100px);
  }

  .chat-header {
    margin-bottom: 2rem;
  }

  .chat-header-name {
    font-size: 1.9rem;
  }

  .chat-window {
    padding: 2rem 1rem;
  }

  .chat-messages-container {
    gap: 2rem;
  }

  .chat-thought-orb {
    max-width: min(26rem, 88%);
    padding: 1.2rem 1.5rem;
  }

  .chat-message-god .chat-thought-orb {
    max-width: min(28rem, 90%);
  }

  .chat-thought-text {
    font-size: 1rem;
    line-height: 2;
  }

  .chat-offering-container {
    padding: 0 1rem;
  }

  .chat-offering-input {
    font-size: 1rem;
  }
}
```

---

### ❌ CODE TO EXCLUDE (NOT PART OF CHAT SYSTEM)

- Background image layers (`.bg-layers`, `.bg-layer`, etc.)
- Avatar hover logic
- God section components
- Page-level layout (`.brahman-page`, `.brahman-main`, etc.)
- Navigation/routing logic

---

### 📋 CHAT EXTRACTION CHECKLIST

**Required files**:
- ✅ `src/components/ChatPanel.tsx` (complete)
- ✅ `src/style.css` (sections: 684-1256)
- ✅ `GodConfig` type definition (from App.tsx lines 12-20)

**Required dependencies**:
- ✅ `@mui/material` (Typography component)
- ✅ React hooks: `useState`, `useRef`, `useEffect`

**Required fonts** (add to HTML or CSS):
```css
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Playfair+Display:wght@400;600&family=Cormorant+Garamond:wght@300;400;700&display=swap');
```

**Required CSS Variables**:
- `--god-accent-rgb`: RGB values for god accent color (set via inline style in ChatPanel)

---

## 📄 COPY-PASTE INSTRUCTIONS

### For BRAHMAN Entry:

1. **Copy component**:
   - Copy `src/components/CinematicEntry.tsx` exactly as shown

2. **Copy CSS**:
   - Copy CSS lines 274-281 (`.cinematic-entry`)
   - Copy CSS lines 283-311 (`.brahman-cinematic-title`)
   - Copy CSS lines 61-107 (`.brahman-header`, `.brahman-logo`, `@keyframes headerGlow`)

3. **Integrate in your app**:
   - Add state: `const [headerScale, setHeaderScale] = useState(1);`
   - Render: `<CinematicEntry onScrollProgress={setHeaderScale} />`
   - Add sticky header that uses `headerScale` value

4. **Install dependencies**:
   ```bash
   npm install gsap
   ```

5. **Add fonts**:
   - Add Cinzel font import to your HTML/CSS

---

### For Chat System:

1. **Copy component**:
   - Copy `src/components/ChatPanel.tsx` exactly as shown
   - Copy `GodConfig` interface from `App.tsx` (lines 12-20)

2. **Copy CSS**:
   - Copy CSS lines 684-1256 (all chat-related styles)

3. **Copy constants**:
   - Copy `GOD_RESPONSES` object (5 responses per god)
   - Copy `GOD_OPENINGS` object (opening messages)
   - Copy `hexToRgb` helper function

4. **Install dependencies**:
   ```bash
   npm install @mui/material
   ```

5. **Add fonts**:
   - Add Cinzel, Playfair Display, Cormorant Garamond fonts

6. **Usage**:
   ```typescript
   <ChatPanel god={godConfigObject} />
   ```
   Where `godConfigObject` has: `{ id, name, title, accentColor }`

---

## ⚠️ IMPORTANT NOTES

1. **GodConfig type**: ChatPanel depends on `GodConfig` interface. Extract it separately or define it in your new project.

2. **CSS Variables**: Chat uses `--god-accent-rgb` CSS variable set inline. Make sure your god objects have `accentColor` (hex format).

3. **Material UI**: ChatPanel uses `Typography` from MUI. You can replace with plain HTML if needed.

4. **No modifications made**: This document is extraction-only. All code shown is exactly as it exists in the current project.

5. **Test after extraction**: Both systems are independent but may need minor adjustments for your project structure.

---

**END OF EXTRACTION DOCUMENT**
