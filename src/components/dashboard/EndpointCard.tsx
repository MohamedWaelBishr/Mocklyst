"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { UserEndpoint } from "@/lib/hooks/useUserEndpoints"
import {
  ExternalLink,
  Copy,
  Calendar,
  Clock,
  Code,
  Trash2,
  TrendingUp,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import Editor from "@monaco-editor/react";
import { formatDistanceToNow } from "date-fns";

interface EndpointCardProps {
  endpoint: UserEndpoint;
  index: number;
  onDelete?: () => void;
}

export function EndpointCard({ endpoint, index, onDelete }: EndpointCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isExpired = new Date(endpoint.expires_at) < new Date();
  const expiresIn = Math.ceil(
    (new Date(endpoint.expires_at).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  );

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Custom Monaco theme configuration
  const customTheme = {
    base: "vs-dark" as const,
    inherit: true,
    rules: [
      { token: "string.value.json", foreground: "22c55e" }, // Green for string values
      { token: "string.key.json", foreground: "e2e8f0" }, // Light gray for keys
      { token: "number.json", foreground: "22c55e" }, // Green for numbers
      { token: "keyword.json", foreground: "22c55e" }, // Green for booleans
      { token: "delimiter.bracket.json", foreground: "e2e8f0" }, // Light gray for brackets
      { token: "delimiter.array.json", foreground: "e2e8f0" }, // Light gray for array brackets
      { token: "delimiter.colon.json", foreground: "e2e8f0" }, // Light gray for colons
      { token: "delimiter.comma.json", foreground: "e2e8f0" }, // Light gray for commas
      { token: "string", foreground: "22c55e" }, // Green for all strings
      { token: "number", foreground: "22c55e" }, // Green for all numbers
      { token: "key", foreground: "e2e8f0" }, // Light gray for keys
    ],
    colors: {
      "editor.background": "#0f172a", // Very dark slate background to match image
      "editor.foreground": "#e2e8f0", // Light text
      "editorLineNumber.foreground": "#64748b", // Muted line numbers
      "editorLineNumber.activeForeground": "#e2e8f0", // Active line number
      "editor.selectionBackground": "#334155", // Selection background
      "editor.lineHighlightBackground": "#1e293b", // Line highlight
      "editor.inactiveSelectionBackground": "#334155",
      "scrollbar.shadow": "#0f172a",
      "scrollbarSlider.background": "#475569",
      "scrollbarSlider.hoverBackground": "#64748b",
      "scrollbarSlider.activeBackground": "#94a3b8",
      "editorWidget.background": "#0f172a",
      "editorWidget.border": "#475569",
    },
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.log("🚀 ~ copyToClipboard ~ err:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const openEndpoint = () => {
    window.open(endpoint.endpoint, "_blank");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/mock/${endpoint.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete endpoint");
      }

      toast.success("Endpoint deleted successfully!");
      onDelete?.();
    } catch (error) {
      console.error("Error deleting endpoint:", error);
      toast.error("Failed to delete endpoint");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        className={`shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm transition-all duration-200 hover:shadow-md ${
          isExpired ? "opacity-75" : ""
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span className="truncate">
                Endpoint #{endpoint.id.slice(-8)}
              </span>
            </CardTitle>
            <Badge variant={isExpired ? "destructive" : "default"}>
              {isExpired ? "Expired" : "Active"}
            </Badge>
          </div>{" "}
          <CardDescription className="flex items-center space-x-4 text-sm">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>
                Created {new Date(endpoint.created_at).toLocaleDateString()}
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <RotateCcw className="w-3 h-3" />
              <span>
                Updated{" "}
                {formatDistanceToNow(new Date(endpoint.updated_at), {
                  addSuffix: true,
                })}
              </span>
            </span>
            <span className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>{formatNumber(endpoint.hits || 0)} hits</span>
            </span>
            {!isExpired && (
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Expires in {expiresIn} days</span>
              </span>
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Endpoint URL */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Endpoint URL
            </label>
            <div className="flex items-center space-x-2 mt-1">
              <code className="dark:bg-slate-600 flex-1 px-2 py-1 bg-muted rounded text-sm font-mono text-muted-foreground dark:text-white truncate">
                {endpoint.endpoint}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(endpoint.endpoint)}
                className="h-8 w-8 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>{" "}
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {formatNumber(endpoint.hits || 0)} requests served
            </span>
            <Badge variant="secondary" className="text-xs">
              {(endpoint.hits || 0) > 1000
                ? "Popular"
                : (endpoint.hits || 0) > 100
                ? "Active"
                : "New"}
            </Badge>
          </div>
          {/* Schema Preview */}
          {endpoint.config && (
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Response Schema
              </label>
              <div className="mt-1 rounded overflow-hidden border border-slate-200 dark:border-slate-700">
                <Editor
                  height="400px"
                  language="json"
                  theme="custom-dark"
                  value={JSON.stringify(endpoint.config, null, 2)}
                  beforeMount={(monaco) => {
                    // Register the custom theme
                    monaco.editor.defineTheme("custom-dark", customTheme);
                  }}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 12,
                    fontFamily: 'Consolas, "Courier New", monospace',
                    lineNumbers: "off",
                    glyphMargin: true,
                    folding: true,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 0,
                    automaticLayout: true,
                    contextmenu: false,
                    selectOnLineNumbers: false,
                    roundedSelection: false,
                    cursorStyle: "line",
                    wordWrap: "on",
                    scrollbar: {
                      verticalScrollbarSize: 8,
                      horizontalScrollbarSize: 8,
                    },
                    padding: {
                      top: 8,
                      bottom: 8,
                    },
                  }}
                  loading={
                    <div className="w-full relative flex items-center justify-center h-96 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-xl overflow-hidden">
                      {/* Animated background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/20 to-transparent animate-pulse" />
                      {/* Main loading content */}
                      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                        {/* Animated code icon with pulse effect */}
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                          <div className="relative p-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border border-indigo-500/30">
                            <Code className="h-8 w-8 text-indigo-400 animate-pulse" />
                          </div>
                        </div>

                        {/* Loading text with typewriter effect */}
                        <div className="flex flex-col items-center space-y-3">
                          <h3 className="text-lg font-semibold text-slate-200 animate-pulse">
                            Initializing Editor
                          </h3>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-slate-400">
                              Preparing your workspace
                            </span>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse delay-0" />
                              <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse delay-100" />
                              <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse delay-200" />
                            </div>
                          </div>
                        </div>

                        {/* Animated progress indicators */}
                        <div className="flex space-x-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-2 h-2 bg-indigo-500/40 rounded-full animate-pulse"
                              style={{
                                animationDelay: `${i * 150}ms`,
                                animationDuration: "1.5s",
                              }}
                            />
                          ))}
                        </div>
                      </div>{" "}
                      {/* Floating particles with fixed positions to avoid hydration mismatch */}
                      <div className="absolute inset-0 overflow-hidden">
                        {Array.from({ length: 8 }).map((_, i) => {
                          // Use deterministic positioning based on index to avoid hydration mismatch
                          const positions = [
                            {
                              left: "15%",
                              top: "20%",
                              delay: "0s",
                              duration: "3s",
                            },
                            {
                              left: "85%",
                              top: "10%",
                              delay: "0.5s",
                              duration: "2.5s",
                            },
                            {
                              left: "25%",
                              top: "80%",
                              delay: "1s",
                              duration: "3.5s",
                            },
                            {
                              left: "75%",
                              top: "65%",
                              delay: "1.5s",
                              duration: "2s",
                            },
                            {
                              left: "45%",
                              top: "30%",
                              delay: "0.8s",
                              duration: "2.8s",
                            },
                            {
                              left: "65%",
                              top: "90%",
                              delay: "0.3s",
                              duration: "3.2s",
                            },
                            {
                              left: "35%",
                              top: "50%",
                              delay: "1.2s",
                              duration: "2.3s",
                            },
                            {
                              left: "55%",
                              top: "15%",
                              delay: "0.7s",
                              duration: "3.7s",
                            },
                          ];
                          const pos = positions[i];
                          return (
                            <div
                              key={i}
                              className="absolute w-1 h-1 bg-indigo-400/30 rounded-full animate-ping"
                              style={{
                                left: pos.left,
                                top: pos.top,
                                animationDelay: pos.delay,
                                animationDuration: pos.duration,
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          )}
          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openEndpoint}
              disabled={isExpired}
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Test Endpoint</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(endpoint.endpoint)}
              className="flex items-center space-x-2"
            >
              <Copy className="w-3 h-3" />
              <span>Copy URL</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-destructive hover:text-destructive"
                  disabled={isDeleting}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Endpoint</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this endpoint? This action
                    cannot be undone. The endpoint will immediately stop
                    responding to requests.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
