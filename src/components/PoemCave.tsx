import { useState, useEffect } from 'react';
import '../styles/poem.css';

export default function PoemCave({ 
  poem, 
  onSubmit, 
  onDownload, 
  isAnimating, 
  destructionType 
}: { 
  poem: string, 
  onSubmit: (text: string) => void, 
  onDownload: () => void,
  isAnimating: boolean,
  destructionType: string
}) {
  const [input, setInput] = useState('');
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isAnimating && destructionType) {
      setAnimationClass(`poem-${destructionType}`);
    } else {
      setAnimationClass('');
    }
  }, [isAnimating, destructionType]);

  return (
    <div className="w-full max-w-xl bg-stone-900/70 p-6 rounded-xl shadow-xl border border-amber-900/50">
      <h2 className="text-xl font-serif mb-4 text-center text-amber-100">Cave of Whispers</h2>
      
      {!poem ? (
        <>
          <textarea
            className="w-full h-40 bg-[#1a1a1a] border border-amber-700/50 p-4 text-lg font-serif text-amber-50 resize-none rounded-md shadow-inner focus:ring-2 focus:ring-amber-500 focus:outline-none"
            placeholder="Write your soul here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex justify-center mt-4">
            <button
              className="px-6 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-600 transition-colors shadow-md"
              onClick={() => onSubmit(input)}
            >
              Transform into Poetry
            </button>
          </div>
        </>
      ) : (
        <div className={`bg-[#282216] p-6 rounded-md text-lg font-serif whitespace-pre-wrap border border-amber-800/50 relative shadow-inner ${animationClass}`}>
          <div className="poetic-font text-amber-100">
            {poem}
          </div>
          {!isAnimating && (
            <div className="absolute top-3 right-3 space-x-2">
              <button 
                onClick={onDownload} 
                className="text-xs px-3 py-1 bg-green-800 rounded hover:bg-green-700 transition-colors shadow-md"
              >
                Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}