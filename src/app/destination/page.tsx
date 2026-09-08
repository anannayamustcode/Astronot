"use client";

import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useCallback, useRef, useState } from "react";

// Central core flash effect for massive impact
function CoreFlash({ origin, color }: { origin: [number, number, number]; color: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  const life = 0.25;

  useFrame((_, delta) => {
    if (!mesh.current) return;
    timeRef.current += delta;
    const t = timeRef.current;
    if (t > life) {
      mesh.current.visible = false;
      return;
    }
    const progress = t / life;
    const scale = progress * 3.5;
    const opacity = 1 - progress;
    mesh.current.position.set(...origin);
    mesh.current.scale.setScalar(scale);
    if (mesh.current.material && !Array.isArray(mesh.current.material)) {
      (mesh.current.material as THREE.MeshBasicMaterial).opacity = opacity;
    }
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={1} toneMapped={false} />
    </mesh>
  );
}

// A single high-velocity firework particle
function Particle({
  origin,
  color,
  speed,
  sizeScale = 1.0,
}: {
  origin: [number, number, number];
  color: string;
  speed: number;
  sizeScale?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const velocity = useRef(
    new THREE.Vector3(
      (Math.random() - 0.5),
      (Math.random() - 0.5),
      (Math.random() - 0.5)
    ).normalize().multiplyScalar(speed)
  );
  const timeRef = useRef(0);
  const life = 1.6 + Math.random() * 0.8;

  useFrame((_, delta) => {
    if (!mesh.current) return;
    timeRef.current += delta;

    const t = timeRef.current;
    const fade = Math.max(0, 1 - t / life);

    // Position calculation with slight gravity drag
    const pos = new THREE.Vector3(...origin)
      .addScaledVector(velocity.current, t)
      .add(new THREE.Vector3(0, -1.8 * t * t, 0)); // gentle gravity drop

    mesh.current.position.copy(pos);
    if (mesh.current.material && !Array.isArray(mesh.current.material)) {
      (mesh.current.material as THREE.MeshBasicMaterial).opacity = fade;
    }
    mesh.current.scale.setScalar(fade * sizeScale * 1.5);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={1}
        toneMapped={false}
      />
    </mesh>
  );
}

function Firework({ position }: { position: [number, number, number] }) {
  const particleCount = 180;
  const hue = Math.random() * 360;
  const primaryColor = `hsl(${hue}, 100%, 75%)`;
  const sparkColor = `hsl(${(hue + 40) % 360}, 100%, 85%)`;

  return (
    <>
      <CoreFlash origin={position} color={primaryColor} />
      {Array.from({ length: particleCount }).map((_, i) => {
        // Multi-ring velocity distribution for massive spherical burst
        const speed = i < 40 
          ? 4 + Math.random() * 6        // Inner sparkle ring
          : 12 + Math.random() * 14;     // Giant outer explosion ring
        const isSpark = i % 3 === 0;
        return (
          <Particle
            key={i}
            origin={position}
            color={isSpark ? sparkColor : primaryColor}
            speed={speed}
            sizeScale={isSpark ? 0.7 : 1.2}
          />
        );
      })}
    </>
  );
}

function Scene({
  onFire,
}: {
  onFire: (pos: [number, number, number]) => void;
}) {
  const handlePointerDown = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      if (event.point) {
        onFire([event.point.x, event.point.y, event.point.z]);
      }
    },
    [onFire]
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <Stars radius={100} depth={50} count={4000} factor={4} fade />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      <mesh onPointerDown={handlePointerDown} position={[0, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

export default function DestinationPage() {
  const [explosions, setExplosions] = useState<
    { pos: [number, number, number]; id: number }[]
  >([]);
  const idRef = useRef(0);

  const handleFire = (pos: [number, number, number]) => {
    const id = idRef.current++;
    setExplosions((prev) => [...prev.slice(-12), { pos, id }]);
  };

  return (
    <main className="min-h-screen w-screen bg-black overflow-hidden font-sans relative touch-none select-none">
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 75 }}>
          <Scene onFire={handleFire} />
          {explosions.map(({ pos, id }) => (
            <Firework key={id} position={pos} />
          ))}
        </Canvas>
      </div>

      <div className="relative z-10 px-6 sm:px-16 py-16 max-w-4xl mx-auto text-white text-center space-y-6 pointer-events-none">
        <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Cosmic Fireworks
        </h1>
        <p className="text-sm text-gray-600">
          - anannaya
        </p>
      </div>
    </main>
  );
}
