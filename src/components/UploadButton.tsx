type Props = {
  index: number;
  setFrames: React.Dispatch<React.SetStateAction<any[]>>;
  image: string | null;
};

export default function UploadButton({ index, setFrames, image }: Props) {
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

      {!image ? (
        <label
          htmlFor={`upload-${index}`}
          className="absolute inset-0 cursor-pointer"
          title="Click to upload your photo"
        />
      ) : (
        <label
          htmlFor={`upload-${index}`}
          className="absolute bottom-2 left-2 p-1 bg-white bg-opacity-70 rounded-md z-10 image-control cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          title="Change photo"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </label>
      )}
    </>
  );
}
