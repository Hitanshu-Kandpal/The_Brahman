import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import type { GodConfig } from '../App';

interface GodSectionProps {
  god: GodConfig;
  isActive: boolean;
  alignment: 'left' | 'right';
  onHover: () => void;
  onLeave: () => void;
  onInView: () => void;
}

export function GodSection({
  god,
  isActive,
  alignment,
  onHover,
  onLeave,
  onInView,
}: GodSectionProps) {
  const navigate = useNavigate();
  const [hasEntered, setHasEntered] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          onInView();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onInView]);

  const isRight = alignment === 'right';

  const handleClick = () => {
    sessionStorage.setItem('lastGod', god.id);
    navigate(`/god/${god.id}`);
  };

  return (
    <div
      ref={ref}
      id={`god-${god.id}`}   // ⭐ IMPORTANT: for scroll-back
      className={`god-presence ${isRight ? 'god-right' : 'god-left'} ${
        hasEntered ? 'god-presence-visible' : ''
      } ${isActive ? 'god-presence-active' : ''}`}
    >
      <div
        className="god-avatar-wrapper"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={handleClick}
      >
        <div className="god-avatar">
          <img
            src={god.avatarSrc}
            alt={god.name}
            className="god-avatar-img"
          />
        </div>
        <div className="god-name-label">{god.name}</div>
      </div>

      <div className="god-float-text">
        <Typography className="god-float-title">
          {god.title}
        </Typography>
        <Typography className="god-float-description">
          {god.description}
        </Typography>
      </div>
    </div>
  );
}
