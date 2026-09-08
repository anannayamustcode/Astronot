"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sparkles, Stars } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

export default function Home() {
  const [spin, setSpin] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter();
  const [isChestOpen, setIsChestOpen] = useState(false);
  
  return (
    <main className="h-screen w-screen bg-black relative overflow-hidden">
      {/* Flash transition effect */}
      {transitioning && (
        <div className="absolute inset-0 bg-white opacity-90 z-20 animate-fade-out" />
      )}

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={1000} factor={4} fade />

        <Suspense fallback={null}>
          <TimeMachine
            spin={spin}
            onClick={() => {
              setSpin(true);
              setTimeout(() => {
                setTransitioning(true);
                setTimeout(() => {
                  router.push('/fire');
                }, 1000);
              }, 2000);
            }}
          />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* Responsive Box/Chest Container */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-9 z-30 cursor-pointer transform scale-75 sm:scale-100 origin-bottom-right">
        <div
          className={`chest-container ${isChestOpen ? "open" : ""}`}
          onClick={() => setIsChestOpen(!isChestOpen)}
        >
          <div className="chest-lid transition-transform duration-700 origin-bottom group-open:rotate-[-60deg]" />
          <div className="chest-base" />
          {isChestOpen && (
            <>
              <div className="golden-dust" />
              <div className="absolute top-[-85%] left-1/2 transform -translate-x-1/2 space-y-2 text-center z-10">
                <p
                  className="text-white font-bold text-x floating-text cursor-pointer"
                  onClick={() => router.push("/fire")}
                >
                  Bonfire
                </p>
                <p
                  className="text-white font-bold text-x floating-text cursor-pointer"
                  onClick={() => router.push("/destination")}
                >
                  Fireworks
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function TimeMachine({ spin, onClick }: { spin: boolean; onClick: () => void }) {
  const coreRef = useRef<THREE.Mesh>(null!);
  const outerRingRef = useRef<THREE.Mesh>(null!);
  const middleRingRef = useRef<THREE.Mesh>(null!);
  const speed = useRef(0.01);
  const time = useRef(0);
  const { size } = useThree();

  // Scale down on smaller phone dimensions (< 640px)
  const isMobile = size.width < 640;
  const machineScale = isMobile ? 0.75 : 1.2;

  useFrame(() => {
    if (!coreRef.current || !outerRingRef.current || !middleRingRef.current) return;

    time.current += 0.01;
    const float = Math.sin(time.current) * 0.2;

    if (spin && speed.current < 0.5) speed.current += 0.01;

    // Floating motion
    coreRef.current.position.y = float;
    outerRingRef.current.position.y = float;
    middleRingRef.current.position.y = float;

    // Spin
    coreRef.current.rotation.y += speed.current / 2;
    outerRingRef.current.rotation.x += speed.current;
    middleRingRef.current.rotation.z += speed.current * 0.7;

    // Shimmering glitter animation on outer ring
    if (outerRingRef.current.material && !Array.isArray(outerRingRef.current.material)) {
      const mat = outerRingRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 1.2 + Math.sin(time.current * 8) * 0.8;
    }
  });

  return (
    <group onClick={onClick} scale={machineScale}>
      {/* Glowing Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial emissive="cyan" color="black" emissiveIntensity={3} />
      </mesh>

      {/* Middle Ring */}
      <mesh ref={middleRingRef}>
        <torusGeometry args={[0.8, 0.05, 16, 100]} />
        <meshStandardMaterial color="aqua" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Glittery Outer Ring */}
      <group>
        <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.07, 16, 100]} />
          <meshStandardMaterial
            color="#ffe57f"
            emissive="#ffb300"
            emissiveIntensity={1.5}
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
        {/* Glitter Sparkles around the outer ring */}
        <Sparkles
          count={90}
          scale={2.8}
          size={3.5}
          speed={0.6}
          color="#ffd700"
          opacity={0.95}
        />
      </group>
    </group>
  );
}
