import React, { Fragment } from "react";
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
    <div className="flex relative justify-center items-center container max-w-5xl mx-auto py-4 min-h-[60px]">
      <Image
        src="/iconColorPicker.svg"
        width={24}
        height={24}
        alt="Color picker icon"
        className="absolute left-0 cursor-pointer"
        onClick={() => handleColorPickerClick()}
      />
      {
        detectedColor && (
          <Fragment>
            <p className="mr-2 my-0 text-gray-800">{detectedColor}</p>
            <div
              className={`w-6 h-6 border border-gray-400 rounded-full`}
              style={{ backgroundColor: detectedColor }}
            ></div>
          </Fragment>
        )
      }
    </div>
  )
}

export default ColorPickerInfo;
