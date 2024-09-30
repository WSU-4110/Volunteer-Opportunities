// This code was provided from a combination of shadcn-ui (https://ui.shadcn.com/docs/components/navigation-menu),
// and aceternity ui (https://ui.aceternity.com/components/navbar-menu). The chevron component came from shadcn-ui.
// The animation that flips the Chevron 180% when the navbar item is being hovered or focused also came from shadcn. The rest of the navbar came from Aceternity ui.
// This includes the boxes of links that appear underneath the navbar when hovering over different parts of the navbar, along with the animations for those boxes when you drag the cursor across the navbar.
// The profile item styling with the user image on the left and the username and email on the right also came from aceternity ui.

"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  className,
  itemsClassName,
  chevronClassName,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  className?: string;
  itemsClassName?: string;
  chevronClassName?: string;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <div
        className={cn(
          `cursor-pointer flex-row group inline-flex w-max items-center justify-center rounded-md px-6 text-lg transition-colors hover:bg-transparent hover:text-accent-foreground focus:bg-transparent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
            active == item ? "bg-transparent" : ""
          }`,
          className
        )}
      >
        <motion.p
          transition={{ duration: 0.3 }}
          className={cn("", itemsClassName)}
        >
          {item}
        </motion.p>
        <ChevronDown
          className={cn(
            `relative top-[50%] ml-1 h-3 w-3 transition duration-200 ${
              active == item ? "rotate-180" : ""
            }`,
            chevronClassName
          )}
          aria-hidden="true"
        />
      </div>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_0.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-white backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] shadow-xl"
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="w-max max-w-[350px] h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative rounded-full border border-transparent bg-transparent flex justify-center items-center space-x-4 px-8 py-6 "
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  src,
}: {
  title: string;
  description: string;
  src: string;
}) => {
  return (
    <div className="flex space-x-2">
      <img
        src={src}
        width={"140px"}
        height={"70px"}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black ">{title}</h4>
        <p className="text-neutral-700 text-sm">{description}</p>
      </div>
    </div>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link {...rest} className="text-neutral-700  hover:text-black\">
      {children}
    </Link>
  );
};
