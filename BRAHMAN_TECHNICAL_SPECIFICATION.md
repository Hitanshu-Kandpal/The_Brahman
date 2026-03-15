# BRAHMAN - Complete Technical Specification

## Executive Summary
Brahman is an immersive meditation and spiritual dialogue platform featuring interactive encounters with Hindu deities. The application emphasizes cinematic UX, ethereal aesthetics, and atmospheric design using advanced CSS animations and React state management.

**Current State:** The website "sucks" because it lacks cohesion, has performance issues, and the ethereal design isn't fully realized. This spec provides everything needed to build a significantly improved version.

---

## 1. ARCHITECTURE OVERVIEW

### High-Level Structure
```
┌─────────────────────────────────────────┐
│ React 19 + TypeScript + Vite SPA         │
├─────────────────────────────────────────┤
│ Routing: React Router v7                │
│ UI Library: Material UI (MUI) v7         │
│ Styling: Emotion + Bootstrap 5 + CSS3   │
│ Animations: Native CSS Keyframes + GSAP │
│ Audio: Custom React Hook System         │
└─────────────────────────────────────────┘
```

### Stack Details
- **Framework**: React 19.2.9 with TypeScript 5.9.3
- **Build Tool**: Vite 7.2.4 (fast, modern)
- **Styling**: 
  - Bootstrap 5.3.8 (grid/utilities)
  - Emotion 11.14 (CSS-in-JS)
  - Custom CSS3 (animations, filters, gradients)
- **UI Components**: Material UI 7.3.7
- **Routing**: React Router DOM 7.12.0
- **Animations**: GSAP 3.14.2 (currently not used but available)

---

## 2. DIRECTORY STRUCTURE

```
brahman/
├── src/
│   ├── App.tsx                    # Main app file with routes & data
│   ├── main.tsx                   # React entry point
│   ├── style.css                  # Global styles (1700+ lines)
│   ├── components/
│   │   ├── CinematicEntry.tsx     # BRAHMAN title reveal
│   │   ├── Introduction.tsx        # Scroll-based intro text
│   │   ├── GodSection.tsx          # Individual deity component
│   │   ├── ChatPanel.tsx           # Chat interface for deities
│   │   ├── AmbientAudio.tsx        # Audio playback & selection
│   │   ├── BackgroundLayers.tsx    # Parallax background system
│   │   ├── QuoteSection.tsx        # Scroll-triggered quotes
│   │   ├── DivineSelectionRow.tsx  # Final deity selector
│   │   └── Hero.tsx                # (appears unused)
│   ├── counter.ts                 # (appears unused)
│   └── typescript.svg              # (appears unused)
├── public/
│   ├── images/
│   │   ├── avatars/               # Deity avatar images
│   │   ├── backgrounds/           # Scene backgrounds
│   │   └── audio-avatars/         # Small deity icons for audio selector
│   └── audio/                     # MP3 files for ambient music
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

---

## 3. DATA MODEL

### Core Type Definitions

```typescript
// From App.tsx
export type GodId = 'shiva' | 'vishnu' | 'saraswati' | 'krishna' | 'ram' | 'sita' | 'lakshmi';

export interface GodConfig {
  id: GodId;
  name: string;
  title: string;
  description: string;
  accentColor: string;          // Hex color for glow effects
  avatarSrc: string;             // Image path for deity
  backgroundSrc: string;         // Background image path
}

// From ChatPanel.tsx
interface Message {
  id: number;
  from: 'user' | 'god';
  text: string;
  timestamp: number;
}

// From AmbientAudio.tsx
type Deity = 'krishna' | 'shiva' | 'ram';

interface TrackConfig {
  src: string;
  avatar: string;
}
```

### Deity Configuration Array

Seven deities are available:
```typescript
GODS: [
  {
    id: 'shiva',
    name: 'Shiva',
    title: 'Stillness beyond noise.',
    description: 'Speak to Shiva — where the self dissolves and silence remains.',
    accentColor: '#7f5af0',      // Purple
    avatarSrc: '/images/avatars/shiva.png',
    backgroundSrc: '/images/backgrounds/shiva.jpg',
  },
  // ... 6 more deities (vishnu, saraswati, krishna, ram, sita, lakshmi)
]
```

### God Response Pools

Each deity has 5 unique responses that rotate:
```typescript
GOD_RESPONSES: {
  shiva: [
    'Notice the part of you that is watching even now...',
    'Stillness is not the absence of thought...',
    // ... 3 more
  ],
  // ... 6 more deities
}
```

---

## 4. ROUTING

**Single Page App with 2 Routes:**

```
/                    → Home page with all deities, intro, quotes
/god/:name          → Individual deity chat interface
```

**Navigation Flow:**
- Home → Scroll through deities
- Click deity card → Navigate to `/god/:name`
- Click "Back" button → Return to home
- Session storage preserves last viewed deity and auto-scrolls on return

---

## 5. COMPONENT HIERARCHY

### Home Page Layout
```
Home
├── BackgroundLayers (parallax bg)
├── Header (sticky, scales on scroll)
├── Main Content:
│   ├── CinematicEntry (BRAHMAN reveal)
│   ├── Introduction (scroll-based text)
│   ├── Gods Section (loop):
│   │   ├── QuoteSection (before each god)
│   │   └── GodSection (deity card with hover)
│   └── DivineSelectionRow (all deity bubbles)
│       └── Footer
└── AmbientAudio (fixed top-right)
```

### Chat Page Layout
```
GodChatWrapper
├── BackgroundLayers (god-specific bg)
├── Header (with back button)
├── ChatPanel:
│   ├── Chat Header (god name/title)
│   ├── Chat Window (messages)
│   └── Chat Input (text field + send)
└── AmbientAudio (fixed top-right)
```

---

## 6. COMPONENT DETAILS

### 6.1 CinematicEntry.tsx

**Purpose**: Displays animated "BRAHMAN" title on first load

**Key Features**:
- 2-second delay before rendering (prevents glitch)
- Scroll-linked opacity and scale
- Responsive font size (5rem to 10.5rem)
- Gradient text effect with multiple text-shadows

**State**:
- `lineOpacities: number` - opacity based on scroll
- `isVisible: boolean` - conditional rendering flag

**Key Logic**:
```typescript
// Delay visibility for 2 seconds
useEffect(() => {
  const timer = setTimeout(() => setIsVisible(true), 2000);
  return () => clearTimeout(timer);
}, []);

// Scroll handler calculates opacity & scale
// Full opacity at viewport center, fades 60% away
```

**CSS Animation** `brahmanReveal`:
- 4s duration
- Starts with scale(1.2) + blur(12px)
- Ends with scale(1) + no blur
- Easing: cubic-bezier(0.2, 0.55, 0.4, 0.95)

---

### 6.2 Introduction.tsx

**Purpose**: Philosophical preamble that introduces Brahman concept

**Key Features**:
- 22 poetic paragraphs + spacing
- Scroll-based opacity (lines brighten/fade based on position)
- Typography optimized for readability at 2.8rem-4.5rem sizes
- Text-shadow glow effect

**Content**: 
Fixed array of spiritual philosophy text about Brahman, stillness, and meditation.

**Scroll Mechanic**:
- Each paragraph fades when not in viewport center
- Fully opaque when at center
- Creates "focus line" effect where reader controls pacing

**Height**: 220vh (forces extended scrolling through intro)

---

### 6.3 GodSection.tsx

**Purpose**: Individual deity card with hover interaction

**Props**:
```typescript
interface GodSectionProps {
  god: GodConfig;
  isActive: boolean;              // Highlighted by hover/focus
  alignment: 'left' | 'right';    // Flexbox direction
  onHover: () => void;
  onLeave: () => void;
  onInView: () => void;            // Intersection Observer
}
```

**Key Features**:
- 280x280px circular avatar with glow
- Name label below avatar (responsive text)
- Hover state: avatar scales 1.12x, border brightens
- On hover: description box fades in with ethereal effects
- Alternating left/right layout
- Intersection Observer triggers when deity enters viewport

**Animations**:
- `floatingLotus` (5.5s) - subtle movement
- `nameGlow` (3s) - pulsing drop-shadow on name
- `etherealFloat` (3.5s) - description box lifting motion
- `etherealGlow` (3s) - pulsing glow on text

**Hover Text Box** (`god-float-text`):
- Max-width 380px
- Backdrop-filter blur(8px)
- Radial gradient background
- Border + box-shadow (frosted glass effect)
- Flexbox column with title + description

---

### 6.4 ChatPanel.tsx

**Purpose**: Interactive chat interface with deity

**Props**:
```typescript
interface ChatPanelProps {
  god: GodConfig;
}
```

**Features**:
- Header section: "Speaking as [Name]" with title
- Chat window with scrolling message list
- Message bubbles for user/god
- Typing indicator during response
- Text input field at bottom with send button
- God responses rotate from pre-written pool

**Message Structure**:
```typescript
interface Message {
  id: number;
  from: 'user' | 'god';
  text: string;
  timestamp: number;
}
```

**Interaction Flow**:
1. User types in input field
2. Placeholder: "Offer a thought into silence..."
3. Send button appears when text exists
4. Enter key or button click sends
5. God response appears after 700-1000ms random delay
6. Auto-scrolls to latest message

**Styling**:
- User messages: right-aligned, white bubble
- God messages: left-aligned, colored bubble (matches deity accent)
- Thought orbs: 36-40rem max width, backdrop blur, glowing shadows
- Text color uses CSS variables for deity-specific accent color

---

### 6.5 AmbientAudio.tsx

**Purpose**: Ambient music playback with deity selection

**Key Features**:
- Fixed top-right corner (z-index 1000)
- Toggle button (🔊/🔇) for mute
- Dropdown menu with 3 deity options (krishna, shiva, ram)
- Auto-plays on mount with fallback for browser restrictions
- Track changes on deity selection
- Volume locked at 0.4 (40%)

**State**:
```typescript
const [muted, setMuted] = useState(false);
const [open, setOpen] = useState(false);           // Dropdown visibility
const [activeDeity, setActiveDeity] = useState<Deity>('krishna');
const [hasStarted, setHasStarted] = useState(false); // Browser autoplay flag
```

**Browser Autoplay Handling**:
1. On mount: attempt to play() with 100ms delay
2. If blocked (promise rejects): silently fail
3. On first user interaction (click): set hasStarted=true
4. Next play() calls will succeed due to user gesture

**Audio Tracks**:
```typescript
TRACKS: {
  krishna: { src: '/audio/krishna.mp3', avatar: '...' },
  shiva: { src: '/audio/shiva.mp3', avatar: '...' },
  ram: { src: '/audio/ram.mp3', avatar: '...' },
}
```

**UI**:
- Toggle button: circular, 40x40px, backdrop blur
- Expand button (☰): expands to show avatar selector
- Avatar buttons: 32x32px circles with glow on hover/active
- Smooth transitions with opacity + transform

---

### 6.6 BackgroundLayers.tsx

**Purpose**: Cinematic parallax background system

**Architecture** (3-layer system):
```
Layer 1: Base (always visible)
Layer 2: Active (committed selection - god-specific)
Layer 3: Overlay (temporary - hover effects)
```

**Props**:
```typescript
interface BackgroundLayersProps {
  baseSrc: string;
  activeSrc?: string | null;     // Route-based
  overlaySrc?: string | null;    // Hover-based
  overlayKey?: string | null;    // For React key
}
```

**Parallax Effect**:
- Scroll Y → translate -y up to 60px
- Scale 1.03 applied to create depth
- Uses transform3d for GPU acceleration

**Filters Applied**:
```
.bg-layer-base:
  brightness(1.16) saturate(1.08) contrast(1.04)
  
.bg-layer-active, .bg-layer-overlay:
  brightness(1.12) saturate(1.1) contrast(1.08)
```

**Transitions**:
- Opacity + Filter changes: 1400ms cubic-bezier fade

**Additional Effects**:
- `.bg-vignette`: Radial + linear gradient darkening edges
- `.bg-grain`: Noise texture overlay (9% opacity)

---

### 6.7 QuoteSection.tsx

**Purpose**: Scroll-sequenced philosophical quotes

**Props**:
```typescript
interface QuoteSectionProps {
  quote: string;
  alignment?: 'left' | 'right' | 'center';
}
```

**Features**:
- Intersection Observer triggers fade-in when 30% in viewport
- Fades out when scrolled past
- Aligned left/right/center with offset padding
- Large responsive typography (2.2rem to 3.5rem)
- Glowing text with multiple text-shadows

**Animation** `quoteGlow`:
- 4s pulsing brightness
- Min shadow: drop-shadow(0 0 20px)
- Max shadow: drop-shadow(0 0 30px) × 2

---

### 6.8 DivineSelectionRow.tsx

**Purpose**: Quick access constellation of all deities

**Features**:
- 7 circular avatar bubbles (120x120px)
- Alternating stagger animation delays (0-2.4s)
- Hover: scales 1.18x, bright glow
- Clicking navigates to `/god/:id`

**Animation** `divineAvatarFloat`:
- 6s ease-in-out
- Lifts -12px at 50%
- Each avatar offset by 0.4s for wave effect

---

## 7. STYLING SYSTEM

### Color Palette

**Core Colors**:
- Background: `#050510` (near black with blue tint)
- Text: `#f5f5f5` (off-white)
- Border/Subtle: `rgba(255, 255, 255, 0.08-0.25)`

**Deity Accent Colors** (used in chat glow effects):
```
Shiva:    #7f5af0 (purple)
Vishnu:   #2cb67d (teal)
Saraswati: #ff8906 (orange)
Krishna:   #4a90e2 (blue)
Ram:       #e74c3c (red)
Sita:      #f39c12 (gold)
Lakshmi:   #9b59b6 (magenta)
```

**Glow Colors**:
- Primary: White/bright
- Secondary: `rgba(200, 220, 255, ...)` (light blue)
- Accent: Deity-specific color

### Typography

**Font Stack**:
```css
/* Serif fonts imported from Google */
'Cinzel'              /* Headers, logos */
'Playfair Display'    /* Large titles */
'Cormorant Garamond'  /* Body, descriptions */
system-ui             /* Fallback */
```

**Sizing Strategy** (using `clamp()`):
```css
/* Responsive without media queries */
clamp(5rem, 16vw, 10.5rem)    /* BRAHMAN title */
clamp(4rem, 8vw, 6.5rem)      /* God names */
clamp(2.8rem, 6.5vw, 4.5rem)  /* Intro paragraphs */
clamp(2.2rem, 5.2vw, 3.5rem)  /* Quotes */
```

### Text Effects

**Glow Technique** (Layered shadows):
```css
text-shadow:
  0 0 50px rgba(255, 255, 255, 0.6),
  0 0 30px rgba(200, 220, 255, 0.4),
  0 0 15px rgba(150, 180, 255, 0.3);
filter: drop-shadow(0 0 20px rgba(200, 220, 255, 0.5));
```

**Background Clip Text** (Gradient text):
```css
background: linear-gradient(135deg, white 0%, rgba(240, 245, 255, 0.95) 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Backdrop Effects

**Frosted Glass Pattern**:
```css
backdrop-filter: blur(8px);
background: radial-gradient(circle at 30% 30%, 
  rgba(255, 255, 255, 0.08), 
  rgba(200, 220, 255, 0.04), 
  rgba(100, 150, 255, 0.02));
border: 1px solid rgba(255, 255, 255, 0.12);
box-shadow:
  inset 0 1px 0 rgba(255, 255, 255, 0.15),
  0 8px 32px rgba(0, 0, 0, 0.3),
  0 0 40px rgba(200, 220, 255, 0.1);
```

---

## 8. ANIMATION SYSTEM

### CSS Keyframes Library

**Large-Scale Animations**:

| Name | Duration | Effect |
|------|----------|--------|
| `brahmanReveal` | 4s | Scale 1.2→1, blur 12→0, opacity 0→1 |
| `floatingLotus` | 5.5s | Subtle 20px movement in circle |
| `divineAvatarFloat` | 6s | Lift -12px at midpoint |

**Glow/Pulsing Animations**:

| Name | Duration | Effect |
|------|----------|--------|
| `headerGlow` | 3s | Drop-shadow 10→20px, color shift |
| `nameGlow` | 3s | Glow intensity pulse |
| `etherealGlow` | 3s | Drop-shadow 20→35px |
| `quoteGlow` | 4s | Text-shadow and filter intensification |
| `chatNameGlow` | 4s | Multi-layer drop-shadow pulse |

**Entry Animations**:

| Name | Duration | Easing |
|------|----------|--------|
| `thoughtAppear` | 600-1000ms | cubic-bezier(0.4, 0, 0.2, 1) |
| `ephemeralFadeIn` | 500ms | cubic-bezier(0.25, 0.46, 0.45, 0.94) |
| `sendButtonAppear` | 300ms | cubic-bezier(0.22, 1, 0.36, 1) |

**Interactive Animations**:

| Name | Duration | Effect |
|------|----------|--------|
| `etherealFloat` | 3.5s | translateY(-8px) scale(1.01) |
| `typingPulse` | 1.6s | Dot pulse animation for typing indicator |
| `cursorBlink` | 2s | Input cursor opacity fade |

### Animation Stacking Strategy

**On Hover - God Cards**:
1. Avatar: scale(1.12) + border glow (400ms transition)
2. Text box: fade-in (500ms animation) + etherealFloat (3.5s loop)
3. Title: etherealGlow (3s loop)
4. Description: etherealGlow (3.5s loop, 0.3s delay)

**Message Appearance** (Chat):
- User message: 600ms appear
- God message: 1000ms appear (slower, more deliberate)
- Typing indicator: pulsing dots with staggered delays

---

## 9. RESPONSIVE DESIGN

### Breakpoint System

**Single Breakpoint** at 768px (`@media (max-width: 768px)`):

**Mobile Changes**:
```css
/* Header */
.brahman-header { padding-inline: 1rem; }

/* Gods Section */
.god-content-wrapper {
  flex-direction: column !important;
  gap: 2rem;
  padding: 2rem 1rem;
}
.god-left .god-float-text,
.god-right .god-float-text {
  text-align: center;
  max-width: 100%;
}

/* Chat */
.chat-panel { height: calc(100vh - 100px); }
.chat-thought-orb { max-width: min(28rem, 90%); }

/* Divine Selection */
.divine-avatars-constellation { gap: 3rem; }
.divine-avatar-bubble { width: 100px; height: 100px; }
```

---

## 10. STATE MANAGEMENT

### Component-Level State (No Global State Manager)

**Home Component State**:
```typescript
const [headerScale, setHeaderScale] = useState(1);           // Scroll progress
const [focusedGod, setFocusedGod] = useState<GodId | null>(null);
const [hoveredGod, setHoveredGod] = useState<GodId | null>(null);
const moodGod = hoveredGod ?? focusedGod;                    // Computed state
```

**ChatPanel State**:
```typescript
const [messages, setMessages] = useState<Message[]>([...]);
const [input, setInput] = useState('');
const [isResponding, setIsResponding] = useState(false);
const [responseIndex, setResponseIndex] = useState(0);       // Cycle through responses
```

**AmbientAudio State**:
```typescript
const [muted, setMuted] = useState(false);
const [open, setOpen] = useState(false);                     // Dropdown open
const [activeDeity, setActiveDeity] = useState<Deity>('krishna');
const [hasStarted, setHasStarted] = useState(false);         // Browser autoplay status
```

**Scroll State** (used globally):
```typescript
useEffect(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
}, []);
```

---

## 11. PERFORMANCE CONSIDERATIONS

### Current Issues to Fix

1. **Text Rendering**: All text has multiple text-shadows + filters = slow paint
2. **Animation Count**: 40+ animations running simultaneously on home page
3. **Scroll Event Handler**: Called on every pixel scroll (not throttled)
4. **Image Loading**: No lazy loading for deity backgrounds
5. **Font Loading**: 3 custom fonts loaded synchronously

### Optimization Recommendations

```typescript
// Throttle scroll handler
const [scrollY, setScrollY] = useState(0);
useEffect(() => {
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}, []);

// Lazy load background images
<img loading="lazy" src={...} />

// Reduce shadow complexity (layer fewer shadows)
// Use will-change strategically
// Consider reducing animation count with prefers-reduced-motion
```

---

## 12. BROWSER COMPATIBILITY

### Tested Browsers (assumed)
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Modern Features Used
- CSS Grid/Flexbox
- CSS Variables (custom properties)
- Backdrop-filter (iOS 15+, Chrome 76+)
- CSS Gradient
- SVG

### Fallbacks Needed
- Backdrop-filter has no fallback (solid background)
- Gradient text needs webkit prefix
- Text-shadow supported everywhere

---

## 13. ASSET REQUIREMENTS

### Images Needed

**Deity Avatars** (7 files):
```
/images/avatars/
  shiva.png         (280x280px, circular crop)
  vishnu.png
  saraswati.png
  krishna.png
  ram.png
  sita.png
  lakshmi.png
```

**Background Images** (7 files):
```
/images/backgrounds/
  brahman.jpg       (Hero background, ~1920x1080)
  shiva.jpg
  vishnu.jpg
  saraswati.jpg
  krishna.jpg
  ram.jpg
  sita.jpg
  lakshmi.jpg
```

**Audio Avatars** (3 files):
```
/images/audio-avatars/
  krishna.png       (32x32px)
  shiva.png
  ram.png
```

**Audio Files** (3 files):
```
/audio/
  krishna.mp3       (~3-5 MB, looping ambient)
  shiva.mp3
  ram.mp3
```

---

## 14. KNOWN ISSUES & BUGS

### Current Problems

1. **Audio Autoplay**
   - First load: browser blocks autoplay
   - Workaround: Attempts play() but catches silently
   - Solution: Provide user gesture (click unmute) first
   - Status: Works but not ideal UX

2. **BRAHMAN Text Glitching** (FIXED)
   - Issue: Element rendered at full opacity before animation
   - Solution: 2-second delay + conditional rendering
   - Now works correctly

3. **Text Performance**
   - Multiple layered text-shadows causing jank
   - Animation count too high on home page
   - Solution: Reduce shadow complexity, use CSS containment

4. **No Scroll Reset on Route Change**
   - Chat page inherits scroll position from home
   - Solution: Add `window.scrollTo(0,0)` in route change handler

5. **Typing Indicator Text is Invisible**
   - Dots appear but hard to see against background
   - Solution: Make dots more opaque/colored

---

## 15. AREAS FOR IMPROVEMENT

### UI/UX Enhancements

1. **Introduction Section**
   - Too long, forces 220vh scroll
   - Suggestion: Condense to 100-120vh, make text larger

2. **God Description Text**
   - On mobile, text wraps awkwardly
   - Suggestion: Better responsive sizing

3. **Chat Interface**
   - Responses are static rotation
   - Suggestion: Implement real LLM API (OpenAI, Anthropic)
   - Add typing speed variation

4. **Audio System**
   - Only 3 tracks available (should be 7, one per deity)
   - No crossfade between tracks
   - Suggestion: Add smooth volume cross-fade on track change

5. **Visual Hierarchy**
   - Too many glows = visual noise
   - Suggestion: Reduce glow intensity by 30%, remove some shadows

### Technical Improvements

1. **State Management**
   - No centralized state (context would help)
   - Suggestion: Use Context API for theme/audio state

2. **Component Organization**
   - God responses hardcoded in component
   - Suggestion: Move to separate data file
   - Consider database for dynamic responses

3. **Image Optimization**
   - No WebP format, no srcset
   - Suggestion: Use responsive images, modern formats

4. **Error Handling**
   - No error boundary
   - Suggestion: Add error boundary for god chat

5. **Accessibility**
   - No alt text consistency check
   - Low contrast in some areas
   - Suggestion: WCAG 2.1 AA audit, improve aria labels

---

## 16. FUTURE FEATURES

### Phase 2 Improvements

1. **Backend Integration**
   - User authentication (Supabase, Firebase)
   - Save chat history
   - User preferences (theme, volume)

2. **AI Responses**
   - Replace rotating responses with LLM API
   - Streaming responses
   - Memory of conversation

3. **Advanced Audio**
   - Crossfading between tracks
   - Volume automation
   - Spatial audio effects

4. **Interactive Meditation**
   - Guided meditations per deity
   - Timer/session tracking
   - Progress tracking

5. **Social Features**
   - Share quotes/insights
   - Community responses
   - Leaderboard

6. **Mobile App**
   - React Native version
   - Offline mode
   - Push notifications

---

## 17. DEPLOYMENT

### Current Build Process
```bash
npm install
npm run dev      # Local development
npm run build    # Production build (tsc + vite build)
npm run preview  # Preview production build
```

### Environment Setup
- **Node**: 18+ (assumed)
- **Package Manager**: npm/yarn/pnpm
- **Env Variables**: None currently required

### Deployment Targets
- Vercel (recommended for Vite)
- Netlify
- AWS S3 + CloudFront
- Self-hosted Node server

---

## 18. CODE PATTERNS & CONVENTIONS

### Naming Conventions
```typescript
// Components
function ComponentName() { }

// Hooks
const [state, setState] = useState(...)
const ref = useRef<Type>(null)

// CSS Classes
.component-name { }
.component-section-element { }
.component-element--modifier { }

// Constants
const GODS: GodConfig[] = [...]
const TRACKS: Record<...> = {...}
const RESPONSES: Record<...> = {...}
```

### Component Structure
```typescript
// Props Interface
interface ComponentProps { }

// Component
export function Component({ prop }: ComponentProps) {
  const [state, setState] = useState(...)
  
  useEffect(() => {
    // Side effects
  }, [])
  
  return (
    <div className="component">
      {/* JSX */}
    </div>
  )
}
```

### CSS Organization
```css
/* 1. Layout & Structure */
.component { position, display, grid/flex }

/* 2. Sizing */
width, height, padding, margin, gap

/* 3. Colors & Styling */
background, border, shadow, opacity

/* 4. Typography */
font-family, font-size, line-height

/* 5. Animations */
animation, transition, transform

/* 6. Responsive */
@media (max-width: 768px) { }
```

---

## 19. QUICK START FOR IMPROVEMENT

### Immediate Wins (1-2 hours)

1. **Reduce Glow Intensity**
   - Lower drop-shadow blur radius by 20%
   - Reduce opacity on text-shadows
   - Remove some shadow layers

2. **Fix Intro Length**
   - Cut to 15 paragraphs instead of 22
   - Reduce min-height from 220vh to 120vh

3. **Improve Mobile Text**
   - Add better responsive font sizing
   - Adjust padding/margins for small screens

4. **Audio Experience**
   - Auto-play with visual feedback
   - Show loading state for audio

### Medium Improvements (4-8 hours)

1. **Performance Audit**
   - Reduce animation complexity
   - Lazy load images
   - Optimize font loading

2. **Visual Refresh**
   - New color scheme or tweak existing
   - Better spacing/hierarchy
   - Remove visual clutter

3. **Better Chat**
   - Add real LLM integration
   - Stream responses
   - Better typing indicators

4. **Accessibility**
   - WCAG 2.1 AA compliance
   - Better keyboard navigation
   - Color contrast fixes

### Major Overhauls (2-4 days)

1. **Backend Development**
   - User system
   - Chat persistence
   - Analytics

2. **Mobile App**
   - React Native version
   - Native features

3. **Advanced Features**
   - Guided meditations
   - Social sharing
   - Progress tracking

---

## 20. FILE REFERENCES

### Key Files to Understand First

1. **src/App.tsx** - Start here for routing/data structure
2. **src/style.css** - Study animation system and responsive design
3. **src/components/ChatPanel.tsx** - Understand message handling
4. **src/components/GodSection.tsx** - Study hover state management
5. **src/components/AmbientAudio.tsx** - Audio autoplay strategy

### Architecture Decision Points

1. **Why React Router instead of Next.js?**
   - Lighter bundle
   - More control over animations
   - No SSR needed for meditation app

2. **Why CSS instead of Tailwind/styled-components?**
   - Custom animations require direct CSS
   - Performance (no JS-in-CSS runtime)
   - Easier to debug complex selectors

3. **Why component state instead of Redux/Zustand?**
   - Small app (simple state)
   - Minimal prop drilling
   - Can be refactored later if needed

---

## 21. FINAL NOTES

### What Makes This "Suck"

Current issues holding the site back:
- **Visual noise**: Too many glows competing
- **Performance**: Unoptimized scroll handlers and animations
- **UX friction**: Audio autoplay failure, intro too long
- **Lack of personality**: Responses feel generic, not unique
- **Mobile experience**: Cramped text, poor touch targets

### Why It Should Be Better

The foundation is solid:
- ✅ Beautiful color system and typography
- ✅ Sophisticated animation composition
- ✅ Smart responsive design with clamp()
- ✅ Proper React patterns and hooks
- ✅ Good component separation

### The Rebuild Opportunity

"Emergent" can build a significantly better version by:

1. **Simplifying Visual Complexity**
   - Remove 50% of glows/shadows
   - Focus on 3-4 key animations per section
   - Better visual hierarchy

2. **Improving Performance**
   - Throttle scroll events
   - Lazy load images
   - Reduce repaints during animations

3. **Enhancing Interactivity**
   - Real LLM responses
   - Better audio experience
   - Smoother transitions

4. **Better Mobile Experience**
   - Touch-friendly hit targets
   - Optimized text sizing
   - Faster load times

5. **Adding Features**
   - User accounts
   - Chat history
   - Analytics
   - Meditation timer

---

**Total Lines of Code**: ~1,200 React + ~1,700 CSS = 2,900 total  
**Complexity Level**: Medium-High (animations + state management)  
**Time to Rebuild**: 3-5 days for improved version (2-3 weeks with backend/advanced features)

---

*This specification was compiled for maximum clarity and actionability. Use it as a blueprint to build something better.*
