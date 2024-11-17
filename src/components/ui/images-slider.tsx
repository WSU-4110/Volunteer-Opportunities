"use client";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";

export const ImagesSlider = ({
  images,
  children,
  overlay = true,
  overlayClassName,
  className,
  autoplay = true,
  direction = "up",
  words,
  currentIndex,
}: {
  images: string[];
  children: React.ReactNode;
  overlay?: React.ReactNode;
  overlayClassName?: string;
  className?: string;
  autoplay?: boolean;
  direction?: "up" | "down";
  words: { text: string; className: string }[];
  currentIndex: number;
}) => {
  const slideVariants = {
    initial: {
      opacity: 0.0,
    },
    visible: {
      opacity: 0.3,
    },
  };

  return (
    <div
      className={cn(
        "overflow-hidden w-full h-full relative flex items-center justify-center",
        className
      )}
    >
      {children}
      {overlay && (
        <div className={cn("absolute inset-0 z-[10]", overlayClassName)} />
      )}

      {
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial="initial"
          animate="visible"
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: currentIndex == images.length - 1 ? 0 : 1,
            repeatType: "reverse",
          }}
          variants={slideVariants}
          className="h-full w-full absolute inset-0 object-cover object-center z-[10]"
        />
      }
    </div>
  );
};
