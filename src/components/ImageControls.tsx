type Props = {
  index: number;
  setFrames: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function ImageControls({ index, setFrames }: Props) {
  const update = (cb: (frame: any) => any) => {
    setFrames(prev => prev.map((f, i) => (i === index ? cb(f) : f)));
  };

  return (
    <div className="absolute bottom-2 right-2 flex space-x-1 bg-black bg-opacity-50 rounded-md p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <button
        className="w-6 h-6 bg-white bg-opacity-70 rounded-md flex items-center justify-center text-black text-lg image-control"
        onClick={(e) => {
          e.stopPropagation();
          update(f => ({ ...f, zoom: Math.max(f.zoom - 0.1, 0.5) }));
        }}
      >
        -
      </button>
      <button
        className="w-6 h-6 bg-white bg-opacity-70 rounded-md flex items-center justify-center text-black text-lg image-control"
        onClick={(e) => {
          e.stopPropagation();
          update(f => ({ ...f, zoom: Math.min(f.zoom + 0.1, 3) }));
        }}
      >
        +
      </button>
      <button
        className="w-6 h-6 bg-white bg-opacity-70 rounded-md flex items-center justify-center text-red-600 text-lg image-control"
        onClick={(e) => {
          e.stopPropagation();
          update(f => ({ ...f, image: null }));
        }}
      >
        ×
      </button>
      <button
        className="w-6 h-6 bg-white bg-opacity-70 rounded-md flex items-center justify-center text-black image-control"
        onClick={(e) => {
          e.stopPropagation();
          update(f => ({ ...f, isOval: !f.isOval }));
        }}
      >
        O
      </button>
    </div>
  );
}
