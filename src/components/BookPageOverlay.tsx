import { useState } from 'react';
import '../styles/poem.css';

export default function BookPageOverlay({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [marginNote, setMarginNote] = useState('');
  
  return (
    <div className="w-full max-w-3xl bg-[#e8dcbf] p-8 rounded-lg shadow-xl relative book-page">
      <div className="book-content relative">
        {/* Book text */}
        <div className="font-serif text-stone-800 leading-relaxed mb-8">
          <h3 className="text-xl mb-4 text-center">Poetry</h3>
          <p className="mb-3 text-justify">
            "We don't read and write poetry because it's cute. We read and write poetry because we are members of the human race. And the human race is filled with passion. And medicine, law, business, engineering, these are noble pursuits and necessary to sustain life. But poetry, beauty, romance, love, these are what we stay alive for."
          </p>
          <p className="mb-3 text-justify">
            "To quote from Whitman, 'O me! O life!... of the questions of these recurring; of the endless trains of the faithless... of cities filled with the foolish; what good amid these, O me, O life?' Answer: that you are here; that life exists, and identity; that the powerful play goes on and you may contribute a verse."
          </p>
          <p className="text-justify italic">
            "What will your verse be?"
          </p>
        </div>
        
        {/* Margin notes area */}
        <div className="margin-notes ml-4 mr-0 pl-6 border-l border-amber-900/30">
          <textarea
            className="w-full h-40 bg-[#e8dcbf] border-b border-amber-800/30 p-2 text-stone-800 font-serif italic resize-none focus:outline-none focus:border-amber-800/50 handwritten"
            placeholder="Write your thoughts in the margin..."
            value={marginNote}
            onChange={(e) => setMarginNote(e.target.value)}
            style={{ background: 'transparent' }}
          />
          
          <div className="flex justify-end mt-2">
            <button
              className="px-4 py-1 bg-amber-800 text-white rounded hover:bg-amber-700 transition-colors text-sm"
              onClick={() => onSubmit(marginNote)}
            >
              Transform into Poetry
            </button>
          </div>
        </div>
      </div>
      
      {/* Page texture and details */}
      <div className="absolute inset-0 pointer-events-none book-texture rounded-lg"></div>
      <div className="absolute left-12 top-0 bottom-0 w-6 bg-[#d8ccaf]/50 rounded-l-lg page-binding pointer-events-none"></div>
      <div className="absolute right-6 top-6 bottom-6 w-1 bg-gradient-to-r from-[#d8ccaf]/0 to-[#8a7952]/10 pointer-events-none"></div>
    </div>
  );
}