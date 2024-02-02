import React, { useRef } from "react";

interface ImageUploadButtonProps {
  onImageChange: (file: File) => void;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({ onImageChange }) => {

  const changeImageInput = useRef<HTMLInputElement>(null);

  // handle image change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  // handle click on image change button 
  const handleClick = () => {
    changeImageInput.current?.click();
  };

  return(
    <div className="flex max-w-5xl justify-center align-center mx-auto">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleClick}
      >
        Change Image
      </button>
      <input
        ref={changeImageInput}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export default ImageUploadButton;
