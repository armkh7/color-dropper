import React, { useEffect } from "react";

interface ColorPickerProps {
  isColorPickerActive: boolean;
  canvasDropperRef: React.RefObject<HTMLCanvasElement>;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  isColorPickerActive,
  canvasDropperRef
}) => {

  useEffect(() => {

    const canvasDropper = canvasDropperRef.current;
    const ctxDropper = canvasDropper?.getContext('2d');

    if (!canvasDropper || !ctxDropper) return;

    const colorDropperImg = new Image();
    colorDropperImg.src = "/selectedColorPng.png";

    // initialize position variables
    let mouseX = 0;
    let mouseY = 0;

    // set color dropper canvas size to match image size
    canvasDropper.width = colorDropperImg.width;
    canvasDropper.height = colorDropperImg.height;

    // draw color dropper canvas
    colorDropperImg.onload = () => {
      ctxDropper.drawImage(colorDropperImg, 0, 0, canvasDropper.width, canvasDropper.height)
    }

    // update the color dropper canvas position based on mouse coordinates
    const handleMouseMove = (event: MouseEvent) => {

      mouseX = event.clientX;
      mouseY = event.clientY;

      canvasDropper.style.left = mouseX - canvasDropper.width / 2 + 'px';
      canvasDropper.style.top = mouseY - canvasDropper.height / 2 + 'px';
    };

    // add event listener for mousemove
    document.addEventListener('mousemove', handleMouseMove);

    // cleanup the event listeners on component unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    }

  }, [canvasDropperRef, isColorPickerActive])

  return (
    <canvas
      ref={canvasDropperRef}
      className={`absolute rounded-full ${
        isColorPickerActive ? "block border border-dashed" : "hidden"
      }`}
      style={{ pointerEvents: "none" }}
    />
  )
}

export default ColorPicker;
