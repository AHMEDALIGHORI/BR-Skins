'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { InstancedMesh, Object3D } from 'three';
import { phase } from '@/lib/scene';

const COUNT = 96, STEPS = 150, DT = 1 / 60;

/** Fixed-step spring/cohesion simulation, cached for exact reverse scrubbing. */
function simulate() {
  const position = new Float32Array(COUNT * 3), velocity = new Float32Array(COUNT * 3);
  const target = new Float32Array(COUNT * 3), frames: Float32Array[] = [];
  for (let i = 0; i < COUNT; i++) {
    const angle = i * 2.399963;
    const radius = 1.25 + Math.sin(i * 1.7) * 0.55;
    position.set([Math.cos(angle) * radius, Math.sin(angle * 0.7) * 1.2, Math.sin(angle) * radius * 0.6], i * 3);
    velocity.set([-Math.sin(angle) * 0.8, Math.cos(angle) * 0.4, Math.cos(angle) * 0.8], i * 3);
    const r = Math.sqrt((i + 0.5) / COUNT) * 0.48;
    target.set([Math.cos(angle) * r, ((i * 37 % COUNT) / COUNT - 0.5) * 1.6 - 0.2, Math.sin(angle) * r], i * 3);
  }
  for (let step = 0; step <= STEPS; step++) {
    frames.push(position.slice());
    const gather = phase(step / STEPS, 0.1, 0.8);
    const force = new Float32Array(COUNT * 3);
    // Short-range pressure keeps droplets from collapsing into one point.
    for (let i = 0; i < COUNT; i++) for (let j = i + 1; j < COUNT; j++) {
      const a = i * 3, b = j * 3;
      const dx = position[a] - position[b], dy = position[a+1] - position[b+1], dz = position[a+2] - position[b+2];
      const d2 = dx*dx + dy*dy + dz*dz;
      if (d2 > 0.0324 || d2 < 0.000001) continue;
      const pressure = (0.18 - Math.sqrt(d2)) * 8;
      for (let k = 0; k < 3; k++) {
        const f = (position[a+k] - position[b+k]) / Math.sqrt(d2) * pressure;
        force[a+k] += f; force[b+k] -= f;
      }
    }
    for (let i = 0; i < COUNT * 3; i++) {
      const attraction = (target[i] - position[i]) * (1 + gather * 13);
      const gravity = i % 3 === 1 ? -0.12 * (1 - gather) : 0;
      velocity[i] += (force[i] + attraction + gravity - velocity[i] * (1.8 + gather * 4)) * DT;
      position[i] += velocity[i] * DT;
    }
  }
  return frames;
}

export default function FluidDroplets({ progress }: { progress: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const frames = useMemo(simulate, []);
  const dummy = useMemo(() => new Object3D(), []);
  const { invalidate } = useThree();
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const time = Math.max(0, Math.min(1, progress)) * STEPS;
    const a = Math.floor(time), b = Math.min(STEPS, a + 1), t = time - a;
    for (let i = 0; i < COUNT; i++) {
      const index = i * 3;
      dummy.position.set(...[0,1,2].map(k => frames[a][index+k] + (frames[b][index+k] - frames[a][index+k]) * t) as [number,number,number]);
      const radius = (0.035 + (i % 5) * 0.009) * (1 - phase(progress, 0.65, 1));
      dummy.scale.set(radius, radius * 1.2, radius); dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true; invalidate();
  }, [progress, frames, dummy, invalidate]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} frustumCulled={false}>
    <sphereGeometry args={[1, 12, 8]} /><meshPhysicalMaterial color="#4DA6FF" roughness={0.12} clearcoat={1} transmission={0.4} thickness={0.1} />
  </instancedMesh>;
}
