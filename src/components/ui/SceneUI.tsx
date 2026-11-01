'use client';

import { ComponentPropsWithoutRef, ReactNode, useRef } from 'react';
import gsap from 'gsap';

export function Chapter({ number, children }: { number: string; children: ReactNode }) {
  return <p className="chapter"><span>{number}</span><span className="chapter-rule" />{children}</p>;
}

export function SceneTitle({ children, className = '' }: { children: string; className?: string }) {
  return <h2 className={`scene-title ${className}`} aria-label={children}>
    {children.split(' ').map((word, i) => <span key={i} className="word-mask" aria-hidden="true">
      {Array.from(word).map((char, j) => <span key={j} className="scene-char">{char}</span>)}{'\u00a0'}
    </span>)}
  </h2>;
}

export function MagneticButton({ children, className = '', ...props }: ComponentPropsWithoutRef<'button'>) {
  const ref = useRef<HTMLButtonElement>(null);
  return <button {...props} ref={ref} className={`ritual-button ${className}`}
    onPointerMove={e => {
      if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const r = e.currentTarget.getBoundingClientRect();
      gsap.to(ref.current, { x: (e.clientX - r.left - r.width / 2) * 0.13, y: (e.clientY - r.top - r.height / 2) * 0.2, duration: 0.3, overwrite: true });
    }}
    onPointerLeave={() => gsap.to(ref.current, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,0.5)', overwrite: true })}
  >{children}</button>;
}

export function ProgressRail({ progress }: { progress: number }) {
  return <div className="scene-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>;
}
