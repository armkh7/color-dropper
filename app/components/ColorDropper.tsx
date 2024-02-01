"use client"

import {
  useEffect,
  useState,
  useRef,
  Fragment
} from "react";

export default function ColorDropper() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasDropperRef = useRef<HTMLCanvasElement>(null);

  // states
  const [isHovered, setIsHovered] = useState(false);
  const [isColorPickerActive, setIsColorPickerActive] = useState(false);
  const [detectedColor, setDetectedColor] = useState('');

  useEffect(() => {

    const canvas = canvasRef.current;
    const canvasDropper = canvasDropperRef.current;

    const ctx = canvas?.getContext('2d');
    const ctxDropper = canvasDropper?.getContext('2d')

    if (!ctx || !ctxDropper) return;

    const canvasImage = new Image();
    canvasImage.src = '/island.jpg';

    const colorDropperImg = new Image();
    colorDropperImg.src = "/selectedColorPng.png";

    if (canvas && canvasDropper) {

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

        // Get the center coordinates of the ctxDropper canvas
        const centerX = canvasDropperRef.current.width / 2;
        const centerY = canvasDropperRef.current.height / 2;

        // get the color data from the center of ctxDropper
        const pixelData = ctxDropper.getImageData(centerX, centerY, 1, 1).data;

        // convert RGB value to hex
        const hexColor = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);

        // set the detected color state
        setDetectedColor(hexColor);
      }

      // convert RGB values to hex
      const componentToHex = (c: number): string => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }

      const rgbToHex = (r: number, g: number, b: number): string => {
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
      }

      canvas.addEventListener('mousemove', handleMouseMoveOverCanvas)
      canvas.addEventListener('click', handleClickOnCanvas)

      // cleanup the event listener on component unmount
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [canvasRef, canvasDropperRef, isColorPickerActive])

  const handleColorPickerClick = () => {
    setIsColorPickerActive(!isColorPickerActive)
    document.body.style.cursor = 'crosshair'
  }

  return (
    <Fragment>
      <div className="flex items-center container max-w-5xl mx-auto py-4">
        <div className="mr-auto">
          <img
            src="/iconColorPicker.svg"
            width={20}
            height={20}
            alt="Color picker icon"
            className="cursor-pointer"
            onClick={() => handleColorPickerClick()}
          />
        </div>
        <div className="mx-auto">
          {
            detectedColor && (
              <div className="flex items-center">
                <p className="mr-2 text-gray-800">{detectedColor}</p>
                <div
                  className={`w-6 h-6 border border-gray-400 rounded-full`}
                  style={{ backgroundColor: detectedColor }}
                ></div>
              </div>
            )
          }
        </div>
        <div className="ml-auto"></div>
      </div>
      <div className="container max-w-5xl mx-auto mb-4">
        <canvas
          ref={canvasRef}
        />
      </div>
      <canvas
        ref={canvasDropperRef}
        className={`absolute rounded-full ${isColorPickerActive ? 'block' : 'hidden'}`}
        style={{ pointerEvents: 'none' }}
      />
    </Fragment>
  )
}
