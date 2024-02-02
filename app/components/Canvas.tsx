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
      const sourceWidth = Math.min(canvas.width - sourceX, dropperSize / zoomFactor);
      const sourceHeight = Math.min(canvas.height - sourceY, dropperSize / zoomFactor);

      ctxDropper.drawImage(canvas, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, dropperSize, dropperSize);

      // get the color information from the pixel
      const pixel = ctxDropper.getImageData(dropperSize / 2, dropperSize / 2, 1, 1).data;
      const hexColor = rgbToHex(pixel[0], pixel[1], pixel[2]);

      // display hex color string on the ctxDropper with white background
      const textY = dropperSize - 30;
      const textPadding = 5;
      const textWidth = ctxDropper.measureText(hexColor).width + 2 * textPadding;
      const borderRadius = 10;
      const rectHeight = 20;

      const textX = (ctxDropper.canvas.width - textWidth) / 2

      ctxDropper.fillStyle = "#fff";
      ctxDropper.beginPath();
      ctxDropper.moveTo(textX - textPadding + borderRadius, textY - rectHeight / 2);
      ctxDropper.lineTo(textX + textWidth + textPadding - borderRadius, textY - rectHeight / 2);
      ctxDropper.arcTo(textX + textWidth + textPadding, textY - rectHeight / 2, textX + textWidth + textPadding, textY, borderRadius);
      ctxDropper.lineTo(textX + textWidth + textPadding, textY + rectHeight / 2 - borderRadius);
      ctxDropper.arcTo(textX + textWidth + textPadding, textY + rectHeight / 2, textX + textWidth + textPadding - borderRadius, textY + rectHeight / 2, borderRadius);
      ctxDropper.lineTo(textX - textPadding + borderRadius, textY + rectHeight / 2);
      ctxDropper.arcTo(textX - textPadding, textY + rectHeight / 2, textX - textPadding, textY + rectHeight / 2 - borderRadius, borderRadius);
      ctxDropper.lineTo(textX - textPadding, textY - rectHeight / 2 + borderRadius);
      ctxDropper.arcTo(textX - textPadding, textY - rectHeight / 2, textX - textPadding + borderRadius, textY - rectHeight / 2, borderRadius);
      ctxDropper.closePath();
      ctxDropper.fill();

      ctxDropper.font = "14px Arial";
      ctxDropper.fillStyle = "#000"; // Set color for the text
      ctxDropper.fillText(hexColor, textX + textPadding, textY + textPadding);
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
