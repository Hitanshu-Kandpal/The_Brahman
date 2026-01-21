import { useEffect, useMemo, useState } from 'react';

interface BackgroundLayersProps {
  baseSrc: string;
  activeSrc?: string | null;
  overlaySrc?: string | null;
  overlayKey?: string | null;
}

/**
 * Cinematic background system:
 * - base layer (always present)
 * - active layer (committed selection, eg. focused god / route)
 * - overlay layer (temporary, eg. hover)
 *
 * Crossfades are done in CSS; this component only orchestrates URLs + scroll parallax.
 */
export function BackgroundLayers({
  baseSrc,
  activeSrc,
  overlaySrc,
  overlayKey,
}: BackgroundLayersProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const parallaxStyle = useMemo(() => {
    // Very restrained movement: a slow upward drift + tiny scale.
    const y = Math.min(scrollY * 0.06, 60);
    const scale = 1.03;
    return { transform: `translate3d(0, ${-y}px, 0) scale(${scale})` };
  }, [scrollY]);

  return (
    <div className="bg-layers" aria-hidden="true">
      <div className="bg-layer bg-layer-base" style={{ ...parallaxStyle, backgroundImage: srcToBg(baseSrc) }} />
      <div
        className={`bg-layer bg-layer-active ${activeSrc ? 'is-on' : ''}`}
        style={{ ...parallaxStyle, backgroundImage: srcToBg(activeSrc || '') }}
      />
      <div
        key={overlayKey || 'overlay'}
        className={`bg-layer bg-layer-overlay ${overlaySrc ? 'is-on' : ''}`}
        style={{ ...parallaxStyle, backgroundImage: srcToBg(overlaySrc || '') }}
      />
      <div className="bg-vignette" />
      <div className="bg-grain" />
    </div>
  );
}

function srcToBg(src: string) {
  if (!src) return undefined;
  // Use CSS var for placeholders too; user can drop images in /public/images/...
  return `url("${src}")`;
}


