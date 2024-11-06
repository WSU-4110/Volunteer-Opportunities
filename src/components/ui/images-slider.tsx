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
      opacity: 0.2,
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
        <div className={cn("absolute inset-0 z-[20]", overlayClassName)} />
      )}

      {
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          initial="initial"
          animate="visible"
          transition={{
            duration: 2,
            ease: [0.42, 0, 0.58, 1],
          }}
          variants={slideVariants}
          className="h-full w-full absolute inset-0 object-cover object-center z-[10]"
        />
      }
    </div>
  );
};
