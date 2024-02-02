"use client"

import {
  useState,
  useRef,
  Fragment
} from "react";

// components
import Canvas from "./Canvas";
import ColorPickerInfo from "./ColorPickerInfo";
import ColorPicker from "./ColorPicker";
import ImageUploadButton from "./ImageUploadButton";

export default function ColorDropper() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasDropperRef = useRef<HTMLCanvasElement>(null);

  // states
  const [isColorPickerActive, setIsColorPickerActive] = useState(false);
  const [detectedColor, setDetectedColor] = useState('');
  const [imageSrc, setImageSrc] = useState('/island.jpg')

  // handle click on color picker icon
  const handleColorPickerClick = () => {
    setIsColorPickerActive(!isColorPickerActive)
    document.body.style.cursor = 'crosshair'
  }

  // handle iamge change
  const handleImageChange = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setImageSrc(imageUrl);
    setDetectedColor('')
  }

  return (
    <Fragment>
      <ImageUploadButton onImageChange={handleImageChange} />
      <ColorPickerInfo
        detectedColor={detectedColor}
        handleColorPickerClick={handleColorPickerClick}
      />
      <div className="container max-w-5xl mx-auto mb-4">
        <Canvas
          canvasRef={canvasRef}
          canvasDropperRef={canvasDropperRef}
          isColorPickerActive={isColorPickerActive}
          imageSrc={imageSrc}
          setIsColorPickerActive={setIsColorPickerActive}
          setDetectedColor={setDetectedColor}
        />
      </div>
      <ColorPicker
        isColorPickerActive={isColorPickerActive}
        canvasDropperRef={canvasDropperRef}
      />
    </Fragment>
  )
}
