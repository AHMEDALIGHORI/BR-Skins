'use client';
import { useEffect, useRef, useState } from 'react';
import { TESTIMONIALS } from '@/lib/products';
import { useScene } from '@/lib/scene';
import { Chapter, SceneTitle, ProgressRail } from '@/components/ui/SceneUI';
export default function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { progress } = useScene(ref, 350);
  useEffect(() => {
    if (!track.current) return;
    const measure = () => setDistance(Math.max(0, track.current!.scrollWidth - track.current!.parentElement!.clientWidth));
    const observer = new ResizeObserver(measure); observer.observe(track.current.parentElement!); measure();
    return () => observer.disconnect();
  }, []);
  return <section ref={ref} id="section-testimonials" className="cinema-scene testimonials-scene">
    <div className="scene-inner">
      <Chapter number="08">Words to glow by</Chapter><SceneTitle>A ritual worth sharing.</SceneTitle>
      <div className="testimonial-window"><div ref={track} className="testimonial-track" style={{ transform: `translateX(${-progress * distance}px)` }}>
        {TESTIMONIALS.map((item, i) => <article className="testimonial-card" key={item.author} style={{ transform: `translate(${Math.sin(progress * Math.PI * 2) * (i + 1) * 12}px, ${Math.sin(progress * Math.PI) * (i % 2 ? -1 : 1) * 14}px)` }}>
          <span className="quote-mark" aria-hidden="true">“</span><blockquote>{item.quote}</blockquote><div><strong>{item.author}</strong><span>{item.publication}</span></div>
        </article>)}
      </div></div>
      <p className="scene-footnote"><span>The BR-Skins community</span><span>Keep scrolling to explore →</span></p>
    </div><ProgressRail progress={progress} />
  </section>;
}
