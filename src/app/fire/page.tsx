
"use client";


import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls, Stars, useTexture, Cloud, Environment } from "@react-three/drei";

// Firelight flicker effect hook
function useFirelight(intensity = 2, speed = 1) {
  const [light, setLight] = useState(intensity);
  
  useFrame(() => {
    const flicker = intensity * (0.8 + Math.random() * 0.4);
    setLight(flicker);
  });
  
  return light;
}

// Animated fire component with particles and glowing core
function Fire() {
  const fireRef = useRef();
  const fireIntensity = useFirelight(3, 1.5);
  const pointLightRef = useRef();
  
  // Core fire geometry
  const CoreFire = () => {
    const ref = useRef();
    
    useFrame(({ clock }) => {
      if (ref.current) {
        const time = clock.getElapsedTime();
        ref.current.scale.y = 1 + Math.sin(time * 2) * 0.1;
        ref.current.rotation.y = time * 0.5;
      }
    });
    
    return (
      <mesh ref={ref} position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#ff4500" toneMapped={false} />
      </mesh>
    );
  };
  
  // Ember particles that float upward
  const FireParticles = () => {
    const particlesRef = useRef();
    const count = 200;
    
    // Initial particle positions
    const positions = useMemo(() => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 0] = (Math.random() - 0.5) * 0.4;
        arr[i * 3 + 1] = Math.random() * 1.5;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      }
      return arr;
    }, [count]);
    
    // Initial particle sizes
    const sizes = useMemo(() => {
      const arr = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        arr[i] = Math.random() * 0.07 + 0.03;
      }
      return arr;
    }, [count]);
    
    // Initial colors ranging from yellow to red to dark red
    const colors = useMemo(() => {
      const arr = new Float32Array(count * 3);
      const colorOptions = [
        new THREE.Color("#ff4500"),
        new THREE.Color("#ff8c00"),
        new THREE.Color("#ffaa33"),
        new THREE.Color("#ffcc00")
      ];
      
      for (let i = 0; i < count; i++) {
        const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        color.toArray(arr, i * 3);
      }
      return arr;
    }, [count]);
    
    useFrame(({ clock }) => {
      if (!particlesRef.current) return;
      
      const time = clock.getElapsedTime();
      const positions = particlesRef.current.geometry.attributes.position;
      const sizes = particlesRef.current.geometry.attributes.size;
      
      for (let i = 0; i < count; i++) {
        // Spiral upward motion
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;
        
        // Update position
        positions.array[iy] += 0.02 + Math.random() * 0.01;
        positions.array[ix] += Math.sin(time + i) * 0.002;
        positions.array[iz] += Math.cos(time + i) * 0.002;
        
        // Reset particles that go too high
        if (positions.array[iy] > 2) {
          positions.array[ix] = (Math.random() - 0.5) * 0.3;
          positions.array[iy] = 0.1 + Math.random() * 0.2;
          positions.array[iz] = (Math.random() - 0.5) * 0.3;
          sizes.array[i] = Math.random() * 0.07 + 0.03;
        }
        
        // Fade out as they rise (smaller)
        sizes.array[i] *= 0.996;
      }
      
      positions.needsUpdate = true;
      sizes.needsUpdate = true;
    });
    
    return (
      <points ref={particlesRef} position={[0, 0.3, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          sizeAttenuation
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    );
  };
  
  // Smoke particles rising from fire
  const SmokeParticles = () => {
    const smokeRef = useRef();
    const count = 50;
    
    const positions = useMemo(() => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        arr[i * 3 + 0] = (Math.random() - 0.5) * 0.3;
        arr[i * 3 + 1] = 0.5 + Math.random() * 0.5;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      }
      return arr;
    }, [count]);
    
    const sizes = useMemo(() => {
      const arr = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        arr[i] = Math.random() * 0.2 + 0.1;
      }
      return arr;
    }, [count]);
    
    const opacities = useMemo(() => {
      const arr = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        arr[i] = Math.random() * 0.3 + 0.2;
      }
      return arr;
    }, [count]);
    
    useFrame(() => {
      if (!smokeRef.current) return;
      
      const positions = smokeRef.current.geometry.attributes.position;
      const sizes = smokeRef.current.geometry.attributes.size;
      const opacities = smokeRef.current.userData.opacities;
      
      for (let i = 0; i < count; i++) {
        // Update position - slower rise than fire particles
        positions.array[i * 3 + 1] += 0.01 + Math.random() * 0.005;
        positions.array[i * 3] += (Math.random() - 0.5) * 0.002;
        positions.array[i * 3 + 2] += (Math.random() - 0.5) * 0.002;
        
        // Grow in size as they rise
        sizes.array[i] *= 1.003;
        
        // Fade out as they rise
        opacities[i] *= 0.99;
        
        // Reset particles that go too high or become too transparent
        if (positions.array[i * 3 + 1] > 3 || opacities[i] < 0.05) {
          positions.array[i * 3] = (Math.random() - 0.5) * 0.3;
          positions.array[i * 3 + 1] = 0.5 + Math.random() * 0.2;
          positions.array[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
          sizes.array[i] = Math.random() * 0.2 + 0.1;
          opacities[i] = Math.random() * 0.3 + 0.2;
        }
      }
      
      positions.needsUpdate = true;
      sizes.needsUpdate = true;
      
      // Update material opacity for each particle
      if (smokeRef.current.material) {
        smokeRef.current.material.opacity = 0.3;
      }
    });
    
    return (
      <points ref={smokeRef} position={[0, 0.6, 0]} userData={{ opacities }}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={count}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#888888"
          size={0.2}
          sizeAttenuation
          transparent
          opacity={0.3}
          depthWrite={false}
        />
      </points>
    );
  };
  
  useFrame(() => {
    if (pointLightRef.current) {
      pointLightRef.current.intensity = fireIntensity;
    }
  });
  
  return (
    <group ref={fireRef} position={[0, 0, 0]}>
      <CoreFire />
      <FireParticles />
      <SmokeParticles />
      <pointLight 
        ref={pointLightRef}
        position={[0, 0.7, 0]}
        distance={15}
        intensity={fireIntensity}
        color="#ff6a00"
        castShadow
      />
    </group>
  );
}

// Logs arranged in a teepee style
function Logs() {
  // const barkTexture = useTexture("/api/placeholder/200/200");
  
  return (
    <group>
      {/* Base logs in a teepee formation */}
      <Log position={[-0.4, 0.1, -0.4]} rotation={[0.2, 0, Math.PI / 3.2]} />
      <Log position={[0.4, 0.1, -0.4]} rotation={[0.2, 0, -Math.PI / 3.2]} />
      <Log position={[-0.4, 0.1, 0.4]} rotation={[0.2, 0, Math.PI / 3.2 * 3]} />
      <Log position={[0.4, 0.1, 0.4]} rotation={[0.2, 0, -Math.PI / 3.2 * 3]} />
      
      {/* Horizontal logs for sitting */}
      <Log position={[-1.5, 0.2, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1, 0.6, 0.6]} />
      <Log position={[1.0, 0.2, 1.5]} rotation={[0, -Math.PI / 6, 0]} scale={[1, 0.6, 0.6]} />
      <Log position={[0, 0.2, -1.7]} rotation={[0, Math.PI / 2, 0]} scale={[1, 0.6, 0.6]} />
    </group>
  );
}

// Individual log with texture
// function Log({ position, rotation, scale = [1, 1, 1], texture }) {
//   return (
//     <mesh position={position} rotation={rotation} scale={scale} castShadow>
//       <cylinderGeometry args={[0.1, 0.12, 2, 8]} />
//       <meshStandardMaterial map={texture} color="#5c3c28" roughness={1} normalScale={0.5} />
//     </mesh>
//   );
// }

function Log({ position, rotation, scale = [1, 1, 1] }) {
  return (
    <mesh position={position} rotation={rotation} scale={scale} castShadow>
      <cylinderGeometry args={[0.1, 0.12, 2, 8]} />
      <meshStandardMaterial 
        color="#5c3c28" 
        roughness={1} 
        normalScale={0.5}
      />
    </mesh>
  );
}
// Stones arranged in a circle around the fire
function FireRing() {
  const stoneCount = 12;
  const radius = 0.7;
  
  return (
    <group>
      {Array.from({ length: stoneCount }).map((_, i) => {
        const angle = (i / stoneCount) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const scale = 0.7 + Math.random() * 0.4;
        const rotY = Math.random() * Math.PI;
        
        return (
          <mesh key={i} position={[x, 0.05, z]} rotation={[0, rotY, 0]} scale={[scale, scale * 0.7, scale]} castShadow receiveShadow>
            <dodecahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial color="#555555" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}

// Ground with grass texture
// function Ground() {
//   const grassTexture = useTexture("/api/placeholder/400/400");
  
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
//       <planeGeometry args={[100, 100, 32, 32]} />
//       <meshStandardMaterial 
//         map={grassTexture}
//         color="#1a2e1a" 
//         roughness={0.9}
//         metalness={0.1}
//         displacementScale={0.1}
//       />
//     </mesh>
//   );
// }

function Ground() {
  // Option 1: Use a solid color instead of texture
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100, 32, 32]} />
      <meshStandardMaterial 
        color="#2d4d2d" 
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}
// Soft moss patches around the campfire
function MossPatches() {
  const patchPositions = [
    [1.2, 0.01, 0.8],
    [-1.0, 0.01, 1.2],
    [0.7, 0.01, -1.5],
    [-1.4, 0.01, -0.6],
    [1.8, 0.01, -1.2]
  ];
  
  return (
    <>
      {patchPositions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[-Math.PI / 2, 0, Math.random() * Math.PI * 2]} receiveShadow>
          <circleGeometry args={[0.6 + Math.random() * 0.4, 16]} />
          <meshStandardMaterial color="#1d421d" roughness={1} />
        </mesh>
      ))}
    </>
  );
}

// Tree with detailed trunk and leaves
// Tree with detailed trunk and leaves
function Tree({ position, scale = 1, treeType = "pine" }) {
  const trunkRef = useRef();
  const leavesRef = useRef();

  const treeTypes = {
    pine: {
      trunkHeight: 1.5 * scale,
      trunkRadius: 0.1 * scale,
      leavesHeight: 3 * scale,
      leavesBottomRadius: 1.2 * scale,
      leavesTopRadius: 0.1 * scale,
      leavesColor: "#2d6d2d",
      segments: 8
    },
    oak: {
      trunkHeight: 1.2 * scale,
      trunkRadius: 0.15 * scale,
      leavesRadius: 1 * scale,
      leavesColor: "#4a8f4a",
      segments: 16
    },
    birch: {
      trunkHeight: 2 * scale,
      trunkRadius: 0.08 * scale,
      leavesHeight: 1.8 * scale,
      leavesRadius: 1 * scale,
      leavesColor: "#2d6d2d",
      trunkColor: "#e0e0e0",
      segments: 8
    }
  };
  
  // Small wind sway animation
  useFrame(({ clock }) => {
    if (leavesRef.current && trunkRef.current) {
      const time = clock.getElapsedTime();
      leavesRef.current.rotation.y = Math.sin(time * 0.3) * 0.05;
      leavesRef.current.rotation.z = Math.cos(time * 0.2) * 0.02;
      trunkRef.current.rotation.z = Math.sin(time * 0.3) * 0.01;
    }
  });
  
  if (treeType === "pine") {
    const { trunkHeight, trunkRadius, leavesHeight, leavesBottomRadius, leavesTopRadius, leavesColor, segments } = treeTypes.pine;
    
    return (
      <group position={position}>
        {/* Trunk positioned at half its height from ground */}
        <mesh ref={trunkRef} position={[0, trunkHeight / 2, 0]} castShadow>
          <cylinderGeometry args={[trunkRadius, trunkRadius * 1.2, trunkHeight, segments]} />
          <meshStandardMaterial color="#5c3c28" roughness={0.9} />
        </mesh>
        
        {/* Leaves positioned at the top of the trunk */}
        <group ref={leavesRef} position={[0, trunkHeight, 0]}>
          <mesh position={[0, leavesHeight / 2, 0]} castShadow>
            <coneGeometry args={[leavesBottomRadius, leavesHeight, segments]} />
            <meshStandardMaterial color={leavesColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, leavesHeight * 0.8, 0]} castShadow>
            <coneGeometry args={[leavesBottomRadius * 0.8, leavesHeight * 0.8, segments]} />
            <meshStandardMaterial color={leavesColor} roughness={0.8} />
          </mesh>
          <mesh position={[0, leavesHeight * 1.3, 0]} castShadow>
            <coneGeometry args={[leavesBottomRadius * 0.6, leavesHeight * 0.6, segments]} />
            <meshStandardMaterial color={leavesColor} roughness={0.8} />
          </mesh>
        </group>
      </group>
    );
  } else if (treeType === "oak") {
    const { trunkHeight, trunkRadius, leavesRadius, leavesColor, segments } = treeTypes.oak;
    
    return (
      <group position={position}>
        {/* Trunk positioned at half its height from ground */}
        <mesh ref={trunkRef} position={[0, trunkHeight / 2, 0]} castShadow>
          <cylinderGeometry args={[trunkRadius, trunkRadius * 1.3, trunkHeight, segments]} />
          <meshStandardMaterial color="#4b3621" roughness={0.9} />
        </mesh>
        
        {/* Leaves positioned at the top of the trunk */}
        <group ref={leavesRef} position={[0, trunkHeight, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[leavesRadius, segments, segments]} />
            <meshStandardMaterial color={leavesColor} roughness={0.8} />
          </mesh>
        </group>
      </group>
    );
  } else { // birch
    const { trunkHeight, trunkRadius, leavesHeight, leavesRadius, leavesColor, trunkColor, segments } = treeTypes.birch;
    
    return (
      <group position={position}>
        {/* Trunk positioned at half its height from ground */}
        <mesh ref={trunkRef} position={[0, trunkHeight / 2, 0]} castShadow>
          <cylinderGeometry args={[trunkRadius, trunkRadius * 1.2, trunkHeight, segments]} />
          <meshStandardMaterial color={trunkColor || "#e0e0e0"} roughness={0.8} />
        </mesh>
        
        {/* Leaves positioned at the top of the trunk */}
        <group ref={leavesRef} position={[0, trunkHeight, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[leavesRadius, segments, segments]} />
            <meshStandardMaterial color={leavesColor} roughness={0.8} />
          </mesh>
        </group>
      </group>
    );
  }
}// Forest of trees surrounding the campfire
function Forest() {
  // Create trees in concentric circles
  const trees = [];
  
  // Inner circle of trees
  const innerCircleCount = 8;
  const innerRadius = 12;
  for (let i = 0; i < innerCircleCount; i++) {
    const angle = (i / innerCircleCount) * Math.PI * 2;
    const x = Math.cos(angle) * innerRadius;
    const z = Math.sin(angle) * innerRadius;
    const scale = 1.2 + Math.random() * 0.3;
    trees.push({
      position: [x, 0, z],
      scale,
      type: Math.random() > 0.7 ? "oak" : "pine"
    });
  }
  
  // Outer circle of trees
  const outerCircleCount = 16;
  const outerRadius = 20;
  for (let i = 0; i < outerCircleCount; i++) {
    const angle = (i / outerCircleCount) * Math.PI * 2 + 0.1;
    const x = Math.cos(angle) * outerRadius;
    const z = Math.sin(angle) * outerRadius;
    const scale = 1.5 + Math.random() * 0.5;
    trees.push({
      position: [x, 0, z],
      scale,
      type: Math.random() > 0.3 ? "pine" : (Math.random() > 0.5 ? "oak" : "birch")
    });
  }
  
  // Random trees scattered further out
  for (let i = 0; i < 25; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 25 + Math.random() * 20;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const scale = 1.5 + Math.random() * 1;
    trees.push({
      position: [x, 0, z],
      scale,
      type: Math.random() > 0.6 ? "pine" : (Math.random() > 0.5 ? "oak" : "birch")
    });
  }

  return (
    <>
      {trees.map((tree, i) => (
        <Tree 
          key={i} 
          position={tree.position} 
          scale={tree.scale} 
          treeType={tree.type} 
        />
      ))}
    </>
  );
}

// Small details and vegetation to enhance realism
function ForestDetails() {
  // Mushrooms
  const mushroomPositions = Array.from({ length: 12 }, () => [
    (Math.random() - 0.5) * 6,
    0.02,
    (Math.random() - 0.5) * 6
  ]);
  
  // Fallen logs
  const fallenLogPositions = [
    { pos: [3, 0.2, 2], rot: [0.1, Math.PI / 3, 0.1], scale: [1, 0.7, 0.7] },
    { pos: [-4, 0.15, -3], rot: [0.05, -Math.PI / 5, 0], scale: [1.2, 0.6, 0.6] },
    { pos: [2, 0.12, -5], rot: [0, Math.PI / 2.5, 0.08], scale: [0.9, 0.5, 0.5] }
  ];
  
  // Rocks scattered around
  const rockPositions = Array.from({ length: 20 }, () => ({
    pos: [(Math.random() - 0.5) * 15, 0.05, (Math.random() - 0.5) * 15],
    rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
    scale: 0.3 + Math.random() * 0.5
  }));
  
  return (
    <>
      {/* Mushrooms */}
      {mushroomPositions.map((pos, i) => (
        <group key={`mushroom-${i}`} position={pos}>
          <mesh castShadow>
            <cylinderGeometry args={[0.03, 0.04, 0.15, 8]} />
            <meshStandardMaterial color="#e0e0d0" />
          </mesh>
          <mesh position={[0, 0.1, 0]} castShadow>
            <coneGeometry args={[0.1, 0.08, 8, 1, true]} />
            <meshStandardMaterial color="#aa3333" roughness={0.8} />
          </mesh>
        </group>
      ))}
      
      {/* Fallen logs */}
      {fallenLogPositions.map((log, i) => (
        <mesh 
          key={`fallen-log-${i}`} 
          position={log.pos} 
          rotation={log.rot}
          scale={log.scale}
          castShadow 
          receiveShadow
        >
          <cylinderGeometry args={[0.2, 0.2, 3, 8]} />
          <meshStandardMaterial color="#3d2817" roughness={1} />
        </mesh>
      ))}
      
      {/* Rocks */}
      {rockPositions.map((rock, i) => (
        <mesh 
          key={`rock-${i}`} 
          position={rock.pos} 
          rotation={rock.rot}
          scale={rock.scale} 
          castShadow 
          receiveShadow
        >
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial color="#888888" roughness={0.95} />
          </mesh>
      ))}
    </>
  );
}

// Small lights like fireflies in the forest
function Fireflies() {
  const count = 50;
  const ref = useRef();
  
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = Math.random() * 5 + 0.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, [count]);
  
  const sizes = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = Math.random() * 0.5 + 0.1;
    }
    return arr;
  }, [count]);
  
  useFrame(({ clock }) => {
    if (!ref.current) return;
    
    const time = clock.getElapsedTime();
    const positions = ref.current.geometry.attributes.position;
    const sizes = ref.current.geometry.attributes.size;
    
    for (let i = 0; i < count; i++) {
      // Gentle floating movement
      positions.array[i * 3 + 0] += Math.sin(time * 0.1 + i) * 0.01;
      positions.array[i * 3 + 1] += Math.cos(time * 0.1 + i) * 0.01;
      positions.array[i * 3 + 2] += Math.sin(time * 0.1 + i + 10) * 0.01;
      
      // Pulsing glow effect
      sizes.array[i] = (Math.sin(time * 2 + i * 100) * 0.5 + 0.5) * 0.3 + 0.1;
    }
    
    positions.needsUpdate = true;
    sizes.needsUpdate = true;
  });
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        color="#ffffa0"
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Night sky with more stars and a moon
function NightSky() {
  return (
    <>
      {/* Distant stars */}
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0.3} 
        fade
        speed={0.5}
      />
      
      {/* Moon */}
      <mesh position={[40, 30, -50]}>
        <sphereGeometry args={[5, 16, 16]} />
        <meshBasicMaterial color="#fffaf0" toneMapped={false} />
        <pointLight intensity={0.8} distance={200} color="#fffaf0" />
      </mesh>
    </>
  );
}

// Post-processing effects for mood enhancement
function PostProcessing() {
  const { gl, scene, camera } = useThree();
  
  useEffect(() => {
    // This would be where we'd add post-processing effects
    // In a real implementation, we would use postprocessing library
    return () => {
      // Cleanup 
    };
  }, [gl, scene, camera]);
  
  return null;
}

// Atmospheric fog for depth
function AtmosphericFog() {
  const { scene } = useThree();
  
  useEffect(() => {
    scene.fog = new THREE.FogExp2("#0a0a11", 0.01);
    return () => {
      scene.fog = null;
    };
  }, [scene]);
  
  return null;
}
// Sound component for forest ambient sounds
function AmbientSounds() {
  useEffect(() => {
    // Create placeholders for sounds but don't try to play them
    // This avoids errors since we don't have actual sound files
    console.log("Ambient sounds would play here in a complete implementation");
    
    return () => {
      // Clean up would happen here
    };
  }, []);
  
  return null;
}
// Main scene component putting everything together
function CampfireScene() {
  return (
    <>
      <Environment preset="night" />
      <AtmosphericFog />
      <NightSky />
      
      {/* Main scene elements */}
      <Ground />
      <MossPatches />
      <FireRing />
      <Logs />
      <Fire />
      
      {/* Surrounding forest */}
      <Forest />
      <ForestDetails />
      <Fireflies />
      
      {/* Atmosphere */}
      <Cloud position={[10, 15, -15]} args={[3, 2]} opacity={0.3} speed={0.4} />
      <Cloud position={[-15, 10, 10]} args={[4, 2]} opacity={0.2} speed={0.3} />
      
      {/* Ambient sounds */}
      <AmbientSounds />
      
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <PostProcessing />
    </>
  );
}

// Camera controls and scene setup
function CameraRig() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 0.5, 0);
  }, [camera]);
  
  return (
    <OrbitControls 
      enableZoom={true}
      enablePan={true}
      dampingFactor={0.05}
      minDistance={3}
      maxDistance={20}
      maxPolarAngle={Math.PI / 2 - 0.1}
    />
  );
}

// Main component export
export default function CampfireApp() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        shadows
        camera={{ position: [5, 3, 5], fov: 60 }}
        gl={{ antialias: true }}
      >
        <CameraRig />
        <CampfireScene />
      </Canvas>
      <div className="absolute bottom-4 left-4 text-white text-opacity-70 text-sm">
        Use mouse to orbit around the campfire. Scroll to zoom.
      </div>
    </div>
  );
}