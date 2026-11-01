'use client';

import { Component, memo, ReactNode, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { ACESFilmicToneMapping, NoToneMapping, Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

class CanvasBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

const Studio = memo(function Studio({ rose }: { rose: boolean }) {
  return <>
    <ambientLight intensity={0.65} />
    <directionalLight position={[3, 6, 5]} intensity={2.4} color="#fff8eb" castShadow shadow-mapSize={[512, 512]} shadow-normalBias={0.03} shadow-radius={4} />
    <directionalLight position={[-4, 2, 2]} intensity={1.2} color={rose ? '#e7b7a8' : '#d8e9ff'} />
    <Environment frames={1} resolution={128}>
      <Lightformer position={[0, 5, -2]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 5, 1]} intensity={2} />
      <Lightformer position={[-4, 1, 3]} rotation={[0, Math.PI / 3, 0]} scale={[2, 7, 1]} intensity={3} />
      <Lightformer position={[4, 2, 2]} rotation={[0, -Math.PI / 3, 0]} scale={[2, 6, 1]} intensity={3} color={rose ? '#e7b7a8' : '#ffffff'} />
    </Environment>
  </>;
});

function PointerFrames() {
  const { gl, pointer, invalidate } = useThree();
  useEffect(() => {
    const section = gl.domElement.closest('section');
    if (!section) return;
    const move = (e: PointerEvent) => {
      const r = gl.domElement.getBoundingClientRect();
      pointer.set(Math.max(-1, Math.min(1, (e.clientX - r.left) / r.width * 2 - 1)), Math.max(-1, Math.min(1, -(e.clientY - r.top) / r.height * 2 + 1)));
      invalidate();
    };
    const leave = () => { pointer.set(0, 0); invalidate(); };
    section.addEventListener('pointermove', move); section.addEventListener('pointerleave', leave);
    return () => { section.removeEventListener('pointermove', move); section.removeEventListener('pointerleave', leave); };
  }, [gl, pointer, invalidate]);
  return null;
}

function Lens({ focus, onBudget }: { focus: number; onBudget: (ratio: number) => void }) {
  const { gl, scene, camera, size, invalidate } = useThree();
  const composer = useRef<EffectComposer>();
  const budget = useRef({ last: 0, slow: 0, average: 16.7, ratio: 0.75 });
  useEffect(() => {
    const pipeline = new EffectComposer(gl);
    const render = new RenderPass(scene, camera);
    const depth = new BokehPass(scene, camera, { focus, aperture: 0.0012, maxblur: 0.012 });
    const bloom = new UnrealBloomPass(new Vector2(size.width, size.height), 0.12, 0.35, 1.05);
    const output = new OutputPass();
    pipeline.addPass(render); pipeline.addPass(depth); pipeline.addPass(bloom); pipeline.addPass(output);
    pipeline.setPixelRatio(Math.min(gl.getPixelRatio(), budget.current.ratio));
    pipeline.setSize(size.width, size.height);
    composer.current = pipeline; invalidate();
    return () => {
      composer.current = undefined;
      render.dispose(); depth.dispose(); bloom.dispose(); output.dispose(); pipeline.dispose();
    };
  }, [gl, scene, camera, size.width, size.height, focus, invalidate]);
  useFrame((_, delta) => {
    const now = performance.now(), elapsed = now - budget.current.last;
    budget.current.last = now;
    if (elapsed < 100) {
      budget.current.average = budget.current.average * 0.85 + elapsed * 0.15;
      if (budget.current.average > 18.5) budget.current.slow++;
      else budget.current.slow = Math.max(0, budget.current.slow - 1);
    } else budget.current.slow = 0;
    if (budget.current.slow > 12 && budget.current.ratio > 0.55) {
      budget.current.ratio = Math.max(0.55, budget.current.ratio - 0.1);
      composer.current?.setPixelRatio(budget.current.ratio);
      onBudget(budget.current.ratio);
      budget.current.slow = 0;
    }
    gl.domElement.dataset.renderScale = String(budget.current.ratio);
    composer.current?.render(delta);
  }, 1);
  return null;
}

export default function SceneCanvas({ children, className = '', rose = false, effects = false, fallback = '/assets/hero-bottle.jpg' }: {
  children: ReactNode; className?: string; rose?: boolean; effects?: boolean; fallback?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [renderDpr, setRenderDpr] = useState(1);
  useEffect(() => {
    if (!host.current) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '120px' });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const placeholder = <img className="canvas-fallback" src={fallback} alt="BR-Skins product photograph" loading="lazy" />;
  return <div ref={host} className={`scene-canvas ${className}`}>
    {visible && <CanvasBoundary fallback={placeholder}>
      <Canvas frameloop="demand" dpr={renderDpr} shadows camera={{ position: [0, 0.3, 8], fov: 36 }}
        gl={{ alpha: !effects, antialias: true, powerPreference: 'high-performance', toneMapping: effects ? NoToneMapping : ACESFilmicToneMapping }} fallback={placeholder}>
        {effects && <color attach="background" args={['#FDF8F3']} />}
        <PointerFrames />
        <Suspense fallback={null}><Studio rose={rose} />{children}</Suspense>
        {effects && <Lens focus={8} onBudget={setRenderDpr} />}
      </Canvas>
    </CanvasBoundary>}
  </div>;
}
