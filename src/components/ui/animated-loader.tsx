"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "dots" | "pulse" | "spin";
}

export const AnimatedLoader = ({ 
  className, 
  size = "md", 
  variant = "default" 
}: AnimatedLoaderProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex space-x-1 justify-center items-center", className)}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={cn(
              "rounded-full bg-blue-500",
              size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <motion.div
        className={cn(
          "rounded-full bg-gradient-to-r from-blue-500 to-purple-500",
          sizeClasses[size],
          className
        )}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    );
  }

  if (variant === "spin") {
    return (
      <motion.div
        className={cn(
          "border-4 border-gray-200 border-t-blue-500 rounded-full",
          sizeClasses[size],
          className
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    );
  }

  // Default variant - animated gradient ring
  return (
    <motion.div
      className={cn(
        "rounded-full relative",
        sizeClasses[size],
        className
      )}
      animate={{ rotate: 360 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
          padding: "2px",
        }}
      >
        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full" />
      </div>
    </motion.div>
  );
};
