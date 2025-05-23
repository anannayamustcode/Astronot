"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // Import the router

export default function Home() {
  const [spin, setSpin] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter(); // Initialize the router
  const [isChestOpen, setIsChestOpen] = useState(false);
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
              // After short delay, start transition
              setTimeout(() => {
                setTransitioning(true);
                // Navigate to new page after animation completes
                setTimeout(() => {
                  router.push('/destination');
                }, 1000); // Adjust timing to match your fade-out animation
              }, 2000);
            }}
          />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <div className="absolute bottom-6 right-9 z-30 cursor-pointer">
  <div
    className={`chest-container ${isChestOpen ? "open" : ""}`}
    onClick={() => setIsChestOpen(!isChestOpen)}
  >
    <div className="chest-lid transition-transform duration-700 origin-bottom group-open:rotate-[-60deg]" />
    <div className="chest-base" />
    {isChestOpen && (
  <>
    {/* Glow behind menu */}
    <div className="golden-dust" />
    <div className="absolute top-[-140%] left-1/2 transform -translate-x-1/2 space-y-2 text-center z-10">

      <p
        className="text-white font-bold text-x floating-text cursor-pointer"
        onClick={() => router.push("/fire")}
      >
        Bonfire
      </p>
      <p
        className="text-white font-bold text-x floating-text cursor-pointer"
        onClick={() => router.push("/stargazing")}
      >
      Memory wall
      </p>
      <p
        className="text-white font-bold text-x floating-text cursor-pointer"
        onClick={() => router.push("/destination")}
      >
        Fireworks
      </p>
      {/* <p
        className="text-white font-bold text-x floating-text cursor-pointer"
        onClick={() => router.push("/deadpoetssociety")}
      >
        DeadPoetsSociety
      </p> */}

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
  });

  return (
    <group onClick={onClick} scale={1.2}>
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

      {/* Outer Ring */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.07, 16, 100]} />
        <meshStandardMaterial color="white" metalness={0.2} roughness={0.3} />
      </mesh>
    </group>
  );
}
