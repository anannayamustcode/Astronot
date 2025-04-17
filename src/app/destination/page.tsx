"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useCallback, useEffect, useRef, useState } from "react";

// A single firework particle
function Particle({
  origin,
  delay,
  color,
}: {
  origin: [number, number, number];
  delay: number;
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const velocity = useRef(
    new THREE.Vector3(
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3
    )
  );
  const timeRef = useRef(0);
  const life = 2 + Math.random() * 0.5;

  useFrame((_, delta) => {
    if (!mesh.current) return;
    timeRef.current += delta;

    if (timeRef.current < delay) return;

    const t = timeRef.current - delay;
    const fade = Math.max(0, 1 - t / life);

    const pos = new THREE.Vector3(...origin).addScaledVector(
      velocity.current,
      t
    );
    mesh.current.position.copy(pos);
    mesh.current.material.opacity = fade;
    mesh.current.scale.setScalar(fade);
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  );
}

function Firework({ position }: { position: [number, number, number] }) {
  const particleCount = 80;
  const delay = 0.4 + Math.random() * 0.3;
  const color = `hsl(${Math.random() * 360}, 100%, 70%)`;

  return (
    <>
      {Array.from({ length: particleCount }).map((_, i) => (
        <Particle
          key={i}
          origin={position}
          delay={delay}
          color={color}
        />
      ))}
    </>
  );
}

function Scene({
  onFire,
}: {
  onFire: (pos: [number, number, number]) => void;
}) {
  const { camera, size } = useThree();

  const handleClick = useCallback(
    (event: THREE.Event) => {
      const mouse = new THREE.Vector2(
        (event.clientX / size.width) * 2 - 1,
        -(event.clientY / size.height) * 2 + 1
      );

      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
      onFire([vector.x, vector.y, vector.z]);
    },
    [camera, size, onFire]
  );

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1.2} />
      <Stars radius={100} depth={50} count={3000} factor={4} fade />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      <mesh onClick={handleClick} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
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
    setExplosions((prev) => [...prev, { pos, id }]);
  };

  return (
    <main className="min-h-screen w-screen bg-black overflow-hidden font-sans relative">
      <div className="fixed inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 7], fov: 75 }}>
          <Scene onFire={handleFire} />
          {explosions.map(({ pos, id }) => (
            <Firework key={id} position={pos} />
          ))}
        </Canvas>
      </div>

      <div className="relative z-10 px-6 sm:px-16 py-32 max-w-4xl mx-auto text-white text-center space-y-10">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Cosmic Fireworks
        </h1>

        <p className="text-sm text-white/40 pt-20">
          © 2025 Anannaya
        </p>
      </div>
    </main>
  );
}
