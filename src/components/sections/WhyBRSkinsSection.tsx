'use client';
import Image from 'next/image';
import { useRef } from 'react';
import { FlaskConical, Droplets, Sun, Sparkles } from 'lucide-react';
import { useScene, phase } from '@/lib/scene';
import { Chapter, SceneTitle, ProgressRail } from '@/components/ui/SceneUI';
const pillars = [
  { icon: FlaskConical, title: 'Science, considered.', text: 'Purposeful ingredients, chosen to become part of your everyday ritual.', color: '#FFD54A' },
  { icon: Droplets, title: 'A sensory experience.', text: 'Lightweight serums. Soft textures. A little pleasure in every application.', color: '#4DA6FF' },
  { icon: Sun, title: 'Your own rhythm.', text: 'From a bright morning to a quiet evening, a collection for your routine.', color: '#FF4FA3' },
  { icon: Sparkles, title: 'Beautiful by design.', text: 'Frosted glass, luminous colors and precise details worth keeping close.', color: '#C9A6FF' },
];
export default function WhyBRSkinsSection() {
  const ref = useRef<HTMLElement>(null);
  const { progress } = useScene(ref, 300);
  return <section ref={ref} id="section-why" className="cinema-scene why-scene">
    <div className="scene-inner">
      <Chapter number="07">Our point of view</Chapter><SceneTitle>Why BR-Skins.</SceneTitle>
      <div className="why-grid">{pillars.map((pillar, i) => {
        const reveal = phase(progress, i * 0.1, 0.2 + i * 0.1);
        const Icon = pillar.icon;
        return <article key={pillar.title} className="why-pillar" style={{ opacity: reveal, translate: `0 ${(1 - reveal) * 32}px` }}>
          <div className="pillar-icon" style={{ background: pillar.color + '30', transform: `rotate(${(1 - reveal) * -40}deg) scale(${0.6 + reveal * 0.4})` }}><Icon size={22} strokeWidth={1.2} /></div>
          <span className="eyebrow">0{i + 1}</span><h3>{pillar.title}</h3><p>{pillar.text}</p>
        </article>;
      })}</div>
      <figure className="collection-photograph" style={{ opacity: phase(progress, 0.45, 0.75), clipPath: `inset(0 ${(1 - phase(progress, 0.4, 0.8)) * 100}% 0 0 round 8px)` }}><Image width={2752} height={1536} sizes="(max-width: 767px) 90vw, 900px" quality={85} src="/assets/complete-collection.jpg" alt="All five BR-Skins products in yellow, ocean blue, magenta, lavender and pearl" loading="lazy" /><figcaption>Five signatures. One philosophy.</figcaption></figure>
    </div><ProgressRail progress={progress} />
  </section>;
}
