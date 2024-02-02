import React from "react";
import Image from "next/image";

interface ColorPickerInfoProps {
  detectedColor: string;
  handleColorPickerClick: () => any;
}

const ColorPickerInfo: React.FC<ColorPickerInfoProps> = ({
  detectedColor,
  handleColorPickerClick
}) => {
  return (
    <div className="flex items-center container max-w-5xl mx-auto py-4">
      <div className="mr-auto flex">
        <Image
          src="/iconColorPicker.svg"
          width={24}
          height={24}
          alt="Color picker icon"
          className="cursor-pointer"
          onClick={() => handleColorPickerClick()}
        />
      </div>
      <div className="mx-auto">
        {
          detectedColor && (
            <div className="flex items-center">
              <p className="mr-2 my-0 text-gray-800">{detectedColor}</p>
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
  )
}

export default ColorPickerInfo;
