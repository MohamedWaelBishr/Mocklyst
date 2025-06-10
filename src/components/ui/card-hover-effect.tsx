"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const CardHoverEffect = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        translateY: -8,
        rotateX: 5,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/30 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
      {...props}
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
      
      {/* Border glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl border border-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
