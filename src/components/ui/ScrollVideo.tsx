'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollVideo({ src, progress, className = '', eager = false, poster, onFrame }: {
  src: string; progress: number; className?: string; eager?: boolean; poster?: string; onFrame?: (progress: number) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const desired = useRef(progress);
  const frameCallback = useRef(onFrame); frameCallback.current = onFrame;
  const requestSeek = useRef<() => void>(() => {});
  const [near, setNear] = useState(eager);
  useEffect(() => {
    const el = ref.current;
    if (!el || eager) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { setNear(true); observer.disconnect(); }
    }, { rootMargin: '100% 0px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [eager]);
  useEffect(() => {
    const video = ref.current;
    if (!video || !near) return;
    let frame = 0;
    const schedule = () => {
      if (frame || video.seeking || !Number.isFinite(video.duration)) return;
      const target = desired.current * Math.max(0, video.duration - 0.04);
      if (Math.abs(target - video.currentTime) < 0.025) return;
      frame = requestAnimationFrame(() => { frame = 0; video.currentTime = target; });
    };
    requestSeek.current = schedule;
    const decoded = () => { if (video.duration) frameCallback.current?.(video.currentTime / video.duration); schedule(); };
    video.addEventListener('loadedmetadata', schedule);
    video.addEventListener('seeked', decoded);
    schedule();
    return () => {
      cancelAnimationFrame(frame); requestSeek.current = () => {};
      video.removeEventListener('loadedmetadata', schedule); video.removeEventListener('seeked', decoded);
    };
  }, [near]);
  useEffect(() => { desired.current = progress; requestSeek.current(); }, [progress]);
  return <video ref={ref} data-scene-video src={near ? src : undefined} data-src={src}
    poster={poster} preload={near ? 'auto' : 'none'} muted playsInline aria-hidden="true"
    className={`scroll-video ${className}`} />;
}
