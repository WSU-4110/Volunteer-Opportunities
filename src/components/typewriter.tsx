"use client";

import { useState } from "react";
import { ImagesSlider } from "./ui/images-slider";
import { TypewriterEffectDeleting } from "./ui/typewriter-effect";

const typewriter = () => {
  const handleIndexChange = () => {
    setCurrentIndex((prevState) => prevState + 1);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const words = [
    { text: "", className: "" },
    { text: "", className: "" },
    { text: "", className: "" },
    {
      text: "Whirlwind",
      className: "text-whirlwindDarkBlue",
    },
  ];

  const images = [
    //need to add images
  ];
  return (
    <ImagesSlider
      images={images}
      className="h-[80vh]"
      words={words}
      currentIndex={currentIndex}
    >
      <div className="relative z-[30] w-full">
        <div className="relative block m-auto text-center">
          <div className="inline-block text-5xl xl:text-8xl font-bold text-black">
            Volunteers are&nbsp;
            <TypewriterEffectDeleting
              words={words}
              handleIndexChange={handleIndexChange}
            />
          </div>
        </div>
      </div>
    </ImagesSlider>
  );
};

export default typewriter;
