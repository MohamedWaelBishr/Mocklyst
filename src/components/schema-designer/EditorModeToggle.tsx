'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FormInput, 
  Code2, 
  Shuffle,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EditorModeToggleProps {
  currentMode: "form" | "json";
  onModeChange: (mode: "form" | "json") => void;
  syncStatus: {
    isFormDriven: boolean;
    isEditorDriven: boolean;
    syncInProgress: boolean;
  };
  className?: string;
}

export function EditorModeToggle({
  currentMode,
  onModeChange,
  syncStatus,
  className = "",
}: EditorModeToggleProps) {
  const [hovering, setHovering] = useState<"form" | "json" | null>(null);

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Mode Toggle Buttons */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 transition-colors">
        <Button
          variant={currentMode === "form" ? "default" : "ghost"}
          size="sm"
          onClick={() => onModeChange("form")}
          onMouseEnter={() => setHovering("form")}
          onMouseLeave={() => setHovering(null)}
          className={`
            relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200
            ${
              currentMode === "form"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }
          `}
        >
          <FormInput className="h-4 w-4" />
          Form Mode
          {currentMode === "form" && (
            <motion.div
              layoutId="activeMode"
              className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-md border border-blue-300 dark:border-blue-600"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </Button>

        <Button
          variant={currentMode === "json" ? "default" : "ghost"}
          size="sm"
          onClick={() => onModeChange("json")}
          onMouseEnter={() => setHovering("json")}
          onMouseLeave={() => setHovering(null)}
          className={`
            relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200
            ${
              currentMode === "json"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
            }
          `}
        >
          <Code2 className="h-4 w-4" />
          JSON Mode
          {currentMode === "json" && (
            <motion.div
              layoutId="activeMode"
              className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-md border border-blue-300 dark:border-blue-600"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </Button>
      </div>

      {/* Sync Status Indicator */}
      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {syncStatus.syncInProgress && (
            <motion.div
              key="syncing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Shuffle className="h-3 w-3" />
                </motion.div>
                Syncing...
              </Badge>
            </motion.div>
          )}

          {!syncStatus.syncInProgress && syncStatus.isFormDriven && (
            <motion.div
              key="form-driven"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Form → JSON
              </Badge>
            </motion.div>
          )}

          {!syncStatus.syncInProgress && syncStatus.isEditorDriven && (
            <motion.div
              key="editor-driven"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                JSON → Form
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Help Text */}
      <AnimatePresence>
        {hovering && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="text-xs text-slate-500 dark:text-slate-400"
          >
            {hovering === "form"
              ? "Use visual form builder"
              : "Edit JSON directly"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
