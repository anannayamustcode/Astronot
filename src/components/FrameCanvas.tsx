"use client";
import Frame from "./Frame";
import { useFrameStore } from "./useFrameStore";

export default function FrameCanvas() {
  const { frames, setFrames } = useFrameStore();

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: "url('/assets/room.jpeg')",
        backgroundPositionY: "1%",
        backgroundSize: "110%",
      }}
    >
      {frames.map((frame, i) => (
        <Frame key={i} index={i} data={frame} setFrames={setFrames} />
      ))}
    </div>
  );
}
