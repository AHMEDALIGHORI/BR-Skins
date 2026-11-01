'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({ duration: reduced ? 0 : 1.05, smoothWheel: !reduced, touchMultiplier: 1 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    const move = (target: string | number) => {
      let destination: number | HTMLElement | null;
      if (typeof target === 'string') {
        const element = document.querySelector<HTMLElement>(target);
        const trigger = ScrollTrigger.getAll().find(t => t.trigger === element);
        destination = trigger ? trigger.start + 1 : element;
      } else destination = target;
      if (destination !== null) lenis.scrollTo(destination, { duration: reduced ? 0 : 0.9, immediate: reduced });
    };
    const navigate = (e: Event) => move((e as CustomEvent<string | number>).detail);
    const link = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const anchor = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#section-"]');
      if (!anchor) return;
      e.preventDefault(); move(anchor.hash); history.replaceState(null, '', anchor.hash);
    };
    window.addEventListener('br:scroll-to', navigate); document.addEventListener('click', link);
    const refresh = () => ScrollTrigger.refresh();
    const timer = setTimeout(refresh, 500);
    document.fonts.ready.then(refresh);
    return () => { clearTimeout(timer); window.removeEventListener('br:scroll-to', navigate); document.removeEventListener('click', link); gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);
  return <>{children}</>;
}
