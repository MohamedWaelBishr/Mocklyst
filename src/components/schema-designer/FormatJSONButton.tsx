'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Code, 
  Check, 
  AlertCircle,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormatJSONButtonProps {
  editorValue: string;
  onFormatAction: (formattedJson: string) => void;
  className?: string;
}

export function FormatJSONButton({ 
  editorValue, 
  onFormatAction, 
  className = "" 
}: FormatJSONButtonProps) {
  const [formatting, setFormatting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleFormat = async () => {
    if (!editorValue.trim()) {
      showFeedback('error', 'No JSON to format');
      return;
    }

    setFormatting(true);
    
    try {
      // Parse and reformat the JSON with proper indentation
      const parsed = JSON.parse(editorValue);
      const formatted = JSON.stringify(parsed, null, 2);
      
      // Only update if the formatting actually changed
      if (formatted !== editorValue) {
        onFormatAction(formatted);
        showFeedback('success', 'JSON formatted successfully');
      } else {
        showFeedback('success', 'JSON is already properly formatted');
      }
    } catch (error) {
      console.error('Format error:', error);
      showFeedback('error', 'Invalid JSON - cannot format');
    } finally {
      setFormatting(false);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Format Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleFormat}
        disabled={formatting || !editorValue.trim()}
        className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
      >
        <AnimatePresence mode="wait">
          {formatting ? (
            <motion.div
              key="formatting"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
          )}
        </AnimatePresence>
        Format JSON
      </Button>

      {/* Feedback Messages */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`
              flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors
              ${feedback.type === 'success' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
              }
            `}
          >
            {feedback.type === 'success' ? (
              <Check className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
