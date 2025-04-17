export default function MatchboxInventory({ onBury, onDestroy }: { onBury: () => void, onDestroy: (method: string) => void }) {
    return (
      <div className="mt-6 text-center">
        <p className="text-sm mb-3 text-amber-200 font-serif italic">
          "We don't read and write poetry because it's cute. We read and write poetry because we are members of the human race."
        </p>
        <div className="bg-stone-900/80 p-4 rounded-lg border border-amber-900/50 shadow-lg">
          <p className="text-sm mb-3 text-gray-400">Release your words to the universe:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              onClick={() => onDestroy('burn')} 
              className="bg-red-800 px-4 py-2 rounded-md hover:bg-red-700 transition-all flex items-center space-x-2"
            >
              <span className="text-lg">🔥</span>
              <span>Burn</span>
            </button>
            <button 
              onClick={() => onDestroy('crumple')}
              className="bg-yellow-800 px-4 py-2 rounded-md hover:bg-yellow-700 transition-all flex items-center space-x-2"
            >
              <span className="text-lg">🗞️</span>
              <span>Crumple</span>
            </button>
            <button 
              onClick={() => onDestroy('tear')}
              className="bg-blue-800 px-4 py-2 rounded-md hover:bg-blue-700 transition-all flex items-center space-x-2"
            >
              <span className="text-lg">✂️</span>
              <span>Tear</span>
            </button>
            <button 
              onClick={() => onDestroy('scatter')}
              className="bg-green-800 px-4 py-2 rounded-md hover:bg-green-700 transition-all flex items-center space-x-2"
            >
              <span className="text-lg">🍃</span>
              <span>Scatter</span>
            </button>
            <button 
              onClick={onBury} 
              className="bg-stone-800 px-4 py-2 rounded-md hover:bg-stone-700 transition-all flex items-center space-x-2"
            >
              <span className="text-lg">⚰️</span>
              <span>Bury</span>
            </button>
          </div>
        </div>
      </div>
    );
  }