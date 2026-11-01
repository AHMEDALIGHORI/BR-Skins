'use client';

import { RefObject, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
export const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
export const phase = (p: number, from: number, to: number) => clamp((p - from) / (to - from));

/** A single scrubbed clock drives the video, WebGL and DOM of each chapter. */
export function useScene(ref: RefObject<HTMLElement>, span: number) {
  const [progress, setProgress] = useState(0);
  const trigger = useRef<ScrollTrigger>();
  useLayoutEffect(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock = { p: 0 };
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current, start: 'top top', end: () => `+=${window.innerHeight * (span / 100 - 1)}`,
          pin: true, scrub: reduced ? true : 0.65, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });
      timeline.to(clock, { p: 1, duration: 1, ease: 'none', onUpdate: () => {
        setProgress(clock.p);
        if (ref.current) ref.current.dataset.progress = clock.p.toFixed(5);
        ref.current?.style.setProperty('--scene-exit', String(phase(clock.p, 0.94, 1) * 0.72));
      } }, 0);
      if (!reduced) {
        timeline.fromTo('[data-reveal]', { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.025, duration: 0.16 }, 0);
        timeline.fromTo('.scene-char', { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.0015, duration: 0.12, ease: 'power2.out' }, 0);
      }
      trigger.current = timeline.scrollTrigger;
    }, ref);
    return () => { ctx.revert(); trigger.current = undefined; };
  }, [ref, span]);

  const seek = (p: number) => {
    const t = trigger.current;
    if (!t) return;
    window.dispatchEvent(new CustomEvent('br:scroll-to', { detail: t.start + clamp(p) * (t.end - t.start) }));
  };
  return { progress, seek };
}
