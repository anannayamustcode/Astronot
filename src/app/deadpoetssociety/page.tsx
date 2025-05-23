'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import ClassroomScene from '@/components/ClassroomScene';
import CaveScene from '@/components/CaveScene';
import GraveyardScene from '@/components/GraveyardScene';

export default function DeadPoetsSociety() {
  const [activeScene, setActiveScene] = useState<'classroom' | 'cave' | 'graveyard'>('classroom');
  const [transition, setTransition] = useState(false);
  const [poem, setPoem] = useState('');
  const [archive, setArchive] = useState<string[]>([]);

  const handleSceneChange = (scene: typeof activeScene) => {
    setTransition(true);
    setTimeout(() => {
      setActiveScene(scene);
      setTransition(false);
    }, 1000);
  };

  const handleSubmitPoem = (newPoem: string) => {
    setPoem(newPoem);
    // Auto-navigate to cave after poem submission
    handleSceneChange('cave');
  };

  const handleBuryPoem = () => {
    if (poem) {
      setArchive([...archive, poem]);
      setPoem('');
      handleSceneChange('graveyard');
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Main 3D Canvas */}
      <Canvas shadows camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          {/* Added OrbitControls for 3D navigation */}
          <OrbitControls target={[0, 1, -5]} maxPolarAngle={Math.PI / 1.5} />
          
          {activeScene === 'classroom' && (
            <ClassroomScene 
              onEnterCave={() => handleSceneChange('cave')} 
              onSubmitPoem={handleSubmitPoem}
            />
          )}
          {activeScene === 'cave' && (
            <CaveScene 
              poem={poem} 
              onBury={handleBuryPoem}
              onReturn={() => handleSceneChange('classroom')}
            />
          )}
          {activeScene === 'graveyard' && (
            <GraveyardScene 
              archive={archive} 
              onReturn={() => handleSceneChange('cave')}
            />
          )}
          <Environment preset="sunset" />
          <EffectComposer>
            <Bloom intensity={0.5} luminanceThreshold={0.2} />
            <Vignette offset={0.3} darkness={0.7} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      {!transition && (
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button 
            onClick={() => handleSceneChange('classroom')}
            className={`px-4 py-2 rounded-lg ${activeScene === 'classroom' ? 'bg-amber-600' : 'bg-stone-800/80'} text-white`}
          >
            Classroom
          </button>
          <button 
            onClick={() => handleSceneChange('cave')}
            className={`px-4 py-2 rounded-lg ${activeScene === 'cave' ? 'bg-amber-600' : 'bg-stone-800/80'} text-white`}
          >
            Cave
          </button>
          <button 
            onClick={() => handleSceneChange('graveyard')}
            className={`px-4 py-2 rounded-lg ${activeScene === 'graveyard' ? 'bg-amber-600' : 'bg-stone-800/80'} text-white`}
            disabled={archive.length === 0}
          >
            Graveyard
          </button>
        </motion.div>
      )}

      {/* Transition Overlay */}
      {transition && (
        <motion.div 
          className="absolute inset-0 bg-black z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="text-6xl text-amber-400"
          >
            ✍️
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}