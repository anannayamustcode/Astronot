"use client";
import { useState, useRef, useEffect } from "react";

const LOCAL_STORAGE_KEY = "frame-data";

export default function Page() {
  const [frames, setFrames] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      x: 100 + i * 150,
      y: 100 + i * 50,
      image: null as string | null,
      imagePosition: { x: 0, y: 0 },
      zoom: 1,
      isOval: false
    }))
  );

  const draggingIndex = useRef<number | null>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const isDraggingImage = useRef(false);
  
  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Make sure any old saved data has the new properties
          const updatedFrames = parsed.map(frame => ({
            ...frame,
            imagePosition: frame.imagePosition || { x: 0, y: 0 },
            zoom: frame.zoom || 1,
            isOval: frame.isOval || false
          }));
          setFrames(updatedFrames);
        }
      } catch (err) {
        console.error("Failed to load frame data:", err);
      }
    }
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(frames));
  }, [frames]);

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    // Prevent dragging the frame when adjusting the image
    if ((e.target as HTMLElement).classList.contains('image-control')) {
      return;
    }
    
    draggingIndex.current = index;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingIndex.current === null) return;
    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;

    setFrames((prev) =>
      prev.map((frame, i) =>
        i === draggingIndex.current
          ? { ...frame, x: frame.x + dx, y: frame.y + dy }
          : frame
      )
    );
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    draggingIndex.current = null;
    isDraggingImage.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleImageMove);
  };

  const handleImageUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFrames((prev) =>
        prev.map((frame, i) =>
          i === index ? { 
            ...frame, 
            image: result,
            imagePosition: { x: 0, y: 0 },
            zoom: 1
          } : frame
        )
      );
    };
    reader.readAsDataURL(file);
  };

  // Image positioning handlers
  const handleImageMouseDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    isDraggingImage.current = true;
    draggingIndex.current = index;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    document.addEventListener("mousemove", handleImageMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleImageMove = (e: MouseEvent) => {
    if (!isDraggingImage.current || draggingIndex.current === null) return;
    
    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;

    setFrames((prev) =>
      prev.map((frame, i) =>
        i === draggingIndex.current
          ? { 
              ...frame, 
              imagePosition: { 
                x: frame.imagePosition.x + dx, 
                y: frame.imagePosition.y + dy 
              } 
            }
          : frame
      )
    );
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  // Zoom handlers
  const handleZoomIn = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFrames((prev) =>
      prev.map((frame, i) =>
        i === index
          ? { ...frame, zoom: Math.min(frame.zoom + 0.1, 3) }
          : frame
      )
    );
  };

  const handleZoomOut = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFrames((prev) =>
      prev.map((frame, i) =>
        i === index
          ? { ...frame, zoom: Math.max(frame.zoom - 0.1, 0.5) }
          : frame
      )
    );
  };

  const toggleOvalShape = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFrames((prev) =>
      prev.map((frame, i) =>
        i === index
          ? { ...frame, isOval: !frame.isOval }
          : frame
      )
    );
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/assets/room.jpg')",
        backgroundPositionY: "1%",
        backgroundSize: "110%",
      }}
    >
      {frames.map((frame, i) => (
        <div
          key={i}
          className="absolute w-[150px] h-[200px] cursor-grab active:cursor-grabbing group"
          style={{ left: frame.x, top: frame.y }}
          onMouseDown={(e) => handleMouseDown(i, e)}
        >
          {/* User uploaded image inside frame with position and zoom controls */}
          {frame.image && (
            <div className="absolute inset-0 overflow-hidden rounded-md">
              <img
                src={frame.image}
                alt="User upload"
                className={`absolute object-cover image-control cursor-move ${frame.isOval ? "rounded-full" : ""}`}
                style={{ 
                  width: `${frame.zoom * 100}%`, 
                  height: `${frame.zoom * 100}%`,
                  transform: `translate(${frame.imagePosition.x}px, ${frame.imagePosition.y}px)`,
                  transformOrigin: 'center',
                  aspectRatio: frame.isOval ? "3/4" : "auto"
                }}
                onMouseDown={(e) => handleImageMouseDown(i, e)}
                draggable={false}
              />
              
              {/* Controls that appear on hover */}
              <div className="absolute bottom-2 right-2 flex space-x-1 bg-black bg-opacity-50 rounded-md p-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  className="w-6 h-6 bg-white bg-opacity-70 rounded-md flex items-center justify-center text-black text-lg image-control"
                  onClick={(e) => handleZoomOut(i, e)}
                  title="Zoom out"
                >
                  -
                </button>
                <button 
                  className="w-6 h-6 bg-white bg-opacity-70 rounded-md flex items-center justify-center text-black text-lg image-control"
                  onClick={(e) => handleZoomIn(i, e)}
                  title="Zoom in"
                >
                  +
                </button>
                  <button 
                className="w-6 h-6 bg-white bg-opacity-70 rounded-md flex items-center justify-center text-red-600 text-lg image-control"
                onClick={(e) => {
                  e.stopPropagation();
                  setFrames(prev => prev.map((frame, idx) =>
                    idx === i ? { ...frame, image: null } : frame
                  ));
                }}
                title="Remove image"
              >
                ×
              </button>
                            </div>
              
              {/* Oval toggle button */}
              <button
                className="absolute top-2 right-2 w-6 h-6 bg-white bg-opacity-70 rounded-md flex items-center justify-center text-black image-control opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => toggleOvalShape(i, e)}
                title="Toggle oval shape"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="12" cy="12" rx="8" ry="10" />
                </svg>
              </button>
            </div>
          )}

          {/* Frame decoration */}
          <img
            src={`/assets/frame${i + 1}.png`}
            alt={`Frame ${i + 1}`}
            className="absolute w-full h-full object-contain pointer-events-none"
            draggable={false}
          />

          {/* Upload input (hidden) */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id={`upload-${i}`}
            onChange={(e) =>
              e.target.files && handleImageUpload(i, e.target.files[0])
            }
          />
          
          {/* Label that triggers the input */}
          {!frame.image ? (
            <label
              htmlFor={`upload-${i}`}
              className="absolute inset-0 cursor-pointer"
              title="Click to upload your photo"
            />
          ) : (
            <label
              htmlFor={`upload-${i}`}
              className="absolute bottom-2 left-2 p-1 bg-white bg-opacity-70 rounded-md z-10 image-control cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              title="Change photo"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </label>
          )}
        </div>
      ))}
    </div>
  );
}

// import dynamic from "next/dynamic";

// const FrameCanvas = dynamic(() => import("@/components/FrameCanvas"), { ssr: false });

// export default function Page() {
//   return <FrameCanvas />;
// }
