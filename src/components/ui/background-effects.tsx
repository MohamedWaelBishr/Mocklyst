"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const GridAndDotBackgrounds = ({
  className,
  ...rest
}: {
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 w-full h-full bg-dot-black/[0.2] dark:bg-dot-white/[0.2] flex items-center justify-center",
        className
      )}
      {...rest}
    >
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
};

export const Boxes = React.memo(
  ({ className, ...rest }: { className?: string }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    const rows = new Array(150).fill(1);
    const cols = new Array(100).fill(1);
    const colors = [
      "#93c5fd",
      "#f9a8d4",
      "#86efac",
      "#fde047",
      "#fca5a5",
      "#d8b4fe",
      "#93c5fd",
      "#a5b4fc",
      "#c4b5fd",
    ];

    // Use deterministic color selection to avoid hydration mismatch
    const getColorForPosition = (i: number, j: number) => {
      const index = (i * 100 + j) % colors.length;
      return colors[index];
    };
    return (
      <div
        style={{
          transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
        }}
        className={cn(
          "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4 opacity-30",
          className
        )}
        {...rest}
      >
        {rows.map((_, i) => (
          <motion.div
            key={`row` + i}
            className="relative h-8 w-16 border-l border-slate-700/50 dark:border-slate-300/20"
          >
            {cols.map((_, j) => (
              <motion.div
                whileHover={{
                  backgroundColor: isClient
                    ? getColorForPosition(i, j)
                    : "#93c5fd",
                  transition: { duration: 0 },
                }}
                animate={{
                  transition: { duration: 2 },
                }}
                key={`col` + j}
                className="relative h-8 w-16 border-t border-r border-slate-700/50 dark:border-slate-300/20"
              >
                {j % 2 === 0 && i % 2 === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-700/30 dark:text-slate-300/10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                ) : null}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    );
  }
);

Boxes.displayName = "Boxes";