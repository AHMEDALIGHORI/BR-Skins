'use client';
import Image from 'next/image';
import { useRef } from 'react';
import { useScene, phase } from '@/lib/scene';
import ScrollVideo from '@/components/ui/ScrollVideo';
import { Chapter, ProgressRail } from '@/components/ui/SceneUI';
import dynamic from 'next/dynamic';
const SceneCanvas = dynamic(() => import('@/components/canvas/SceneCanvas'), { ssr: false });
const Dust = dynamic(() => import('@/components/canvas/SceneObjects').then(m => m.Dust), { ssr: false });
export default function HeroSection({ ready = false }: { ready?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { progress } = useScene(ref, 300);
  return <section ref={ref} id="section-hero" className={`cinema-scene hero-scene ${ready ? 'hero-ready' : ''}`}>
    <ScrollVideo src="/assets/hero-bg-loop.mp4" progress={progress} eager />
    <div className="scene-wash" />
    <div className="hero-particles"><SceneCanvas><Dust progress={progress} /></SceneCanvas></div>
    <div className="scene-inner hero-inner">
      <Chapter number="01">The art of feeling luminous</Chapter>
      <div className="hero-composition" onPointerMove={e => {
        if (e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mx', `${(e.clientX - r.left) / r.width - 0.5}`);
        e.currentTarget.style.setProperty('--my', `${(e.clientY - r.top) / r.height - 0.5}`);
      }} onPointerLeave={e => { e.currentTarget.style.setProperty('--mx', '0'); e.currentTarget.style.setProperty('--my', '0'); }}>
        <div className="hero-photograph" style={{ scale: `${1 + progress * 0.3}`, translate: `0 ${-progress * 18}px` }}>
          <Image width={2752} height={1536} sizes="(max-width: 767px) 90vw, 900px" quality={85} src="/assets/hero-bottle.jpg" alt="BR-Skins frosted glass bottle with yellow serum and a silver cap" priority />
        </div>
        <h1 className="hero-title" aria-label="Luxury skincare, powered by science." style={{ opacity: 1 - phase(progress, 0.1, 0.45), transform: `translateY(${-progress * 70}px)` }}>
          {['Luxury skincare,', 'powered by science.'].map((line, i) => <span key={line} className={i ? 'hero-line italic' : 'hero-line'} aria-hidden="true">
            {line.split(' ').map((word, j) => <span className="word-mask" key={j}>{Array.from(word).map((char, k) => <span className="hero-letter" key={k} style={{ transitionDelay: `${(j * 8 + k) * 18 + i * 170}ms` }}>{char}</span>)}{'\u00a0'}</span>)}
          </span>)}
        </h1>
      </div>
      <div className="scene-footnote" style={{ opacity: 1 - phase(progress, 0, 0.4) }}><span>Considered ingredients. Beautiful rituals.</span><span>Scroll to discover ↓</span></div>
    </div><ProgressRail progress={progress} />
  </section>;
}
