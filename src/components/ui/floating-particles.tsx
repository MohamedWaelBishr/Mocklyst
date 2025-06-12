"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

interface FloatingParticlesProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
}

interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  animateX: number;
}

// Seeded random number generator for consistent SSR/client rendering
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const FloatingParticles = ({
  className = "",
  particleCount = 50,
  colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"],
}: FloatingParticlesProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false); // Memoize colors to prevent unnecessary re-renders
  const memoizedColors = useMemo(() => colors, [colors]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Generate particles with seeded random values for consistency
    const generatedParticles = Array.from({ length: particleCount }, (_, i) => {
      const seed = i * 12345; // Use index as seed for consistency
      return {
        id: i,
        initialX: seededRandom(seed + 1) * 100,
        initialY: seededRandom(seed + 2) * 100,
        size: seededRandom(seed + 3) * 4 + 2,
        color:
          memoizedColors[
            Math.floor(seededRandom(seed + 4) * memoizedColors.length)
          ],
        duration: seededRandom(seed + 5) * 20 + 10,
        delay: seededRandom(seed + 6) * 5,
        animateX: seededRandom(seed + 7) * 100 - 50,
      };
    });

    setParticles(generatedParticles);
  }, [isClient, particleCount, memoizedColors]);

  // Don't render particles until client-side to prevent hydration mismatch
  if (!isClient || particles.length === 0) {
    return (
      <div
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      />
    );
  }
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
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
            x: [0, particle.animateX, 0],
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
