import { useEffect, useRef, useState } from 'react';

interface CinematicEntryProps {
  onScrollProgress: (scale: number) => void;
}

export function CinematicEntry({ onScrollProgress }: CinematicEntryProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineOpacities, setLineOpacities] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !titleRef.current) return;

      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      // Get position of the title element
      const rect = titleRef.current.getBoundingClientRect();
      const lineCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(lineCenter - viewportCenter);

      // Fade zone: title fades out as it moves away from center
      // Full opacity when at center, fade to 0 when 60% away from center
      const fadeZone = viewportHeight * 0.6;
      const opacity = Math.max(0, Math.min(1, 1 - (distanceFromCenter / fadeZone)));

      // Calculate scale based on distance from center - shrink as it goes up
      const scale = Math.max(0.2, 1 - (distanceFromCenter / (fadeZone * 1.5)));

      if (titleRef.current) {
        titleRef.current.style.opacity = opacity.toString();
        titleRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }

      setLineOpacities(opacity);
      onScrollProgress(scale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollProgress]);

  return (
    <div ref={containerRef} className="cinematic-entry">
      <div ref={titleRef} className="brahman-cinematic-title" style={{ opacity: lineOpacities }}>
        BRAHMAN
      </div>
    </div>
  );
}
