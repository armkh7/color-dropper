"use client"

import {
  useState,
  useRef,
  Fragment
} from "react";
import Image from "next/image";

// components
import Canvas from "./Canvas";
import ColorPickerInfo from "./ColorPickerInfo";
import ColorPicker from "./ColorPicker";

export default function ColorDropper() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasDropperRef = useRef<HTMLCanvasElement>(null);

  // states
  const [isColorPickerActive, setIsColorPickerActive] = useState(false);
  const [detectedColor, setDetectedColor] = useState('');

  const handleColorPickerClick = () => {
    setIsColorPickerActive(!isColorPickerActive)
    document.body.style.cursor = 'crosshair'
  }

  return (
    <Fragment>
      <ColorPickerInfo
        detectedColor={detectedColor}
        handleColorPickerClick={handleColorPickerClick}
      />
      <div className="container max-w-5xl mx-auto mb-4">
        <Canvas
          canvasRef={canvasRef}
          canvasDropperRef={canvasDropperRef}
          isColorPickerActive={isColorPickerActive}
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
