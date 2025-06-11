"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Play, Copy, Check, Code } from "lucide-react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useState } from "react";
import { toast } from "sonner";
import { Editor } from "@monaco-editor/react";
import { handleEditorDidMount } from "@/lib/getMonacoTheme";

export function DemoSection() {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  const handleTryDemo = () => {
    // Navigate to the schema designer
    window.location.href = "/create";
  };

  const copyToClipboard = async (text: string, exampleKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [exampleKey]: true }));
      toast.success("Copied to clipboard!");
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [exampleKey]: false }));
      }, 2000);
    } catch (err) {
      console.error("🚀 ~ copyToClipboard ~ err:", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  const codeExamples = [
    {
      language: "JavaScript",
      monacoLanguage: "javascript",
      code: `// Fetch your mock data
fetch('https://api.mocklyst.com/v1/abc123')
  .then(response => response.json())
  .then(data => console.log(data));`,
    },
    {
      language: "Python",
      monacoLanguage: "python",
      code: `import requests

# Get mock data
response = requests.get('https://api.mocklyst.com/v1/abc123')
data = response.json()`,
    },
    {
      language: "cURL",
      monacoLanguage: "shell",
      code: `# Simple HTTP request
curl -X GET https://api.mocklyst.com/v1/abc123 \\
  -H "Content-Type: application/json"`,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-blue-950/30 dark:to-purple-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium border border-purple-200 dark:border-purple-800 mb-6">
            <Play className="h-4 w-4" />
            <span>Live Demo</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            See Mocklyst in
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              action
            </span>
          </h2>

          <p className="max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Try our interactive demo to see how quickly you can go from idea to
            working API endpoint.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Demo Interface */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Browser Bar */}
              <div className="bg-slate-100 dark:bg-slate-700 px-4 py-3 border-b border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    mocklyst.com/create
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Design Your Schema
                  </h3>{" "}
                  {/* Schema Preview */}
                  <div className="bg-slate-900 dark:bg-slate-800 rounded-lg overflow-hidden pointer-events-none">
                    <Editor
                      height="180px"
                      language="json"
                      value={`{
  "users": [
    {
      "id": 1,
      "name": "John Doe"
    }
  ]
}`}
                      theme="mocklyst-dark"
                      beforeMount={handleEditorDidMount}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        lineNumbers: "off",
                        folding: false,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 0,
                        glyphMargin: true,
                        scrollbar: {
                          vertical: "hidden",
                          horizontal: "hidden",
                        },
                        overviewRulerLanes: 0,
                        hideCursorInOverviewRuler: true,
                        overviewRulerBorder: false,
                        fontSize: 13,
                        fontFamily:
                          '"Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace',
                        padding: { top: 12, bottom: 12 },
                        renderLineHighlight: "none",
                        renderValidationDecorations: "off",
                        renderWhitespace: "none",
                        mouseWheelZoom: false,
                        contextmenu: false,
                        links: false,
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
                          </div>

                          {/* Floating particles */}
                          <div className="absolute inset-0 overflow-hidden">
                            {Array.from({ length: 8 }).map((_, i) => (
                              <div
                                key={i}
                                className="absolute w-1 h-1 bg-indigo-400/30 rounded-full animate-ping"
                                style={{
                                  left: `${Math.random() * 100}%`,
                                  top: `${Math.random() * 100}%`,
                                  animationDelay: `${Math.random() * 2}s`,
                                  animationDuration: `${
                                    2 + Math.random() * 2
                                  }s`,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      }
                    />
                  </div>
                  {/* Generated URL */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Generated Endpoint:
                    </label>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <code className="text-green-700 dark:text-green-300 text-sm font-mono">
                        https://api.mocklyst.com/v1/abc123
                      </code>
                    </div>
                  </div>
                </div>

                {/* Try Demo Button */}
                <AnimatedButton
                  onClick={handleTryDemo}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-lg font-medium transition-all duration-300"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Code2 className="h-4 w-4" />
                    Try Interactive Demo
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </AnimatedButton>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg"
            >
              <Code2 className="h-5 w-5" />
            </motion.div>
          </motion.div>

          {/* Code Examples */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Use in any language
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Generated endpoints work with any HTTP client. Here are some
                examples:
              </p>
            </div>{" "}
            <div className="space-y-4">
              {codeExamples.map((example, index) => (
                <motion.div
                  key={example.language}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-purple-900 dark:bg-purple-800 rounded-lg overflow-hidden relative"
                >
                  <div className="bg-purple-700 dark:bg-purple-800 px-4 py-2 border-b border-slate-700 dark:border-slate-600 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300 dark:text-slate-400">
                      {example.language}
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(example.code, example.language)
                      }
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-purple-900 dark:bg-purple-800  text-slate-300 dark:text-slate-400 hover:text-white dark:hover:text-white transition-colors duration-200"
                      title="Copy code"
                    >
                      {copiedStates[example.language] ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>{" "}
                  <div className="h-24 bg-purple-900 dark:bg-purple-800">
                    <Editor
                      height="96px"
                      language={example.monacoLanguage}
                      value={example.code}
                      theme="mocklyst-dark"
                      beforeMount={handleEditorDidMount}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        lineNumbers: "on",
                        folding: true,
                        lineDecorationsWidth: 0,
                        lineNumbersMinChars: 0,
                        glyphMargin: true,
                        scrollbar: {
                          vertical: "hidden",
                          horizontal: "hidden",
                        },
                        overviewRulerLanes: 0,
                        hideCursorInOverviewRuler: true,
                        overviewRulerBorder: false,
                        fontSize: 12,
                        fontFamily:
                          '"Fira Code", "Monaco", "Menlo", "Ubuntu Mono", monospace',
                        padding: { top: 8, bottom: 8 },
                        renderLineHighlight: "none",
                        renderValidationDecorations: "off",
                        renderWhitespace: "none",
                        mouseWheelZoom: false,
                        contextmenu: false,
                        links: false,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Features List */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-blue-100 dark:border-blue-800/30">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                What you get:
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Instant endpoint generation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  CORS enabled by default
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  JSON responses
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                  7-day automatic cleanup
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
