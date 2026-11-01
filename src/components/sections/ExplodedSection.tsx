'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useScene } from '@/lib/scene';
import ScrollVideo from '@/components/ui/ScrollVideo';
import { Chapter, SceneTitle, ProgressRail } from '@/components/ui/SceneUI';
import dynamic from 'next/dynamic';
const SceneCanvas = dynamic(() => import('@/components/canvas/SceneCanvas'), { ssr: false });
const ExplodedAssembly = dynamic(() => import('@/components/canvas/SceneObjects').then(m => m.ExplodedAssembly), { ssr: false });
export default function ExplodedSection() {
  const ref = useRef<HTMLElement>(null);
  const { progress } = useScene(ref, 400);
  const [frameProgress, setFrameProgress] = useState(0);
  return <section ref={ref} id="section-exploded" className="cinema-scene anatomy-scene">
    <div className="scene-inner">
      <Chapter number="02">Beautiful, down to the detail</Chapter>
      <div className="anatomy-layout">
        <div className="anatomy-copy"><SceneTitle>Anatomy of perfection.</SceneTitle>
          <p data-reveal className="scene-description">A considered composition of frosted glass, a precision pipette and luminous Vitamin C. Silver, warmed by rose-gold light.</p>
          <figure className="anatomy-reference" data-reveal><Image width={2752} height={1536} sizes="(max-width: 767px) 90vw, 900px" quality={85} src="/assets/exploded-view.jpg" alt="Original exploded BR-Skins product photograph" loading="lazy" /><figcaption>The original study</figcaption></figure>
        </div>
        <div className="anatomy-model"><SceneCanvas rose fallback="/assets/exploded-view.jpg"><ExplodedAssembly progress={frameProgress} /></SceneCanvas></div>
        <figure className="anatomy-film"><ScrollVideo src="/assets/bottle-explosion.mp4" progress={progress} onFrame={setFrameProgress} /><figcaption>From a single form, every detail unfolds.</figcaption></figure>
      </div><ProgressRail progress={progress} />
    </div>
  </section>;
}
