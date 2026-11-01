'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import Bottle from './Bottle';
import { PRODUCTS } from '@/lib/products';
import { phase } from '@/lib/scene';
import { anatomyAt } from '@/lib/anatomyTracking';

export function Dust({ progress, count = 60 }: { progress: number; count?: number }) {
  const group = useRef<Group>(null);
  useFrame(({ pointer }) => { if (group.current) group.current.position.set(pointer.x * 0.1, pointer.y * 0.1, 0); });
  const positions = useMemo(() => Float32Array.from({ length: count * 3 }, (_, i) => Math.sin(i * 137.508) * (i % 3 === 2 ? 2 : 5)), [count]);
  return <group ref={group}><points rotation={[progress * 0.1, progress * 0.8, 0]}>
    <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
    <pointsMaterial size={0.025} color="#c3a866" transparent opacity={0.35} depthWrite={false} />
  </points></group>;
}

export function OrbitBottle({ progress, color = '#FFD54A', morph = 1 }: { progress: number; color?: string; morph?: number }) {
  const group = useRef<Group>(null);
  useFrame(({ pointer }) => {
    if (!group.current) return;
    group.current.rotation.set(pointer.y * -0.08, progress * Math.PI * 2 + pointer.x * 0.18, Math.sin(progress * Math.PI) * 0.025);
  });
  return <group ref={group} position={[0, -0.3, 0]} scale={0.95}><Bottle color={color} morph={morph} /></group>;
}

export function Carousel({ progress }: { progress: number }) {
  const turn = progress * 4;
  const target = new Vector3();
  useFrame(({ camera, pointer }) => {
    target.set(pointer.x * 0.13, 0.35 + Math.sin(progress * Math.PI) * 0.12, 8 + Math.sin(progress * Math.PI) * 0.3);
    camera.position.copy(target); camera.lookAt(0, 0.15, 0);
  });
  return <>
    {PRODUCTS.map((product, i) => {
      const angle = (i - turn) * Math.PI * 2 / 5;
      const focus = Math.max(0, Math.cos(angle));
      return <group key={product.id} position={[Math.sin(angle) * 2.55, -0.35, (Math.cos(angle) - 1) * 2.8]}
        scale={0.7 + focus * 0.25} rotation={[0, Math.sin(angle) * -0.35, Math.sin(angle) * -0.07]}>
        <Bottle color={product.hex} name={['VITAMIN C', 'HYDRA BOOST', 'NIGHT REPAIR', 'GENTLE CLEANSE', 'SPF 50+'][i]} finish={i === 3 ? 'matte' : i === 4 ? 'satin' : 'glass'} />
      </group>;
    })}
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.65, -1]}><planeGeometry args={[20, 20]} /><shadowMaterial transparent opacity={0.09} /></mesh>
  </>;
}

export function ExplodedAssembly({ progress }: { progress: number }) {
  const { size, camera } = useThree();
  const frame = anatomyAt(progress);
  const cover = window.matchMedia('(max-width: 767px)').matches;
  const scale = (cover ? Math.max : Math.min)(size.width / 480, size.height / 270);
  const left = (size.width - 480 * scale) / 2, top = (size.height - 270 * scale) / 2;
  const project = (x: number, y: number) => {
    const point = new Vector3((left + x * scale) / size.width * 2 - 1, 1 - (top + y * scale) / size.height * 2, 0.5).unproject(camera);
    const ray = point.sub(camera.position).normalize();
    return camera.position.clone().add(ray.multiplyScalar(-camera.position.z / ray.z));
  };
  const parts = [
    { title: 'Rose Gold Cap', x: frame[0], y: frame[1], side: 1, w: 39, h: 22 },
    { title: 'Precision Dropper', x: frame[2], y: frame[3], side: -1, w: 20, h: 28 },
    { title: 'Premium Glass', x: frame[4], y: frame[5], side: -1, w: 48, h: 58 },
    { title: 'Vitamin C', x: frame[6], y: frame[7], side: 1, w: 34, h: 27 },
    { title: 'Scientific Formula', x: (frame[8]+frame[10])/2, y: (frame[9]+frame[11])/2, side: -1, w: 3, h: 35 },
  ];
  return <group>{parts.map((part, i) => {
    const anchor = project(part.x + (i===4 ? 0 : part.side*part.w/2), part.y);
    const center = project(part.x, part.y);
    const extent = project(part.x + part.w, part.y + part.h).sub(center);
    const labelX = Math.max(48, Math.min(size.width-48, left+part.x*scale+part.side*Math.max(100,part.w*scale)));
    const end = project((labelX-left)/scale, part.y);
    const reveal = phase(progress, i*0.035, 0.08+i*0.035);
    const tip = anchor.clone().lerp(end,reveal);
    return <group key={part.title} visible={reveal>0.01}>
      {i!==4 && <mesh position={center}><cylinderGeometry args={[Math.abs(extent.x)/2,Math.abs(extent.x)/2,Math.abs(extent.y),20,1,true]} /><meshBasicMaterial color="#b39b77" wireframe transparent opacity={0.055*reveal} depthWrite={false} /></mesh>}
      {i===4 && <Line points={[project(frame[8],frame[9]),project(frame[10],frame[11])]} lineWidth={2} color="#cab99e" transparent opacity={0.2} />}
      <Line points={[anchor,tip]} color="#8d8173" lineWidth={0.7} transparent opacity={reveal*0.75}/>
      <mesh position={anchor}><sphereGeometry args={[0.016,8,8]}/><meshBasicMaterial color="#b3987a"/></mesh>
      <Html position={end} center style={{opacity:reveal,pointerEvents:'none'}}><span className="anatomy-label">{part.title}</span></Html>
    </group>;
  })}</group>;
}

export function IngredientMolecules({ progress }: { progress: number }) {
  const group = useRef<Group>(null);
  useFrame(({ pointer }) => {
    if (group.current) group.current.rotation.set(pointer.y * 0.08, progress * 0.5 + pointer.x * 0.14, 0);
  });
  const colors = ['#FFD54A', '#4DA6FF', '#FF4FA3', '#C9A6FF', '#fafaf8'];
  return <group ref={group}>
    {colors.map((color, i) => {
      const angle = i * Math.PI * 2 / 5 + progress * 0.55;
      const x = Math.cos(angle) * 1.7, y = Math.sin(angle) * 1.55;
      return <group key={color} position={[x, y, -i * 0.12]}>
        <mesh><sphereGeometry args={[i === 1 ? 0.46 : 0.32, 24, 24]} /><meshPhysicalMaterial color={color} transmission={0.6} thickness={0.5} roughness={0.1} clearcoat={1} /></mesh>
        {[0, 1, 2].map(j => {
          const endpoint: [number, number, number] = [Math.cos(j * 2.1) * 0.65, Math.sin(j * 2.1) * 0.65, 0.15];
          return <group key={j}><Line points={[[0, 0, 0], endpoint]} lineWidth={1} color="#aaa49b" />
            <mesh position={endpoint}><sphereGeometry args={[0.08, 12, 12]} /><meshStandardMaterial color="#e4e5e8" metalness={0.8} roughness={0.2} /></mesh></group>;
        })}
      </group>;
    })}
    <Dust progress={progress} count={45} />
  </group>;
}
