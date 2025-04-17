'use client';
import { useState, useEffect } from 'react';
import '../styles/poem.css';

export default function PoemOverlay({ poem, onSubmit }: { poem: string, onSubmit: (text: string) => void }) {
  const [input, setInput] = useState('');
  const [words, setWords] = useState<string[]>([]);
  const [isScattering, setIsScattering] = useState(false);

  useEffect(() => {
    if (poem) {
      setWords(poem.split(' '));
    }
  }, [poem]);

  const handleScatter = () => {
    setIsScattering(true);
    setTimeout(() => {
      setIsScattering(false);
    }, 3000);
  };

  return (
    <div className="pointer-events-auto absolute top-10 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
      {!poem ? (
        <>
          <div className="bg-[#121212]/80 p-6 rounded-lg shadow-xl border border-amber-900/50">
            <textarea
              className="w-full h-40 bg-[#1a1a1a] text-amber-100 p-4 rounded-md border border-amber-700/50 resize-none font-serif"
              placeholder="Speak your soul into the darkness..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={() => onSubmit(input)}
              className="mt-4 bg-amber-700 px-4 py-2 rounded hover:bg-amber-600 transition-colors shadow-md"
            >
              Transform into Poetry
            </button>
          </div>
        </>
      ) : (
        <div className="relative">
          <div className="bg-[#1a1810] p-6 mt-4 rounded-lg shadow-xl text-lg font-serif border border-amber-800/50">
            {!isScattering ? (
              <div className="poetic-font text-amber-100">{poem}</div>
            ) : (
              <div className="min-h-40 relative">
                {words.map((word, i) => (
                  <span 
                    key={i}
                    className="absolute poetic-font text-amber-100 opacity-0 scatter-word"
                    style={{
                      top: '0px',
                      left: `${(i % 10) * 10}%`,
                      animation: `scatterWord 3s forwards ${i * 0.05}s`,
                      transformOrigin: 'center'
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleScatter}
                className="text-sm px-3 py-1 bg-green-800 text-white rounded hover:bg-green-700 transition-colors shadow"
              >
                Scatter like leaves
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}