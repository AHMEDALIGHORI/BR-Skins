'use client';
import Image from 'next/image';
import { useRef } from 'react';
import { useScene, phase } from '@/lib/scene';
import { Chapter, SceneTitle, ProgressRail } from '@/components/ui/SceneUI';
import dynamic from 'next/dynamic';
const SceneCanvas = dynamic(() => import('@/components/canvas/SceneCanvas'), { ssr: false });
const Dust = dynamic(() => import('@/components/canvas/SceneObjects').then(m => m.Dust), { ssr: false });
export default function LifestyleSection() {
  const ref = useRef<HTMLElement>(null);
  const { progress } = useScene(ref, 300);
  return <section ref={ref} id="section-lifestyle" className="cinema-scene lifestyle-scene">
    <div className="hero-particles"><SceneCanvas><Dust progress={progress} count={35} /></SceneCanvas></div>
    <div className="scene-inner">
      <Chapter number="06">A moment for yourself</Chapter>
      <SceneTitle>Glow begins with confidence.</SceneTitle>
      <div className="editorial-layout">
        {['holding', 'applying'].map((action, i) => <figure key={action} className="editorial-frame" style={{ clipPath: `inset(${(1 - phase(progress, i * 0.1, 0.35 + i * 0.1)) * 100}% 0 0 0 round 6px)`, translate: `0 ${(progress - 0.5) * (i ? -24 : 24)}px` }}
          onPointerMove={e => {
            if (e.pointerType !== 'mouse') return;
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty('--rx', `${((e.clientY - rect.top) / rect.height - 0.5) * -4}deg`);
            e.currentTarget.style.setProperty('--ry', `${((e.clientX - rect.left) / rect.width - 0.5) * 4}deg`);
          }} onPointerLeave={e => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); }}>
          <Image width={2752} height={1536} sizes="(max-width: 767px) 90vw, 900px" quality={85} src={`/assets/lifestyle_woman_${action}_serum.jpg`} alt={i ? 'A woman applying BR-Skins serum' : 'A smiling woman holding BR-Skins serum'} loading="lazy" />
          <figcaption>{i ? 'A quiet ritual. A radiant beginning.' : 'Beautiful skin. Entirely your own.'}</figcaption>
        </figure>)}
        <div className="editorial-note" data-reveal><span className="eyebrow">The everyday, elevated</span><p>Skincare is a moment to reconnect. A few considered drops. A touch of care. Confidence that feels like you.</p></div>
      </div>
    </div><ProgressRail progress={progress} />
  </section>;
}
