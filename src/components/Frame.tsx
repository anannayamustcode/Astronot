type Props = {
  index: number;
  setFrames: React.Dispatch<React.SetStateAction<any[]>>;
  image: string | null;
};

export default function ImageUploaderWithControls({ index, setFrames, image }: Props) {
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFrames(prev =>
        prev.map((f, i) =>
          i === index
            ? {
                ...f,
                image: result,
                imagePosition: { x: 0, y: 0 },
                zoom: 1,
              }
            : f
        )
      );
    };
    reader.readAsDataURL(file);
  };

  const update = (cb: (frame: any) => any) => {
    setFrames(prev => prev.map((f, i) => (i === index ? cb(f) : f)));
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={`upload-${index}`}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
        }}
      />

      {/* Upload label */}
      {!image ? (
        <label
          htmlFor={`upload-${index}`}
          className="absolute inset-0 cursor-pointer"
          title="Click to upload your photo"
        />
      ) : (
        <>
          <label
            htmlFor={`upload-${index}`}
            className="absolute bottom-2 left-2 p-1 bg-white bg-opacity-70 rounded-md z-10 image-control cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            title="Change photo"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </label>

          {/* Image controls */}
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
        </>
      )}
    </>
  );
}
