import React, { useEffect } from "react";

// util functions
import { rgbToHex } from "../utils/ColorConversionUtil";

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvasDropperRef: React.RefObject<HTMLCanvasElement>;
  isColorPickerActive: boolean;
  imageSrc: string;
  setIsColorPickerActive: React.Dispatch<React.SetStateAction<boolean>>;
  setDetectedColor: React.Dispatch<React.SetStateAction<string>>;
}

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  canvasDropperRef,
  isColorPickerActive,
  imageSrc,
  setIsColorPickerActive,
  setDetectedColor
}) => {

  useEffect(() => {

    const canvas = canvasRef.current;
    const canvasDropper = canvasDropperRef.current;

    const ctx = canvas?.getContext('2d');
    const ctxDropper = canvasDropper?.getContext('2d');

    if (!canvas || !canvasDropper || !ctx || !ctxDropper) return;

    const canvasImage = new Image();
    canvasImage.src = imageSrc;

    // draw canvas image
    canvasImage.onload = () => {

      // max width and height for image canvas
      const maxWidth = 1024;
      const maxHeight = 800;

      let canvasWidth = canvasImage.width;
      let canvasHeight = canvasImage.height;

      const aspectRatio = canvasWidth / canvasHeight

      // Ensure the canvasImage fits within the maximum dimensions while maintaining aspect ratio
      if (canvasWidth > maxWidth || canvasHeight > maxHeight) {
        if (aspectRatio > 1) {
          canvasWidth = maxWidth;
          canvasHeight = canvasWidth / aspectRatio;
        } else {
          canvasHeight = maxHeight;
          canvasWidth = canvasHeight * aspectRatio;
        }
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Draw the canvasImage onto the canvas
      ctx.drawImage(canvasImage, 0, 0, canvasWidth, canvasHeight);
    }

    // handle mouse move over canvas
    const handleMouseMoveOverCanvas = (event: MouseEvent) => {
      if (!isColorPickerActive || event.target !== canvas) return;

      const x = event.offsetX;
      const y = event.offsetY;
      const dropperSize = 160;
      const zoomFactor = 2

      ctxDropper.clearRect(0, 0, dropperSize, dropperSize);

      const sourceX = Math.max(0, x - dropperSize / 2 / zoomFactor);
      const sourceY = Math.max(0, y - dropperSize / 2 / zoomFactor);
      const sourceWidth = dropperSize / zoomFactor;
      const sourceHeight = dropperSize / zoomFactor;

      ctxDropper.drawImage(canvas, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, dropperSize, dropperSize);
    }

    // handle click on canvas
    const handleClickOnCanvas = (event: MouseEvent) => {
      if (!isColorPickerActive || event.target !== canvas || !canvasDropper) return;

      // get the center coordinates of the ctxDropper canvas
      const centerX = canvasDropperRef.current.width / 2;
      const centerY = canvasDropperRef.current.height / 2;

      // get the color data from the center of ctxDropper
      const pixelData = ctxDropper.getImageData(centerX, centerY, 1, 1).data;

      // convert RGB value to hex
      const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);

      // set the detected color state
      setDetectedColor(hexColor);

      // remove event listeners after color is detected
      canvas.removeEventListener('mousemove', handleMouseMoveOverCanvas);
      canvas.removeEventListener('click', handleClickOnCanvas);

      // update isColorPickerActive to false and cursor to default
      setIsColorPickerActive(!isColorPickerActive)
      document.body.style.cursor = 'default'
    }

    canvas.addEventListener('mousemove', handleMouseMoveOverCanvas)
    canvas.addEventListener('click', handleClickOnCanvas)

    // cleanup the event listeners on component unmount
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMoveOverCanvas);
      canvas.removeEventListener('click', handleClickOnCanvas);
    };

  }, [imageSrc, canvasRef, canvasDropperRef, isColorPickerActive])

  return <canvas ref={canvasRef} />
}

export default Canvas;
