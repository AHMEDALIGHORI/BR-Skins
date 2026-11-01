'use client';
import { useRef, CSSProperties } from 'react';
import { INGREDIENTS } from '@/lib/products';
import { useScene, phase } from '@/lib/scene';
import ScrollVideo from '@/components/ui/ScrollVideo';
import { Chapter, SceneTitle, ProgressRail } from '@/components/ui/SceneUI';
import dynamic from 'next/dynamic';
const SceneCanvas = dynamic(() => import('@/components/canvas/SceneCanvas'), { ssr: false });
const IngredientMolecules = dynamic(() => import('@/components/canvas/SceneObjects').then(m => m.IngredientMolecules), { ssr: false });
export default function IngredientsSection() {
  const ref = useRef<HTMLElement>(null);
  const { progress, seek } = useScene(ref, 350);
  const active = Math.min(4, Math.floor(progress * 5));
  return <section ref={ref} id="section-ingredients" className="cinema-scene ingredients-scene">
    <ScrollVideo src="/assets/ingredients-universe.mp4" progress={progress} /><div className="scene-wash stronger" />
    <div className="scene-inner">
      <Chapter number="03">A universe within every drop</Chapter><SceneTitle>The science behind glowing skin.</SceneTitle>
      <div className="ingredients-layout">
        <div className="molecule-stage"><SceneCanvas><IngredientMolecules progress={progress} /></SceneCanvas></div>
        <div className="ingredient-content">
          <div className="ingredient-pages">{INGREDIENTS.map((ingredient, i) => {
            const amount = phase(progress, i / 5, i / 5 + 0.045);
            return <article className="ingredient-page" key={ingredient.name} aria-hidden={active !== i} style={{ opacity: active === i ? 0.45 + amount * 0.55 : 0, transform: `translateY(${active === i ? (1 - amount) * 18 : 18}px)`, visibility: active === i ? 'visible' : 'hidden' }}>
              <span className="eyebrow">{String(i + 1).padStart(2, '0')} / {ingredient.category}</span>
              <h3>{ingredient.name}</h3><p>{ingredient.description}</p>
              <div className="ingredient-detail"><span>Key ingredient</span><strong>{ingredient.concentration}</strong></div>
            </article>;
          })}</div>
          <nav className="ingredient-tabs" aria-label="Choose an ingredient">{INGREDIENTS.map((item, i) => <button key={item.name} aria-label={item.name} aria-pressed={active === i} onClick={() => seek((i + 0.3) / 5)} style={{ '--swatch': item.color } as CSSProperties}><span />{String(i + 1).padStart(2, '0')}</button>)}</nav>
        </div>
      </div>
    </div><ProgressRail progress={progress} />
  </section>;
}
