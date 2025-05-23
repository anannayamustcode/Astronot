'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';

export default function ClassroomScene({ onEnterCave, onSubmitPoem }: { 
  onEnterCave: () => void, 
  onSubmitPoem: (text: string) => void 
}) {
  const [input, setInput] = useState('');
  const [showPoemUI, setShowPoemUI] = useState(false);
  const [showDesk, setShowDesk] = useState(false);
  const deskRef = useRef<THREE.Group>(null);
  const poemRef = useRef<THREE.Group>(null);
  const blackboardRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (deskRef.current) {
      deskRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.05;
    }
    if (poemRef.current) {
      poemRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.05 + 0.2;
    }
    if (blackboardRef.current && !showPoemUI) {
      blackboardRef.current.scale.set(
        1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.01,
        1 + Math.sin(clock.getElapsedTime() * 0.5) * 0.01,
        1
      );
    }
  });

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmitPoem(input);
      setShowPoemUI(false);
      setShowDesk(true);
    }
  };

  const togglePoemUI = () => {
    setShowPoemUI(!showPoemUI);
  };

  return (
    <group>

<Stars
    radius={100} // how far the stars spread
    depth={50} // how deep the star field goes
    count={5000} // number of stars
    factor={4} // star size factor
    saturation={0} // how colorful
    fade
    speed={1} // animation speed
  />
      {/* Classroom Environment */}
    
      <mesh 
        ref={blackboardRef} 
  position={[0, 2.2, -3.8]} // slightly lower & closer
        rotation={[0, 0, 0]}
        onClick={togglePoemUI}
      >
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color="#1a1a1a" />
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {showPoemUI ? "" : "Carpe Diem\n(Click to write)"}
        </Text>
      </mesh>

      {/* Classroom Decor */}
      <mesh position={[0, 3.4, -3]} rotation={[0, 0, 0]}>
  <planeGeometry args={[7, 1]} />
  <meshStandardMaterial color="#f5f5dc" />
  
  <Text
    position={[0, 0, 0.01]}
    fontSize={0.15}
    color="#333"
    maxWidth={6}
    lineHeight={0.9}
    anchorX="center"
    anchorY="middle"
  >
    "We don't read and write poetry because it's cute. We read and write poetry because we are members of the human race."
  </Text>
</mesh>


      {/* Teacher's Desk */}
      <mesh position={[0, 0, -3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2, 0.8, 1]} />
        <meshStandardMaterial color="#5a4f3e" />
        
        {/* Teacher's items */}
        <mesh position={[-0.6, 0.45, -0.2]}>
          <boxGeometry args={[0.3, 0.1, 0.2]} />
          <meshStandardMaterial color="#8b0000" />
        </mesh>
        <mesh position={[0.3, 0.45, 0]} rotation={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </mesh>

      {/* Student Desks */}
      {[...Array(6)].map((_, i) => (
        <group key={i} position={[(i % 3 - 1) * 2.5, 0, (Math.floor(i / 3) - 1) * 1.5]}>
          <mesh>
            <boxGeometry args={[1.5, 0.7, 0.8]} />
            <meshStandardMaterial color="#4d3e2e" />
          </mesh>
          <mesh position={[0, 0.5, -0.5]}>
            <boxGeometry args={[1.5, 0.05, 1]} />
            <meshStandardMaterial color="#6a5c4a" />
          </mesh>
          
          {/* Random items on some desks */}
          {i % 2 === 0 && (
            <mesh position={[Math.random() * 0.4 - 0.2, 0.55, Math.random() * 0.4 - 0.7]} rotation={[0, Math.random() * Math.PI, 0]}>
              <boxGeometry args={[0.2, 0.02, 0.3]} />
              <meshStandardMaterial color="#f0f0f0" />
            </mesh>
          )}
        </group>
      ))}

      {/* Poetry Desk */}
      {showDesk && (
        <group ref={deskRef} position={[0, 0.5, 0]}>
          <mesh>
            <boxGeometry args={[1.5, 0.1, 1]} />
            <meshStandardMaterial color="#8b5c2c" />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <boxGeometry args={[0.1, 0.5, 0.1]} />
            <meshStandardMaterial color="#4d2b06" />
          </mesh>
          
          {/* Poem Paper */}
          <group ref={poemRef} position={[0, 0.2, 0]}>
            <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
              <mesh rotation={[-Math.PI / 8, 0, 0]}>
                <planeGeometry args={[1.2, 0.8]} />
                <meshStandardMaterial color="#f5f5dc" side={THREE.DoubleSide} />
                <Text
                  position={[0, 0, 0.01]}
                  fontSize={0.05}
                  color="black"
                  maxWidth={1}
                  lineHeight={1}
                  letterSpacing={0.02}
                  textAlign="left"
                  anchorX="center"
                  anchorY="middle"
                >
                  {input}
                </Text>
              </mesh>
            </Float>
          </group>
        </group>
      )}

      {/* Text Input UI - Only show when blackboard is clicked */}
      {showPoemUI && (
        <Html
          position={[0, 2.5, -3.5]}
          transform
          occlude
          style={{
            width: '400px',
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}
          center
        >
          <h3 style={{ color: '#ffd700', marginBottom: '15px', fontFamily: 'Georgia, serif' }}>Write Your Verse</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Speak your soul into the darkness..."
            style={{
              width: '100%',
              height: '150px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              fontFamily: 'Georgia, serif',
              fontSize: '16px',
              resize: 'none'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <button
              onClick={togglePoemUI}
              style={{
                padding: '8px 16px',
                backgroundColor: '#555',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                fontSize: '16px',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#8b5c2c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                fontSize: '16px',
                transition: 'background-color 0.3s',
                opacity: input.trim() ? 1 : 0.6
              }}
            >
              Transform into Poetry
            </button>
          </div>
        </Html>
      )}

      {/* Cave Entrance */}
      <group position={[5, 1, -2]}>
        <mesh onClick={onEnterCave}>
          <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#3a2a1a" side={THREE.BackSide} />
        </mesh>
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#ff7b00" distance={3} decay={2} />
        <Text
          position={[0, -1.3, 0.5]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Enter Cave
        </Text>
      </group>

      {/* Windows */}
      {[...Array(3)].map((_, i) => (
        <mesh key={i} position={[i * 3 - 3, 3, -4]} rotation={[0, 0, 0]}>
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}