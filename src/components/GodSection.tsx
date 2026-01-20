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
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEntered(true);
            onInView();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -5% 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [onInView]);

  const isRight = alignment === 'right';

  return (
    <div
      ref={ref}
      id={god.id === 'shiva' ? 'gods' : undefined}
      className={`god-presence ${isRight ? 'god-right' : 'god-left'} ${
        hasEntered ? 'god-presence-visible' : ''
      } ${isActive ? 'god-presence-active' : ''}`}
    >
      <div
        className="god-avatar-wrapper"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={() => navigate(`/god/${god.id}`)}
      >
        <div className="god-avatar">
          <img
            className="god-avatar-img"
            src={god.avatarSrc}
            alt={god.name}
          />
        </div>
        <div className="god-name-label">{god.name}</div>
      </div>

      <div className="god-float-text">
        <Typography variant="subtitle2" className="god-float-title">
          {god.title}
        </Typography>
        <Typography variant="body2" className="god-float-description">
          {god.description}
        </Typography>
      </div>
    </div>
  );
}
