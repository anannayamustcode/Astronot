'use client';

import { useRef, useState } from 'react';
import { Text, Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function GraveyardScene({ archive, onReturn }: { 
  archive: string[], 
  onReturn: () => void 
}) {
  const [selectedPoem, setSelectedPoem] = useState<number | null>(null);
  const ghosts = useRef<Array<THREE.Group | null>>([]);
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (moonRef.current) {
      moonRef.current.position.y = 10 + Math.sin(clock.getElapsedTime() * 0.2) * 0.5;
    }
    
    ghosts.current.forEach((ghost, i) => {
      if (ghost) {
        ghost.position.y = 2 + Math.sin(clock.getElapsedTime() * 0.5 + i) * 0.3;
        ghost.position.x = Math.sin(clock.getElapsedTime() * 0.3 + i) * 0.5;
      }
    });
  });

  return (
    <group>
      {/* Night Environment */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Moon */}
      <mesh ref={moonRef} position={[5, 10, -15]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial color="#fff8e0" emissive="#fff8e0" emissiveIntensity={0.5} />
      </mesh>

      {/* Ground */}
      <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Tombstones */}
      {archive.map((poem, i) => (
        <group key={i} position={[(i % 5 - 2) * 4, 0, Math.floor(i / 5) * 4 - 10]}>
          <mesh onClick={() => setSelectedPoem(selectedPoem === i ? null : i)}>
            <boxGeometry args={[1, 1.5, 0.2]} />
            <meshStandardMaterial color="#5a5a5a" />
            <Text
              position={[0, 0.5, 0.11]}
              fontSize={0.2}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              Poem #{i + 1}
            </Text>
          </mesh>
          
          {/* Ghost that appears when selected */}
          {selectedPoem === i && (
            <group 
              ref={(el) => {
                // Ensure the array is large enough to hold this reference
                if (ghosts.current.length <= i) {
                  ghosts.current = [...ghosts.current, ...Array(i - ghosts.current.length + 1).fill(null)];
                }
                ghosts.current[i] = el;
              }} 
              position={[0, 2, 0]}
            >
              <mesh>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial 
                  color="white" 
                  transparent 
                  opacity={0.8} 
                  emissive="white" 
                  emissiveIntensity={0.3} 
                />
              </mesh>
              <Text
                position={[0, -1, 0]}
                fontSize={0.3}
                color="white"
                maxWidth={3}
                anchorX="center"
                anchorY="top"
              >
                {poem.split('\n').slice(0, 3).join('\n')}
                {poem.split('\n').length > 3 ? '...' : ''}
              </Text>
            </group>
          )}
        </group>
      ))}

      {/* Return Button */}
      <mesh position={[0, 0, 5]} onClick={onReturn}>
        <boxGeometry args={[3, 0.5, 0.1]} />
        <meshStandardMaterial color="#8b5c2c" />
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Return to Cave
        </Text>
      </mesh>

      {/* Floating spirits */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[Math.sin(i) * 10, 3, -15 + i * 2]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial 
            color="white" 
            transparent 
            opacity={0.5} 
            emissive="white" 
            emissiveIntensity={0.2} 
          />
        </mesh>
      ))}
    </group>
  );
}