"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientBorderProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  clockwise?: boolean;
}

export const AnimatedGradientBorder = ({
  children,
  className,
  containerClassName,
  borderClassName,
  duration = 4,
  clockwise = true,
}: AnimatedGradientBorderProps) => {
  return (
    <div className={cn("relative p-[1px] overflow-hidden", containerClassName)}>
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
          borderClassName
        )}
        animate={{
          rotate: clockwise ? 360 : -360,
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
        }}
      />
      <div className={cn("relative bg-white dark:bg-slate-900 rounded-inherit", className)}>
        {children}
      </div>
    </div>
  );
};
