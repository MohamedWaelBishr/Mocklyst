'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MovingBorder } from "@/components/ui/moving-border";
import { Copy, ExternalLink, Clock, Trash2, Check } from "lucide-react";
import { formatExpiryDate } from "@/lib/mock-generator";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface EndpointResultProps {
  endpoint: string;
  id: string;
  expiresAt: string;
  onResetAction: () => void;
}

export function EndpointResult({
  endpoint,
  id,
  expiresAt,
  onResetAction,
}: EndpointResultProps) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `${window.location.origin}${endpoint}`;
  const expiryDate = new Date(expiresAt);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Increased to 3 seconds for better UX
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const openInNewTab = () => {
    window.open(fullUrl, "_blank");
  };

  return (
    <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
      <CardHeader>
        <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
          <TextGenerateEffect
            words="🎉 Mock Endpoint Created!"
            className="text-green-800 dark:text-green-200"
            duration={0.5}
            filter={false}
          />
          <Badge variant="secondary" className="ml-auto">
            <Clock className="h-3 w-3 mr-1" />
            {formatExpiryDate(expiryDate)}
          </Badge>
        </CardTitle>
        <CardDescription className="text-green-700 dark:text-green-300">
          Your temporary API endpoint is ready to use
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-green-800 dark:text-green-200">
            Endpoint URL:
          </label>
          <div className="flex gap-2">
            <div className="flex-1 p-3 bg-white dark:bg-slate-900 border rounded-lg font-mono text-sm">
              {fullUrl}
            </div>{" "}
            <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
              <MovingBorder
                duration={2000}
                className="bg-white dark:bg-slate-900 text-black dark:text-white border-green-300 dark:border-green-700"
              >
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="shrink-0 relative overflow-hidden bg-transparent border-0"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="copied"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: -180 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Copy
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </MovingBorder>
            </motion.div>
            <Button
              onClick={openInNewTab}
              variant="outline"
              size="sm"
              className="shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
              Test
            </Button>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border rounded-lg p-4 space-y-3">
          <h4 className="font-medium">Usage Examples:</h4>

          <div className="space-y-3 text-sm">
            <div>
              <label className="text-xs text-muted-foreground">cURL:</label>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs overflow-x-auto">
                {`curl ${fullUrl}`}
              </pre>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                JavaScript Fetch:
              </label>
              <pre className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs overflow-x-auto">
                {`fetch('${fullUrl}')
  .then(response => response.json())
  .then(data => console.log(data));`}
              </pre>
            </div>
          </div>
        </div>{" "}
        <div className="flex gap-2 pt-2">
          <Button onClick={onResetAction} variant="outline" className="flex-1">
            Create Another Mock
          </Button>
          <Link href={`/mock/${id}/delete`}>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
