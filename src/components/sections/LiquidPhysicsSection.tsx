'use client';
import { useRef } from 'react';
import { useScene, phase } from '@/lib/scene';
import ScrollVideo from '@/components/ui/ScrollVideo';
import { Chapter, SceneTitle, ProgressRail } from '@/components/ui/SceneUI';
import dynamic from 'next/dynamic';
const SceneCanvas = dynamic(() => import('@/components/canvas/SceneCanvas'), { ssr: false });
const OrbitBottle = dynamic(() => import('@/components/canvas/SceneObjects').then(m => m.OrbitBottle), { ssr: false });
const Dust = dynamic(() => import('@/components/canvas/SceneObjects').then(m => m.Dust), { ssr: false });
const FluidDroplets = dynamic(() => import('@/components/canvas/FluidDroplets'), { ssr: false });
export default function LiquidPhysicsSection() {
  const ref = useRef<HTMLElement>(null);
  const { progress } = useScene(ref, 300);
  const morph = phase(progress, 0.35, 0.85);
  return <section ref={ref} id="section-liquid" className="cinema-scene liquid-scene">
    <div className="liquid-footage" style={{ opacity: 1 - morph * 0.82, filter: `blur(${morph * 9}px)`, transform: `scale(${1 + morph * 0.08})` }}><ScrollVideo src="/assets/liquid-physics.mp4" progress={progress} /></div>
    <div className="scene-wash" />
    <div className="scene-inner">
      <Chapter number="04">The poetry of hydration</Chapter>
      <div style={{ opacity: 1 - phase(progress, 0.55, 0.9) }}><SceneTitle>From fluid. To feeling.</SceneTitle></div>
      <div className="liquid-bottle" style={{ opacity: morph, filter: `blur(${(1 - morph) * 16}px)`, clipPath: `inset(${(1 - morph) * 48}% 0 ${(1 - morph) * 48}% 0 round ${80 * (1 - morph)}%)` }}>
        <SceneCanvas><FluidDroplets progress={morph} /><OrbitBottle progress={progress * 0.12} color="#4DA6FF" morph={morph} /><Dust progress={progress} /></SceneCanvas>
      </div>
      <p className="liquid-caption" style={{ opacity: phase(progress, 0.65, 0.9) }}><span className="eyebrow">Meet Hydra Boost</span><span>A little ocean. A daily ritual.</span></p>
    </div><ProgressRail progress={progress} />
  </section>;
}
