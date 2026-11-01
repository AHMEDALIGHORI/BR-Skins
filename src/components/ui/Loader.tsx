'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
export default function Loader({ onComplete }: { onComplete: () => void }) {
  const callback = useRef(onComplete); callback.current = onComplete;
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    let cancelled = false, finished = 0;
    const controller = new AbortController();
    const complete = () => { if (!cancelled) { setDone(true); callback.current(); } };
    const image = document.querySelector<HTMLImageElement>('#section-hero img');
    const video = document.querySelector<HTMLVideoElement>('#section-hero video');
    const videoReady = new Promise<void>((resolve, reject) => {
      if (!video || video.readyState >= 2) return resolve();
      video.addEventListener('loadeddata', () => resolve(), { once: true, signal: controller.signal });
      video.addEventListener('error', () => reject(new Error('Video unavailable')), { once: true, signal: controller.signal });
    });
    const jobs = [image?.decode() ?? Promise.resolve(), document.fonts.ready, videoReady];
    Promise.allSettled(jobs.map(job => Promise.resolve(job).finally(() => {
      finished++; if (!cancelled) setProgress(Math.round(finished / jobs.length * 100));
    }))).then(complete);
    const timer = window.setTimeout(() => { if (!cancelled) setSlow(true); }, 12000);
    return () => { cancelled = true; controller.abort(); clearTimeout(timer); };
  }, []);
  return <AnimatePresence>{!done && <motion.div className="brand-loader" exit={{ opacity: 0 }} transition={{ duration: 0.8 }} role="status" aria-label="Loading BR-Skins">
    <div className="loader-dust" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ left: `${(i * 31) % 100}%`, top: `${(i * 23) % 100}%`, animationDelay: `${i * -0.4}s` }} />)}</div>
    <svg width="260" height="70" viewBox="0 0 260 70" aria-label="BR-Skins"><motion.text x="130" y="47" textAnchor="middle" fontFamily="Georgia" fontSize="38" letterSpacing="6" fill="none" stroke="#29231d" strokeWidth="0.6" initial={{ strokeDasharray: 500, strokeDashoffset: 500 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1.8 }}>BR-SKINS</motion.text></svg>
    <p>The art of the everyday</p><div className="loader-track"><span style={{ width: `${progress}%` }} /></div><small>{progress}%</small>
    {slow && <button onClick={() => { setDone(true); callback.current(); }}>Enter while the film loads →</button>}
  </motion.div>}</AnimatePresence>;
}
