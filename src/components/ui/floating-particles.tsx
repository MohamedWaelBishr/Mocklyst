"use client";
import React from "react";
import { motion } from "framer-motion";

interface FloatingParticlesProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
}

export const FloatingParticles = ({
  className = "",
  particleCount = 50,
  colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"]
}: FloatingParticlesProps) => {
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    size: Math.random() * 4 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-30"
          style={{
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
