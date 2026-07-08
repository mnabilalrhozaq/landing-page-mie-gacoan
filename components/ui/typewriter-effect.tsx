"use client";

import { cn } from "@/lib/utils";
import { motion, stagger, useAnimate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
  const wordsArray = words.map((word) => {
    return {
      ...word,
      text: word.text.split(""),
    };
  });

  const [scope, animate] = useAnimate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
        },
        {
          duration: 0.2,
          delay: stagger(0.08),
          ease: "easeInOut",
        }
      );
    }
  }, [isInView, animate]);

  return (
    <div ref={ref} className={cn("text-center inline-flex items-center", className)}>
      <motion.div ref={scope} className="inline">
        {wordsArray.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block whitespace-nowrap">
              {word.text.map((char, index) => (
                <motion.span
                  initial={{ opacity: 0, display: "none" }}
                  key={`char-${index}`}
                  className={cn(`text-dark font-body`, word.className)}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          );
        })}
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
        className={cn(
          "inline-block rounded-sm w-[3px] h-5 bg-primary ml-1 align-middle",
          cursorClassName
        )}
      />
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className={cn("flex flex-col items-center justify-center my-4 w-full px-4", className)}>
      <div className="flex items-center justify-center relative w-full sm:w-auto max-w-full">
        <motion.div
          initial={{ width: "0%" }}
          animate={isInView ? { width: "fit-content" } : { width: "0%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <h2 className="font-heading text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-dark leading-tight tracking-wide font-extrabold text-center whitespace-nowrap">
            {words.map((word, idx) => {
              return (
                <span key={`word-${idx}`} className={cn("inline-block", word.className)}>
                  {word.text}&nbsp;
                </span>
              );
            })}
          </h2>
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          className={cn(
            "inline-block rounded-sm w-[4px] h-8 md:h-12 bg-primary ml-1 align-middle",
            cursorClassName
          )}
        />
      </div>
    </div>
  );
};
