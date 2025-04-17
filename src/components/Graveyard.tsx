import { useState } from 'react';

export default function Graveyard({ archive }: { archive: string[] }) {
  const [selectedPoemIndex, setSelectedPoemIndex] = useState<number | null>(null);

  return (
    <div className="w-full mt-14 p-10 bg-gradient-to-b from-[#0f0b06]/90 to-[#1e1a14]/90 rounded-3xl shadow-[0_0_30px_rgba(255,215,0,0.05)] border border-amber-700/30 max-w-5xl mx-auto backdrop-blur-md transition-all duration-500">
      <h2 className="text-2xl font-serif mb-8 text-center text-amber-300 tracking-wider flex items-center justify-center gap-3">
        <span className="text-3xl animate-pulse">🕯️</span> 
        GRAVEYARD OF FORGOTTEN WORDS
        <span className="text-3xl animate-pulse">🕯️</span>
      </h2>

      {archive.length === 0 ? (
        <p className="text-amber-100/50 italic text-center py-12 font-serif text-lg">
          "The words you fear most lie waiting to be buried."
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {archive.map((entry, i) => {
            const isSelected = selectedPoemIndex === i;
            return (
              <div 
                key={i} 
                onClick={() => setSelectedPoemIndex(isSelected ? null : i)}
                className={`
                  bg-[#1a140d]/80 backdrop-blur-sm p-5 rounded-xl transition-all duration-500 border
                  ${isSelected 
                    ? 'border-amber-500 shadow-amber-700/30 shadow-xl scale-[1.02]' 
                    : 'border-amber-900/20 hover:border-amber-400/40 hover:scale-[1.01]'}
                  cursor-pointer poetic-font text-amber-100/90 relative group overflow-hidden
                `}
              >
                <div className="tombstone-header flex justify-between items-center mb-2 text-xs">
                  <span className="text-amber-500 font-mono">Poem #{i + 1}</span>
                  <span className="text-amber-600 transition-transform duration-500 group-hover:rotate-90">✝</span>
                </div>

                {/* Background flicker for drama */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-amber-900/10 blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" />

                <div className={`whitespace-pre-wrap text-sm tracking-wide transition-all duration-500 ease-in-out
                  ${isSelected ? 'line-clamp-none' : 'line-clamp-4 text-amber-100/70'}
                `}>
                  {entry}
                </div>

                {isSelected && (
                  <div className="mt-4 text-xs text-amber-400/80 italic text-right animate-fade-in">
                    Click again to bury it back
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
