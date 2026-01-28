import { useEffect, useRef, useState } from 'react';

interface QuoteSectionProps {
  quote: string;
  alignment?: 'left' | 'right' | 'center';
}

export function QuoteSection({ quote, alignment = 'center' }: QuoteSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            // Fade out when leaving viewport
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -20% 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, []);

  const alignmentClass = alignment === 'left' ? 'quote-left' : alignment === 'right' ? 'quote-right' : 'quote-center';

  return (
    <div
      ref={ref}
      className={`quote-section ${alignmentClass} ${isVisible ? 'quote-visible' : ''}`}
    >
      <p className="quote-text">{quote}</p>
    </div>
  );
}
