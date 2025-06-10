"use client";
import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

export const MovingBorder = ({
  children,
  duration = 3000,
  rx,
  ry,
  className,
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  className?: string;
  [key: string]: any;
}) => {
  const pathRef = useRef<any>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <div className={`relative overflow-hidden ${className}`} {...otherProps}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
      >
        <rect
          fill="none"
          width="100%"
          height="100%"
          rx={rx}
          ry={ry}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
      </motion.div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const Button = ({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  duration,
  className,
  ...otherProps
}: {
  borderRadius?: string;
  children: React.ReactNode;
  as?: any;
  containerClassName?: string;
  duration?: number;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <Component
      className={`bg-transparent relative text-xl h-16 w-40 p-[1px] overflow-hidden ${containerClassName}`}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}
    >
      <MovingBorder duration={duration} rx="30%" ry="30%">
        <div
          className={`h-full w-full flex items-center justify-center bg-slate-900/[0.8] text-white border-neutral-200 dark:border-slate-800 ${className}`}
          style={{
            borderRadius: `calc(${borderRadius} * 0.96)`,
          }}
        >
          {children}
        </div>
      </MovingBorder>
    </Component>
  );
};
