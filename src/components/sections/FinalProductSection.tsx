'use client';
import { useRef, useState, CSSProperties } from 'react';
import { useScene, phase } from '@/lib/scene';
import { PRODUCTS } from '@/lib/products';
import { Chapter, SceneTitle, MagneticButton, ProgressRail } from '@/components/ui/SceneUI';
import dynamic from 'next/dynamic';
const SceneCanvas = dynamic(() => import('@/components/canvas/SceneCanvas'), { ssr: false });
const OrbitBottle = dynamic(() => import('@/components/canvas/SceneObjects').then(m => m.OrbitBottle), { ssr: false });
const Dust = dynamic(() => import('@/components/canvas/SceneObjects').then(m => m.Dust), { ssr: false });
export default function FinalProductSection() {
  const ref = useRef<HTMLElement>(null);
  const { progress } = useScene(ref, 300);
  const [color, setColor] = useState('#FFD54A');
  return <section ref={ref} id="section-final" className="cinema-scene final-scene" style={{ backgroundColor: `rgb(${245 + phase(progress, 0, 0.5) * 8}, ${239 + phase(progress, 0, 0.5) * 9}, ${230 + phase(progress, 0, 0.5) * 13})` }}>
    <div className="scene-inner">
      <Chapter number="09">Your next chapter</Chapter>
      <div className="final-layout">
        <div className="final-visual"><SceneCanvas rose effects><OrbitBottle progress={progress} color={color} /><Dust progress={progress} /></SceneCanvas>
          <nav className="product-swatches" aria-label="Preview a bottle color">{PRODUCTS.map(item => <button key={item.id} onClick={() => setColor(item.hex)} aria-label={`Preview ${item.colorName}`} aria-pressed={color === item.hex} style={{ '--swatch': item.hex } as CSSProperties}><span /></button>)}</nav>
        </div>
        <div className="final-copy"><SceneTitle>Experience skincare reimagined.</SceneTitle><p className="scene-description" data-reveal>Thoughtful formulas. Beautiful objects. A moment, every day, that belongs to you.</p>
          <MagneticButton onClick={() => window.dispatchEvent(new CustomEvent('br:scroll-to', { detail: '#section-showcase' }))}>Shop Collection <span>↗</span></MagneticButton>
        </div>
      </div>
    </div><ProgressRail progress={progress} />
  </section>;
}
