"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect, useState } from "react";

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
          width: "fit-content",
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView]);

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{}}
                  key={`char-${index}`}
                  className={cn(
                    `dark:text-white text-black opacity-0 hidden`,
                    word.className
                  )}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
    );
  };
  return (
    <div
      className={cn(
        "text-base sm:text-xl md:text-3xl lg:text-5xl font-bold text-center",
        className
      )}
    >
      {renderWords()}
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};

export const TypewriterEffectDeleting = ({
  words,
  className,
  cursorClassName,
  handleIndexChange,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
  handleIndexChange: () => void;
}) => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (isInView) {
      const cycleWords = async () => {
        if (currentWordIndex >= words.length) {
          return;
        }
        const word = words[currentWordIndex].text.split("");
        for (let i = 0; i < word.length; i++) {
          await animate(
            `span.char-${i}`,
            { opacity: 1, display: "inline" },
            { duration: 0.1, ease: "easeInOut" }
          );
        }

        if (!isDeleting) {
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before deleting
          setIsDeleting(true);
        }

        if (isDeleting) {
          if (currentWordIndex == words.length - 1) {
            return;
          }
          for (let i = word.length - 1; i >= 0; i--) {
            await animate(
              `span.char-${i}`,
              { opacity: 0, display: "none" },
              { duration: 0.1, ease: "easeInOut" }
            );
          }

          setIsDeleting(false);

          setCurrentWordIndex((prev) => prev + 1);
          handleIndexChange();
        }
      };

      cycleWords();
    }
  }, [isInView, currentWordIndex, isDeleting]);

  const renderWords = () => {
    const word = words[currentWordIndex].text.split("");
    return (
      <motion.div ref={scope} className="inline">
        {word.map((char, index) => (
          <motion.span
            key={`char-${index}`}
            className={cn(
              `char-${index} dark:text-white text-black opacity-0 hidden`,
              words[currentWordIndex].className
            )}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("text-center inline-flex", className)}>
      <div
        className="text:5xl xl:text-8xl font-bold"
        style={{
          whiteSpace: "nowrap",
        }}
      >
        {renderWords()}
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Math.ceil(
            (words.reduce((acc, curr) => {
              return acc + curr.text.length * 0.1;
            }, 0) *
              2) /
              0.8 +
              (2 / 0.8) * words.length
          ),
          repeatType: "reverse",
        }}
        onAnimationComplete={() => {
          setIsAnimating(false);
        }}
        className={cn(
          "inline-block rounded-sm w-[4px] h-10 lg:h-[5.2rem] bg-blue-500",
          cursorClassName,
          !isAnimating ? "hidden" : ""
        )}
      ></motion.span>
    </div>
  );
};

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string;
    className?: string;
  }[];
  className?: string;
  cursorClassName?: string;
}) => {
  // split text inside of words into array of characters
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });
  const renderWords = () => {
    return (
      <div>
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.map((char, index) => (
                <span
                  key={`char-${index}`}
                  className={cn(`dark:text-white text-black `, word.className)}
                >
                  {char}
                </span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("flex space-x-1 my-6", className)}>
      <motion.div
        className="overflow-hidden pb-2"
        initial={{
          width: "0%",
        }}
        whileInView={{
          width: "fit-content",
        }}
        transition={{
          duration: 2,
          ease: "linear",
          delay: 1,
        }}
      >
        <div
          className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl font-bold"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          {renderWords()}{" "}
        </div>{" "}
      </motion.div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,

          repeat: Math.ceil(
            (words.reduce((acc, curr) => {
              return acc + curr.text.length * 0.1;
            }, 0) *
              2) /
              0.8 +
              (2 / 0.8) * words.length
          ),
          repeatType: "reverse",
        }}
        className={cn(
          "inline-block rounded-sm w-[4px]  h-4 sm:h-6 xl:h-12 bg-blue-500",
          cursorClassName
        )}
      ></motion.span>
    </div>
  );
};
