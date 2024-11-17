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
    { text: "Kind", className: "text-lime-700" },
    { text: "Selfless", className: "text-lime-700" },
    { text: "Thoughtful", className: "text-lime-700" },
    {
      text: "Priceless",
      className: "text-blue-700",
    },
  ];

  const images = [
    "/volunteer1.jpg",
    "/volunteer2.jpg",
    "/volunteer3.jpg",
    "/volunteer4.jpg",
  ];
  return (
    <ImagesSlider
      images={images}
      className="h-[50vh]"
      words={words}
      currentIndex={currentIndex}
      overlayClassName="bg-sky-200"
    >
      <div className="relative z-[30] w-full">
        <div className="relative block m-auto text-center">
          <div className="inline-block text-5xl xl:text-8xl text-black">
            Volunteers are&nbsp;
            <TypewriterEffectDeleting
              words={words}
              handleIndexChange={handleIndexChange}
            />
            <div className="font-medium font-bold text-[30pt]">
              Welcome to Volunteer Opportunites
            </div>
            <div className="font-medium text-[12pt] text-center">
              “It's easy to make a buck. It's a lot tougher to make a
              difference.”
              <br></br>
              -Tom Brokaw
            </div>
          </div>
        </div>
      </div>
    </ImagesSlider>
  );
};

export default typewriter;
