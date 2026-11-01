'use client';

import { memo, useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace, Vector2 } from 'three';

function Bottle({ color = '#FFD54A', name = 'VITAMIN C', finish = 'glass', explosion = 0, morph = 1, overlay = false }: {
  color?: string; name?: string; finish?: 'glass' | 'matte' | 'satin'; explosion?: number; morph?: number; overlay?: boolean;
}) {
  const label = useMemo(() => {
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#27221d'; ctx.textAlign = 'center';
    ctx.font = '54px Georgia'; ctx.fillText('BR-Skins', 256, 200);
    ctx.font = '18px sans-serif'; ctx.fillText(name, 256, 270);
    ctx.font = '13px sans-serif'; ctx.fillText('THE DAILY RITUAL', 256, 308); ctx.fillText('30 ml / 1.0 fl. oz.', 256, 420);
    const texture = new CanvasTexture(canvas); texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [name]);
  useEffect(() => () => label.dispose(), [label]);
  const profile = useMemo(() => [
    [0, -1.2], [0.48, -1.2], [0.58, -1.18], [0.63, -1.1], [0.64, -0.98],
    [0.64, 0.65], [0.62, 0.83], [0.55, 0.95], [0.34, 1.04], [0.3, 1.1], [0.3, 1.22],
  ].map(([x, y]) => new Vector2(x * morph + Math.sin((y + 1.2) / 2.42 * Math.PI) * 0.9 * (1 - morph), y * (0.55 + morph * 0.45))), [morph]);
  // Fixed topology: the liquid core continuously changes profile instead of
  // switching from a sphere to a cylinder at the end of the transition.
  const coreProfile = useMemo(() => Array.from({ length: 35 }, (_, i) => {
    const t = i / 34;
    const radius = i === 0 || i === 34 ? 0 : 0.54 * morph + Math.sin(t * Math.PI) * 0.8 * (1 - morph);
    return new Vector2(radius, (t - 0.5) * (1.2 + morph * 0.55));
  }), [morph]);
  return <group scale={[1 + (1 - morph) * 1.2, 0.35 + morph * 0.65, 1 + (1 - morph) * 0.7]}>
    <mesh castShadow receiveShadow position={[0, -explosion * 1.4, 0]}>
      <latheGeometry args={[profile, 48]} />
      <meshPhysicalMaterial color={finish === 'glass' ? '#fff9e8' : color} roughness={finish === 'matte' ? 0.7 : 0.25}
        metalness={finish === 'satin' ? 0.15 : 0} transmission={overlay ? 0 : finish === 'glass' ? 0.72 : 0} thickness={0.3} ior={1.46} clearcoat={0.8}
        wireframe={overlay} transparent={overlay} opacity={overlay ? 0.07 : 1} depthWrite={!overlay} />
    </mesh>
    <mesh position={[0, -0.19 + explosion * 0.55, 0]} castShadow>
      <latheGeometry args={[coreProfile, 40]} />
      <meshPhysicalMaterial color={color} roughness={0.24} metalness={0.02} clearcoat={1} wireframe={overlay} transparent={overlay} opacity={overlay ? 0.08 : 1} depthWrite={!overlay} />
    </mesh>
    <group position={[0, 1.5 + explosion * 2, 0]} scale={Math.max(0.001, morph)}>
      <mesh castShadow><cylinderGeometry args={[0.36, 0.36, 0.55, 48]} /><meshStandardMaterial color="#E8ECF2" metalness={0.98} roughness={0.19} wireframe={overlay} transparent={overlay} opacity={overlay ? 0.13 : 1} /></mesh>
      <mesh position={[0, 0.48 + explosion * 0.3, 0]} scale={[0.75, 1.35, 0.75]}><sphereGeometry args={[0.29, 24, 20]} /><meshStandardMaterial color="#fafaf8" roughness={0.65} wireframe={overlay} transparent={overlay} opacity={overlay ? 0.12 : 1} /></mesh>
    </group>
    <mesh position={[0, 0.55 + explosion * 1.3, explosion * 0.5]}>
      <cylinderGeometry args={[0.045, 0.035, 2.2, 16]} />
      <meshPhysicalMaterial color="#fff" transmission={overlay ? 0 : 0.85} thickness={0.15} roughness={0.08} wireframe={overlay} transparent opacity={overlay ? 0.12 : morph} />
    </mesh>
    <mesh position={[0, -0.15 - explosion * 1.4, 0.645 + explosion * 0.45]}>
      <planeGeometry args={[1.06, 1.06]} />
      <meshBasicMaterial map={label} transparent opacity={overlay ? 0 : morph} depthWrite={false} toneMapped={false} />
    </mesh>
  </group>;
}

export default memo(Bottle);
