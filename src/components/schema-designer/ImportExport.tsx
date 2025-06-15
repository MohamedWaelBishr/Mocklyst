'use client';

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Upload, 
  FileText, 
  Check,
  AlertCircle,
  Copy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MockSchema } from "@/types";
import { parseJsonToSchema } from "@/lib/utils/json-parser";
import { schemaToJsonWithMockGenerator } from "@/lib/utils/schema-to-json";

interface ImportExportProps {
  schema: MockSchema;
  onSchemaImportAction: (schema: MockSchema) => void;
  className?: string;
}

export function ImportExport({ 
  schema, 
  onSchemaImportAction, 
  className = "" 
}: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleExportJSON = async () => {
    setExporting(true);
    try {
      const jsonString = schemaToJsonWithMockGenerator(schema);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `mocklyst-schema-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      showFeedback('success', 'Schema exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      showFeedback('error', 'Failed to export schema');
    } finally {
      setExporting(false);
    }
  };

  const handleCopyJSON = async () => {
    try {
      const jsonString = schemaToJsonWithMockGenerator(schema);
      await navigator.clipboard.writeText(jsonString);
      showFeedback('success', 'JSON copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      showFeedback('error', 'Failed to copy JSON');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parseResult = parseJsonToSchema(content);
        
        if (parseResult.validation.isValid && parseResult.schema) {
          onSchemaImportAction(parseResult.schema);
          showFeedback('success', `Schema imported from ${file.name}`);
        } else {
          showFeedback('error', parseResult.validation.error || 'Invalid JSON format');
        }
      } catch (error) {
        console.error('Import error:', error);
        showFeedback('error', 'Failed to import file');
      } finally {
        setImporting(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    reader.onerror = () => {
      showFeedback('error', 'Failed to read file');
      setImporting(false);
    };
    
    reader.readAsText(file);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Import JSON file"
      />

      {/* Import Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleImportClick}
        disabled={importing}
        className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      >
        <AnimatePresence mode="wait">
          {importing ? (
            <motion.div
              key="importing"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Upload className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </motion.div>
          )}
        </AnimatePresence>
        Import JSON
      </Button>

      {/* Export Dropdown/Buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportJSON}
          disabled={exporting}
          className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
        >
          <AnimatePresence mode="wait">
            {exporting ? (
              <motion.div
                key="exporting"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: -180 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="download"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Download className="h-4 w-4 text-green-600 dark:text-green-400" />
              </motion.div>
            )}
          </AnimatePresence>
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyJSON}
          className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors px-3"
        >
          <Copy className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </Button>
      </div>

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
