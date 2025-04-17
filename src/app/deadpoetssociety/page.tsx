'use client';

import { useState, useEffect } from 'react';
import PoemCave from '@/components/PoemCave';
import Graveyard from '@/components/Graveyard';
import MatchboxInventory from '@/components/MatchboxInventory';
import BookPageOverlay from '@/components/BookPageOverlay';

export default function DeadPoetsSociety() {
  const [poem, setPoem] = useState('');
  const [archive, setArchive] = useState<string[]>([]);
  const [showBookOverlay, setShowBookOverlay] = useState(false);
  const [destructionType, setDestructionType] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Load saved poems from localStorage
    const savedPoems = localStorage.getItem('buriedPoems');
    if (savedPoems) {
      setArchive(JSON.parse(savedPoems));
    }
  }, []);

  const saveToLocalStorage = (updatedArchive: string[]) => {
    localStorage.setItem('buriedPoems', JSON.stringify(updatedArchive));
  };

  const handleSubmit = (input: string) => {
    const beautified = beautifyToPoem(input);
    setPoem(beautified);
  };

  const handleBury = () => {
    setDestructionType('bury');
    setIsAnimating(true);
    setTimeout(() => {
      setArchive([...archive, poem]);
      saveToLocalStorage([...archive, poem]);
      setPoem('');
      setIsAnimating(false);
      setDestructionType('');
    }, 1500);
  };

  const handleDestroy = (method: string) => {
    setDestructionType(method);
    setIsAnimating(true);
    setTimeout(() => {
      setPoem('');
      setIsAnimating(false);
      setDestructionType('');
    }, 1500);
  };

  const beautifyToPoem = (input: string): string => {
    // More sophisticated poem formatting
    const lines = input.split(/[.,;!?]/).filter(Boolean);
    
    // Add some poetic formatting
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      // Occasionally add ellipses or em dashes for dramatic effect
      if (Math.random() > 0.7) {
        return trimmed + "...";
      } else if (Math.random() > 0.8) {
        return "— " + trimmed;
      }
      return trimmed;
    });
    
    // Add a poetic title occasionally
    const withTitle = Math.random() > 0.5 
      ? `"${formattedLines[0].split(' ').slice(0, 3).join(' ')}..."\n\n${formattedLines.join('\n')}`
      : formattedLines.join('\n');
    
    return withTitle;
  };

  const toggleBookOverlay = () => {
    setShowBookOverlay(!showBookOverlay);
  };

  return (
    <div 
      className="min-h-screen bg-slate-900 text-amber-50 flex flex-col items-center justify-center p-6 space-y-6 bg-cover bg-center relative overflow-hidden" 
      style={{ backgroundImage: "url('/assets/oldpaper.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl">
        <h1 className="text-3xl font-serif mb-8 text-amber-200">Dead Poets Society</h1>
        
        <div className="flex space-x-4 mb-6">
          <button 
            onClick={toggleBookOverlay}
            className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition"
          >
            {showBookOverlay ? "Close Book" : "Write in Margins"}
          </button>
        </div>
        
        {showBookOverlay ? (
          <BookPageOverlay onSubmit={handleSubmit} />
        ) : (
          <PoemCave 
            poem={poem} 
            onSubmit={handleSubmit} 
            onDownload={() => downloadPoem(poem)} 
            isAnimating={isAnimating}
            destructionType={destructionType}
          />
        )}
        
        {poem && !isAnimating && (
          <MatchboxInventory onBury={handleBury} onDestroy={handleDestroy} />
        )}
        
        <Graveyard archive={archive} />
      </div>
    </div>
  );
}

function downloadPoem(text: string) {
  const element = document.createElement("a");
  const file = new Blob([text], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = "my_poem.txt";
  document.body.appendChild(element);
  element.click();
}