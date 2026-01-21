import { useEffect, useRef } from 'react';

interface CinematicEntryProps {
  onScrollProgress: (scale: number) => void;
}

export function CinematicEntry({ onScrollProgress }: CinematicEntryProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !titleRef.current) return;

      const containerTop = containerRef.current.getBoundingClientRect().top;
      const scrollProgress = Math.max(0, Math.min(1, -containerTop / 400));
      const scale = 1 - scrollProgress * 0.6; // Shrinks to 0.4
      const opacity = Math.max(0, 1 - scrollProgress * 1.2);

      // Apply scroll transform with centered positioning
      if (titleRef.current) {
        titleRef.current.style.transform = `translate(-50%, calc(-50% + ${scrollProgress * 120}px)) scale(${scale})`;
        titleRef.current.style.opacity = opacity.toString();
      }

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
      <div ref={titleRef} className="brahman-cinematic-title">
        BRAHMAN
      </div>
    </div>
  );
}
