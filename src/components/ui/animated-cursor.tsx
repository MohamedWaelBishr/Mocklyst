"use client";
import React, { useEffect, useRef } from "react";

interface AnimatedCursorProps {
  className?: string;
  innerSize?: number;
  outerSize?: number;
  color?: string;
  outerAlpha?: number;
  innerScale?: number;
  outerScale?: number;
}

export const AnimatedCursor = ({
  className = "",
  innerSize = 8,
  outerSize = 40,
  color = "59, 130, 246", // RGB for blue-500
  outerAlpha = 0.2,
  innerScale = 0.7,
  outerScale = 1.4
}: AnimatedCursorProps) => {
  const cursorOuterRef = useRef<HTMLDivElement>(null);
  const cursorInnerRef = useRef<HTMLDivElement>(null);
  


  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorOuterRef.current && cursorInnerRef.current) {
        cursorOuterRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorInnerRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const handleMouseOver = () => {
      if (cursorInnerRef.current && cursorOuterRef.current) {
        cursorInnerRef.current.style.transform += ` scale(${innerScale})`;
        cursorOuterRef.current.style.transform += ` scale(${outerScale})`;
      }
    };

    const handleMouseOut = () => {
      if (cursorInnerRef.current && cursorOuterRef.current) {
        cursorInnerRef.current.style.transform = cursorInnerRef.current.style.transform.replace(` scale(${innerScale})`, "");
        cursorOuterRef.current.style.transform = cursorOuterRef.current.style.transform.replace(` scale(${outerScale})`, "");
      }
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseenter", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseOut);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseOut);
    };
  }, [innerScale, outerScale]);

  if (typeof window !== "undefined" && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return null; // Don't show on mobile devices
  }

  return (
    <div className={className}>
      <div
        ref={cursorOuterRef}
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full mix-blend-difference"
        style={{
          width: outerSize,
          height: outerSize,
          backgroundColor: `rgba(${color}, ${outerAlpha})`,
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s, height 0.3s",
        }}
      />
      <div
        ref={cursorInnerRef}
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full mix-blend-difference"
        style={{
          width: innerSize,
          height: innerSize,
          backgroundColor: `rgb(${color})`,
          transform: "translate(-50%, -50%)",
          transition: "width 0.3s, height 0.3s",
        }}
      />
    </div>
  );
};
