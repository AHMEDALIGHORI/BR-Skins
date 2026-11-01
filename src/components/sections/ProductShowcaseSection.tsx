'use client';
import { useRef, CSSProperties } from 'react';
import { PRODUCTS } from '@/lib/products';
import { Product } from '@/types';
import { useScene } from '@/lib/scene';
import { Chapter, MagneticButton, ProgressRail } from '@/components/ui/SceneUI';
import ScrollVideo from '@/components/ui/ScrollVideo';
import dynamic from 'next/dynamic';
const SceneCanvas = dynamic(() => import('@/components/canvas/SceneCanvas'), { ssr: false });
const Carousel = dynamic(() => import('@/components/canvas/SceneObjects').then(m => m.Carousel), { ssr: false });
export default function ProductShowcaseSection({ onAddToCart }: { onAddToCart: (product: Product) => void }) {
  const ref = useRef<HTMLElement>(null);
  const { progress, seek } = useScene(ref, 600);
  const active = Math.min(4, Math.round(progress * 4));
  const product = PRODUCTS[active];
  return <section ref={ref} id="section-showcase" className="cinema-scene showcase-scene" data-product={product.id}>
    <div className="scene-inner">
      <Chapter number="05">Find your daily ritual</Chapter>
      <div className="showcase-layout">
        <div className="showcase-visual">
          <div className="carousel-stage"><SceneCanvas effects fallback="/assets/complete-collection.jpg"><Carousel progress={progress} /></SceneCanvas></div>
          <nav className="product-swatches" aria-label="Choose a product">{PRODUCTS.map((item, i) => <button key={item.id} onClick={() => seek(i / 4)} aria-label={item.name} aria-pressed={active === i} title={item.colorName} style={{ '--swatch': item.hex } as CSSProperties}><span /></button>)}</nav>
          <figure className="collection-film"><ScrollVideo src="/assets/bottles-carousel.mp4" progress={progress} /><figcaption>The collection in motion</figcaption></figure>
        </div>
        <div className="product-copy" data-lenis-prevent tabIndex={0} aria-label="Product details">
          <span className="eyebrow">{String(active + 1).padStart(2, '0')} / {product.colorName}</span>
          <h2 key={product.id} className="product-name">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <ul className="product-benefits">{product.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul>
          <details className="product-ingredients" key={`${product.id}-ingredients`}><summary>Ingredients & packaging <span>+</span></summary><p>{product.keyActives.join(' · ')}</p><p>{product.finish}</p></details>
          <div className="purchase-row"><div><strong>{product.price}</strong><small>{product.volume}</small></div><MagneticButton onClick={() => onAddToCart(product)}>Add to ritual <span>↗</span></MagneticButton></div>
        </div>
      </div><ProgressRail progress={progress} />
    </div>
  </section>;
}
