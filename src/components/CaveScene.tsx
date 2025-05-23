'use client';

import { useRef, useState, useEffect } from 'react';
import { Text, Float, Sparkles, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CaveScene({ poem, onBury, onReturn }: { 
  poem: string, 
  onBury: () => void,
  onReturn: () => void 
}) {
  const caveRef = useRef<THREE.Mesh>(null);
  const fireRef = useRef<THREE.PointLight>(null);
  const poemRef = useRef<THREE.Group>(null);
  const [showActions, setShowActions] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  useFrame(({ clock }) => {
    if (fireRef.current) {
      fireRef.current.intensity = 1.5 + Math.sin(clock.getElapsedTime() * 3) * 0.5;
    }
    if (poemRef.current) {
      poemRef.current.position.y = 1.5 + Math.sin(clock.getElapsedTime()) * 0.1;
    }
  });

  useEffect(() => {
    if (poem) {
      const timer = setTimeout(() => setShowActions(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [poem]);

  return (
    <group>
      {/* Cave Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={100} size={2} scale={10} speed={0.1} color="#ffaa33" />

      {/* Cave Structure */}
      <mesh ref={caveRef} position={[0, 0, -10]} rotation={[0, Math.PI, 0]}>
        <sphereGeometry args={[15, 64, 64, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
        <meshStandardMaterial 
          color="#3a2a1a" 
          side={THREE.BackSide} 
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Cave Wall Drawings - ancient poetry */}
      <mesh position={[-6, 0, -15]} rotation={[0, Math.PI / 4, 0]}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial 
          color="#4a3a2a"
          roughness={1}
          metalness={0}
          emissive="#5a4a3a"
          emissiveIntensity={0.2}
        />
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.1}
          color="#ca9e71"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.5}
        >
          Ancient symbols and drawings depicting stories of old
        </Text>
      </mesh>

      {/* Cave Floor */}
      <mesh position={[0, -5, -10]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[15, 64]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.8} />
      </mesh>

      {/* Campfire */}
      <group position={[0, -4, -8]}>
        <mesh>
          <cylinderGeometry args={[1, 1.2, 0.3, 16]} />
          <meshStandardMaterial color="#4d2b06" />
        </mesh>
        
        {/* Stones around fire */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh 
              key={i} 
              position={[
                Math.cos(angle) * 1.3, 
                -0.1, 
                Math.sin(angle) * 1.3
              ]}
              rotation={[Math.random() * 0.5, Math.random() * Math.PI, 0]}
            >
              <dodecahedronGeometry args={[0.2 + Math.random() * 0.1]} />
              <meshStandardMaterial color={`rgb(${100 + Math.random() * 50}, ${100 + Math.random() * 30}, ${100 + Math.random() * 20})`} />
            </mesh>
          );
        })}
        
        {/* Fire logs */}
        <mesh position={[0.3, 0.1, 0]} rotation={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
          <meshStandardMaterial color="#3a1a06" />
        </mesh>
        <mesh position={[-0.3, 0.1, -0.2]} rotation={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 1.2, 8]} />
          <meshStandardMaterial color="#3a1a06" />
        </mesh>
        
        {/* Fire particles */}
        <FireParticles position={[0, 0.3, 0]} />
        
        {/* Fire light */}
        <pointLight 
          ref={fireRef}
          position={[0, 0.5, 0]} 
          intensity={1.5} 
          color="#ff7b00" 
          distance={10} 
          decay={2} 
        />
      </group>

      {/* Poem Display */}
      {poem && (
        <group ref={poemRef} position={[0, 1.5, -6]}>
          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
            <mesh rotation={[-0.2, 0, 0]}>
              <planeGeometry args={[3, 2]} />
              <meshStandardMaterial color="#f5f5dc" side={THREE.DoubleSide} />
              <Text
                position={[0, 0, 0.1]}
                fontSize={0.15}
                color="black"
                maxWidth={2.8}
                lineHeight={1}
                letterSpacing={0.02}
                textAlign="left"
                anchorX="center"
                anchorY="middle"
              >
                {poem}
              </Text>
            </mesh>
          </Float>
        </group>
      )}

      {/* Action Buttons */}
      {showActions && (
        <group position={[0, -2, -5]}>
          <mesh 
            onClick={onBury} 
            position={[-1, 0, 0]}
            onPointerOver={() => setHoveredElement('bury')}
            onPointerOut={() => setHoveredElement(null)}
          >
            <boxGeometry args={[1.5, 0.3, 0.1]} />
            <meshStandardMaterial 
              color={hoveredElement === 'bury' ? '#a06c3c' : '#8b5c2c'} 
              emissive={hoveredElement === 'bury' ? '#a06c3c' : '#000000'}
              emissiveIntensity={hoveredElement === 'bury' ? 0.5 : 0}
            />
            <Text
              position={[0, 0, 0.06]}
              fontSize={0.1}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Bury Poem
            </Text>
          </mesh>
          
          <mesh 
            onClick={onReturn} 
            position={[1, 0, 0]}
            onPointerOver={() => setHoveredElement('return')}
            onPointerOut={() => setHoveredElement(null)}
          >
            <boxGeometry args={[1.5, 0.3, 0.1]} />
            <meshStandardMaterial 
              color={hoveredElement === 'return' ? '#a06c3c' : '#8b5c2c'} 
              emissive={hoveredElement === 'return' ? '#a06c3c' : '#000000'}
              emissiveIntensity={hoveredElement === 'return' ? 0.5 : 0}
            />
            <Text
              position={[0, 0, 0.06]}
              fontSize={0.1}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Return
            </Text>
          </mesh>
        </group>
      )}

      {/* Entrance/Exit - Fixed rotation */}
      <mesh 
        position={[0, 0, 5]} 
        rotation={[0, 0, 0]} // Fixed rotation
        onClick={onReturn}
        onPointerOver={() => setHoveredElement('exit')}
        onPointerOut={() => setHoveredElement(null)}
      >
        <sphereGeometry args={[3, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color={hoveredElement === 'exit' ? '#6a5a4a' : '#5a4a3a'} 
          side={THREE.FrontSide} // Changed from BackSide
          transparent 
          opacity={0.7} 
        />
        <Text
          position={[0, -1, 0.5]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Exit
        </Text>
      </mesh>
    </group>
  );
}

// Properly integrated FireParticles component for React Three Fiber
function FireParticles({ position }: { position: [number, number, number] }) {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 100;

  // Create geometry and buffers
  const positionsArray = new Float32Array(count * 3);
  const colorsArray = new Float32Array(count * 3);
  const sizesArray = new Float32Array(count);
  
  // Fill arrays with data
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positionsArray[i3] = (Math.random() - 0.5) * 1.5;
    positionsArray[i3 + 1] = Math.random() * 1.5;
    positionsArray[i3 + 2] = (Math.random() - 0.5) * 1.5;
    
    colorsArray[i3] = 1; // R
    colorsArray[i3 + 1] = Math.random() * 0.5 + 0.3; // G
    colorsArray[i3 + 2] = Math.random() * 0.2; // B
    
    sizesArray[i] = Math.random() * 0.2 + 0.1;
  }

  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = clock.getElapsedTime();
      
      // Animate particles
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Update y position to create rising effect
        positions[i3 + 1] += 0.01 + Math.random() * 0.01;
        
        // Reset particles that reach a certain height
        if (positions[i3 + 1] > 1.5) {
          positions[i3] = (Math.random() - 0.5) * 1.5;
          positions[i3 + 1] = 0;
          positions[i3 + 2] = (Math.random() - 0.5) * 1.5;
        }
        
        // Add some horizontal drift
        positions[i3] += Math.sin(time + i) * 0.001;
        positions[i3 + 2] += Math.cos(time + i) * 0.001;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef} position={position}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={count} 
          array={positionsArray} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={count} 
          array={colorsArray} 
          itemSize={3} 
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizesArray}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.2} 
        vertexColors 
        transparent 
        alphaTest={0.01} 
        blending={THREE.AdditiveBlending} 
        sizeAttenuation
      />
    </points>
  );
}