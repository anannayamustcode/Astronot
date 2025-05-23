import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "frame-data";

export type FrameData = {
  x: number;
  y: number;
  image: string | null;
  imagePosition: { x: number; y: number };
  zoom: number;
  isOval: boolean;
};

export function useFrameStore() {
  const [frames, setFrames] = useState<FrameData[]>(
    Array.from({ length: 5 }, (_, i) => ({
      x: 100 + i * 150,
      y: 100 + i * 50,
      image: null,
      imagePosition: { x: 0, y: 0 },
      zoom: 1,
      isOval: false
    }))
  );

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const updated = parsed.map((frame: any) => ({
            ...frame,
            imagePosition: frame.imagePosition || { x: 0, y: 0 },
            zoom: frame.zoom || 1,
            isOval: frame.isOval || false
          }));
          setFrames(updated);
        }
      } catch (err) {
        console.error("Failed to load frames:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(frames));
  }, [frames]);

  return { frames, setFrames };
}
