import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Mesh, Vector3 } from 'three';

export default function CaveScene({ poem }: { poem: string }) {
  const stoneTexture = useTexture('/assets/oldpaper.jpg');
  const paperRef = useRef<Mesh>(null);
  const [paperRotation, setPaperRotation] = useState(0);

  useFrame(() => {
    if (paperRef.current && poem) {
      // Gentle floating animation for the paper
      setPaperRotation(prev => prev + 0.002);
      paperRef.current.position.y = 1.2 + Math.sin(paperRotation) * 0.1;
      paperRef.current.rotation.y = Math.sin(paperRotation * 0.5) * 0.05;
    }
  });

  // Create cave atmosphere with rocks and props
  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial map={stoneTexture} />
      </mesh>

      {/* Cave walls */}
      <mesh position={[0, 2, -5]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[8, 8, 8, 16, 1, true, Math.PI, Math.PI]} />
        <meshStandardMaterial color="#332a1a" roughness={1} side={2} />
      </mesh>

      {/* Poem paper */}
      {poem && (
        <mesh ref={paperRef} position={[0, 1.2, 0]}>
          <planeGeometry args={[1.5, 1]} />
          <meshStandardMaterial color="#fff8dc" roughness={0.7} metalness={0.1} />
        </mesh>
      )}

      {/* Torch lights */}
      <pointLight position={[-3, 2, -2]} intensity={0.8} color="#ff9c4d" distance={10} />
      <pointLight position={[3, 2, -2]} intensity={0.8} color="#ff9c4d" distance={10} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
    </>
  );
}