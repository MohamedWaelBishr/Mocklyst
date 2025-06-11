"use client";
import React from "react";
import { Button } from "./button";
import { MovingBorder } from "./moving-border";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  movingBorder?: boolean;
  borderClassName?: string;
  duration?: number;
  isLoading?: boolean;
}

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(
  (
    {
      children,
      className,
      movingBorder = false,
      borderClassName = "",
      duration = 3000,
      variant = "default",
      size = "default",
      isLoading,
      ...props
    },
    ref
  ) => {
    if (movingBorder) {
      return (
        <MovingBorder
          duration={duration}
          className={cn(
            "bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800",
            borderClassName
          )}
        >
          <Button
            ref={ref}
            variant={variant}
            size={size}
            className={cn(
              "relative bg-transparent border-0 text-black dark:text-white",
              className
            )}
            {...props}
          >
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              children
            )}
          </Button>
        </MovingBorder>
      );
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={className}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";
