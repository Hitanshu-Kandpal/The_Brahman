import { useEffect, useRef, useState } from 'react';

export function Introduction() {
  const [lineOpacities, setLineOpacities] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      
      // Calculate opacity for each line based on its distance from viewport center
      const opacities = paragraphRefs.current.map((ref) => {
        if (!ref) return 0;
        
        const rect = ref.getBoundingClientRect();
        const lineCenter = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(lineCenter - viewportCenter);
        
        // Fade zone: lines fade out as they move away from center
        // Full opacity when at center, fade to 0 when 60% away from center
        const fadeZone = viewportHeight * 0.6;
        const opacity = Math.max(0, Math.min(1, 1 - (distanceFromCenter / fadeZone)));
        
        return opacity;
      });
      
      setLineOpacities(opacities);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const paragraphs = [
    'This is not a website.',
    'It is a space.',
    '',
    'A space where thought slows,',
    'and attention turns inward.',
    '',
    'Brahman is not a god.',
    'Brahman is the ground of all things.',
    '',
    'The silence behind sound.',
    'The awareness behind thought.',
    '',
    'Every form arises from it.',
    'Every form dissolves back into it.',
    '',
    'You are not separate from it.',
    '',
    'What you call the self',
    'is only a wave on a larger ocean.',
    '',
    'To know this',
    'is not belief —',
    'it is remembrance.',
    '',
    'Moksha is not escape.',
    'It is not heaven.',
    '',
    'It is the end of forgetting',
    'who you are.',
    '',
    'When the mind becomes still,',
    'when attachment loosens,',
    'when identity dissolves —',
    '',
    'what remains',
    'is freedom.',
    '',
    'The forms you are about to encounter',
    'are not beings above you.',
    '',
    'They are aspects of the same truth,',
    'reflected through different paths.',
    '',
    'Walk slowly.',
    'Read carefully.',
    '',
    'Nothing here is meant to be rushed.',
  ];

  // Track line index for opacity mapping
  let lineIndex = 0;

  return (
    <section className="brahman-introduction" ref={containerRef}>
      <div className="brahman-introduction-content">
        {paragraphs.map((text, index) => {
          if (text === '') {
            return <div key={index} className="brahman-intro-spacer" />;
          }
          
          const currentLineIndex = lineIndex;
          const opacity = lineOpacities[currentLineIndex] || 0;
          lineIndex++;
          
          return (
            <p
              key={index}
              ref={(el) => {
                paragraphRefs.current[currentLineIndex] = el;
              }}
              className="brahman-intro-paragraph"
              style={{ opacity }}
            >
              {text}
            </p>
          );
        })}
      </div>
    </section>
  );
}
