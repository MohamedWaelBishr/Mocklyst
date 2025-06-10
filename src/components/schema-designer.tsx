'use client';

import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedLoader } from "@/components/ui/animated-loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Copy,
  Settings2,
  Code,
  Trash2,
  ChevronDown,
  ChevronRight,
  Check,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { MockSchema, SchemaField } from "@/types";
import { generateMockData } from "@/lib/mock-generator";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  detectFieldType,
  getAvailableFieldTypes,
  SmartFieldType,
  FieldSuggestion,
  generateValueForType,
} from "@/lib/field-type-detector";

interface SchemaDesignerProps {
  onGenerateAction: (schema: MockSchema) => void;
  isLoading?: boolean;
}

interface RecursiveFieldProps {
  field: SchemaField;
  path: string;
  depth: number;
  isExpanded: boolean;
  onToggleExpanded: (path: string) => void;
  onUpdateField: (path: string, field: SchemaField) => void;
  onAddNestedField: (path: string) => void;
  onRemoveField: (path: string) => void;
}

// Memoized RecursiveField component to prevent unnecessary re-renders
const RecursiveField = memo(
  ({
    field,
    path,
    depth,
    isExpanded,
    onToggleExpanded,
    onUpdateField,
    onAddNestedField,
    onRemoveField,
  }: RecursiveFieldProps) => {
    const [suggestions, setSuggestions] = useState<FieldSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleKeyChange = useCallback(
      (value: string) => {
        onUpdateField(path, { ...field, key: value });

        // Get smart field type suggestions
        if (value.trim()) {
          const fieldSuggestions = detectFieldType(value.trim());
          setSuggestions(fieldSuggestions);
          setShowSuggestions(
            fieldSuggestions.length > 0 && fieldSuggestions[0].confidence > 0.6
          );
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      },
      [field, path, onUpdateField]
    );

    const handleTypeChange = useCallback(
      (type: SmartFieldType) => {
        onUpdateField(path, { ...field, type });
        setShowSuggestions(false);
      },
      [field, path, onUpdateField]
    );

    const handleValueChange = useCallback(
      (value: string) => {
        onUpdateField(path, { ...field, value });
      },
      [field, path, onUpdateField]
    );

    const handleToggleExpanded = useCallback(() => {
      onToggleExpanded(path);
    }, [path, onToggleExpanded]);

    const handleAddNestedField = useCallback(() => {
      onAddNestedField(path);
    }, [path, onAddNestedField]);

    const handleRemoveField = useCallback(() => {
      onRemoveField(path);
    }, [path, onRemoveField]);

    const handleApplySuggestion = useCallback(
      (suggestion: FieldSuggestion) => {
        onUpdateField(path, {
          ...field,
          type: suggestion.type,
          value: suggestion.example,
        });
        setShowSuggestions(false);
      },
      [field, path, onUpdateField]
    );

    const handleGenerateValue = useCallback(() => {
      const newValue = generateValueForType(field.type);
      onUpdateField(path, { ...field, value: newValue });
    }, [field, path, onUpdateField]);

    const availableTypes = getAvailableFieldTypes();

    return (
      <div className="space-y-3">
        {" "}
        <div className="flex items-center gap-3">
          {(field.type === "object" || field.type === "array") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={`Toggle ${field.type}`}
              onClick={handleToggleExpanded}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Field name"
              value={field.key || ""}
              onChange={(e) => handleKeyChange(e.target.value)}
              className="rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
            <Select value={field.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {availableTypes.map(({ type, description }) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex flex-col">
                      <span className="capitalize">
                        {type.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>{" "}
            {field.type !== "object" && field.type !== "array" && (
              <div className="relative">
                <Input
                  placeholder="Enter value or generate"
                  value={String(field.value || "")}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                  aria-label="Generate value"
                  onClick={handleGenerateValue}
                >
                  <Sparkles className="h-3 w-3" />
                </Button>
              </div>
            )}
            {field.type === "array" && (
              <Input
                type="number"
                min={1}
                max={100}
                value={field.length || 3}
                onChange={(e) =>
                  onUpdateField(path, {
                    ...field,
                    length: Math.min(Math.max(1, Number(e.target.value)), 100),
                  })
                }
                placeholder="Array length (1-100)"
                className="rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            )}
          </div>{" "}
          <div className="flex items-center gap-1">
            {(field.type === "object" || field.type === "array") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/30"
                aria-label={`Add ${
                  field.type === "array" ? "array item" : "nested"
                } field`}
                onClick={handleAddNestedField}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30"
              aria-label="Remove field"
              onClick={handleRemoveField}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {/* Smart Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Smart Suggestions
              </span>
            </div>
            <div className="space-y-2">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full text-left p-2 rounded border border-blue-200 dark:border-blue-700 bg-white dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-colors"
                  onClick={() => handleApplySuggestion(suggestion)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-200 capitalize">
                        {suggestion.type.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">
                        {suggestion.description}
                      </div>
                    </div>
                    <div className="text-xs text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/50 px-2 py-1 rounded">
                      {Math.round(suggestion.confidence * 100)}%
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    Example: {suggestion.example}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}{" "}
        {/* Recursive nested fields */}
        {(field.type === "object" || field.type === "array") &&
          isExpanded &&
          field.fields && (
            <div className="space-y-3 ml-6 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              {field.type === "array" && (
                <div className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">
                  Array Item Template ({field.length || 3} items will be
                  generated)
                </div>
              )}
              {field.fields.map((nestedField, index) => (
                <RecursiveField
                  key={`${path}.${index}`}
                  field={nestedField}
                  path={`${path}.${index}`}
                  depth={depth + 1}
                  isExpanded={false} // Will be managed by expandedFields state in parent
                  onToggleExpanded={onToggleExpanded}
                  onUpdateField={onUpdateField}
                  onAddNestedField={onAddNestedField}
                  onRemoveField={onRemoveField}
                />
              ))}
            </div>
          )}
      </div>
    );
  }
);

RecursiveField.displayName = "RecursiveField";

// Wrapper component that handles expanded state for all nested levels
interface RecursiveFieldWrapperProps {
  field: SchemaField;
  path: string;
  depth: number;
  expandedFields: Set<string>;
  onToggleExpanded: (path: string) => void;
  onUpdateField: (path: string, field: SchemaField) => void;
  onAddNestedField: (path: string) => void;
  onRemoveField: (path: string) => void;
}

const RecursiveFieldWrapper = memo(
  ({
    field,
    path,
    depth,
    expandedFields,
    onToggleExpanded,
    onUpdateField,
    onAddNestedField,
    onRemoveField,
  }: RecursiveFieldWrapperProps) => {
    const isExpanded = expandedFields.has(path);

    return (
      <div className="space-y-3">
        {" "}
        <div className="flex items-center gap-3">
          {(field.type === "object" || field.type === "array") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={`Toggle ${field.type}`}
              onClick={() => onToggleExpanded(path)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              placeholder="Field name"
              value={field.key || ""}
              onChange={(e) =>
                onUpdateField(path, { ...field, key: e.target.value })
              }
              className="rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            />
            <Select
              value={field.type}
              onValueChange={(type: SmartFieldType) => {
                onUpdateField(path, { ...field, type });
              }}
            >
              <SelectTrigger className="rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {getAvailableFieldTypes().map(({ type, description }) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex flex-col">
                      <span className="capitalize">
                        {type.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>{" "}
            {field.type !== "object" && field.type !== "array" && (
              <div className="relative">
                <Input
                  placeholder="Enter value or generate"
                  value={String(field.value || "")}
                  onChange={(e) =>
                    onUpdateField(path, { ...field, value: e.target.value })
                  }
                  className="rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                  aria-label="Generate value"
                  onClick={() => {
                    const newValue = generateValueForType(field.type);
                    onUpdateField(path, { ...field, value: newValue });
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                </Button>
              </div>
            )}
            {field.type === "array" && (
              <Input
                type="number"
                min={1}
                max={100}
                value={field.length || 3}
                onChange={(e) =>
                  onUpdateField(path, {
                    ...field,
                    length: Math.min(Math.max(1, Number(e.target.value)), 100),
                  })
                }
                placeholder="Array length (1-100)"
                className="rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
            )}
          </div>{" "}
          <div className="flex items-center gap-1">
            {(field.type === "object" || field.type === "array") && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30"
                aria-label={`Add ${
                  field.type === "array" ? "array item" : "nested"
                } field`}
                onClick={() => onAddNestedField(path)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
              aria-label="Remove field"
              onClick={() => onRemoveField(path)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>{" "}
        {/* Recursive nested fields */}
        {(field.type === "object" || field.type === "array") &&
          isExpanded &&
          field.fields && (
            <div className="space-y-3 ml-6 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              {field.type === "array" && (
                <div className="text-xs text-slate-500 dark:text-slate-400 italic mb-2">
                  Array Item Template ({field.length || 3} items will be
                  generated)
                </div>
              )}
              {field.fields.map((nestedField, index) => (
                <RecursiveFieldWrapper
                  key={`${path}.${index}`}
                  field={nestedField}
                  path={`${path}.${index}`}
                  depth={depth + 1}
                  expandedFields={expandedFields}
                  onToggleExpanded={onToggleExpanded}
                  onUpdateField={onUpdateField}
                  onAddNestedField={onAddNestedField}
                  onRemoveField={onRemoveField}
                />
              ))}
            </div>
          )}
      </div>
    );
  }
);

RecursiveFieldWrapper.displayName = "RecursiveFieldWrapper";

export function SchemaDesigner({
  onGenerateAction,
  isLoading,
}: SchemaDesignerProps) {
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

  const [schema, setSchema] = useState<MockSchema>({
    type: "object",
    fields: [
      { key: "id", type: "number", value: 123 },
      {
        key: "myObject",
        type: "object",
        fields: [
          { key: "id", type: "number", value: 123 },
          { key: "name", type: "string", value: "string_value" },
        ],
      },
    ],
  });
  const [expandedFields, setExpandedFields] = useState<Set<string>>(
    new Set(["1"])
  );

  const [copied, setCopied] = useState(false);

  // Optimized utility functions
  const pathToArray = useCallback((path: string): number[] => {
    return path.split(".").map(Number);
  }, []);

  const getDefaultValueForType = useCallback((type: string) => {
    switch (type) {
      case "string":
        return "sample text";
      case "number":
        return 123;
      case "boolean":
        return true;
      default:
        return "";
    }
  }, []);

  // Handler for schema type changes
  const handleSchemaTypeChange = useCallback(
    (type: "object" | "array" | "primitive") => {
      setSchema((prev) => {
        const newSchema: MockSchema = { type };

        if (type === "object" || type === "array") {
          newSchema.fields =
            prev.fields && prev.fields.length > 0
              ? prev.fields
              : [{ key: "", type: "string", value: "" }];

          if (type === "array") {
            newSchema.length = prev.length || 3;
          }
        } else if (type === "primitive") {
          newSchema.primitiveType = prev.primitiveType || "string";
          newSchema.primitiveValue = prev.primitiveValue || "sample value";
        }

        return newSchema;
      });
    },
    []
  );

  // Handler for array length changes
  const handleArrayLengthChange = useCallback((length: number) => {
    setSchema((prev) => ({
      ...prev,
      length: Math.min(Math.max(1, length), 100), // Ensure between 1-100
    }));
  }, []);
  // Handler for primitive type changes
  const handlePrimitiveTypeChange = useCallback((type: SmartFieldType) => {
    setSchema((prev) => ({
      ...prev,
      primitiveType: type,
      primitiveValue: "", // Start with empty value, faker will be used in GET request
    }));
  }, []);

  // Handler for primitive value changes
  const handlePrimitiveValueChange = useCallback(
    (value: string | number | boolean) => {
      setSchema((prev) => ({
        ...prev,
        primitiveValue: value,
      }));
    },
    []
  );

  // Optimized state update functions
  const updateFieldByPath = useCallback(
    (path: string, newField: SchemaField) => {
      setSchema((prev) => {
        const pathArray = pathToArray(path);
        const newSchema = structuredClone(prev); // More efficient than JSON.parse/stringify

        let current: any = newSchema;
        for (let i = 0; i < pathArray.length - 1; i++) {
          current = current.fields[pathArray[i]];
        }

        const updatedField = { ...newField }; // Handle type changes for object fields
        if (newField.type === "object" && !newField.fields) {
          updatedField.fields = [];
          delete updatedField.value;
        } else if (newField.type === "array" && !newField.fields) {
          updatedField.fields = [];
          updatedField.length = updatedField.length || 3; // Default array length
          delete updatedField.value;
        } else if (
          newField.type !== "object" &&
          newField.type !== "array" &&
          newField.fields
        ) {
          delete updatedField.fields;
          delete updatedField.length;
          if (!updatedField.value) {
            updatedField.value = getDefaultValueForType(newField.type);
          }
        }

        current.fields[pathArray[pathArray.length - 1]] = updatedField;
        return newSchema;
      });
    },
    [pathToArray, getDefaultValueForType]
  );
  const addNestedFieldByPath = useCallback(
    (path: string) => {
      setSchema((prev) => {
        const pathArray = pathToArray(path);
        const newSchema = structuredClone(prev);

        let current: any = newSchema;
        for (const index of pathArray) {
          current = current.fields[index];
        }

        if (current.type === "object" || current.type === "array") {
          if (!current.fields) {
            current.fields = [];
          }
          current.fields.push({ key: "", type: "string", value: "" });
        }

        return newSchema;
      });
    },
    [pathToArray]
  );

  const removeFieldByPath = useCallback(
    (path: string) => {
      setSchema((prev) => {
        const pathArray = pathToArray(path);
        const newSchema = structuredClone(prev);

        if (pathArray.length === 1) {
          // Removing top-level field
          newSchema.fields = newSchema.fields?.filter(
            (_: SchemaField, i: number) => i !== pathArray[0]
          );
        } else {
          // Removing nested field
          let current: any = newSchema;
          for (let i = 0; i < pathArray.length - 1; i++) {
            current = current.fields[pathArray[i]];
          }

          const lastIndex = pathArray[pathArray.length - 1];
          current.fields = current.fields?.filter(
            (_: SchemaField, i: number) => i !== lastIndex
          );
        }

        return newSchema;
      });
    },
    [pathToArray]
  );

  const toggleExpanded = useCallback((path: string) => {
    setExpandedFields((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      return newExpanded;
    });
  }, []);

  const addField = useCallback(() => {
    if (schema.type === "object" || schema.type === "array") {
      setSchema((prev) => ({
        ...prev,
        fields: [
          ...(prev.fields || []),
          { key: "", type: "string", value: "" },
        ],
      }));
    }
  }, [schema.type]);

  // Check if the schema is valid for generation
  const isSchemaValid = useCallback(() => {
    if (schema.type === "primitive") {
      return true; // Primitive types don't need fields
    }

    if (schema.type === "object" || schema.type === "array") {
      return schema.fields && schema.fields.length > 0;
    }
    return false;
  }, [schema]);

  // Copy to clipboard function
  const copyJsonToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(mockData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // 3 seconds for better UX
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  const mockData = generateMockData(schema);
  return (
    <div className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 rounded-3xl shadow-xl border border-white/40 dark:border-slate-700/40 p-8 lg:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Schema Designer Section */}
        <section aria-label="Schema Designer" className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Settings2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3
              className="text-xl font-bold text-slate-800 dark:text-slate-200"
              style={{
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Schema Designer
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium mb-6">
            Design your mock API response structure with precision
          </p>

          {/* Schema Type Selector */}
          <div className="space-y-4 mb-6">
            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Response Type
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  type: "object" as const,
                  label: "Object",
                  description: "Key-value structure",
                },
                {
                  type: "array" as const,
                  label: "Array",
                  description: "List of items",
                },
                {
                  type: "primitive" as const,
                  label: "Primitive",
                  description: "Single value",
                },
              ].map(({ type, label, description }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSchemaTypeChange(type)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    schema.type === type
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Array Length Configuration */}
          {schema.type === "array" && (
            <div className="space-y-4 mb-6">
              <Label
                htmlFor="array-length"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Array Length (1-100)
              </Label>
              <Input
                id="array-length"
                type="number"
                min={1}
                max={100}
                value={schema.length || 3}
                onChange={(e) =>
                  handleArrayLengthChange(Number(e.target.value))
                }
                className="w-32 rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Number of items to generate in the array (maximum 100)
              </p>
            </div>
          )}

          {/* Primitive Type Configuration */}
          {schema.type === "primitive" && (
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Primitive Type
                  </Label>
                  <Select
                    value={schema.primitiveType || "string"}
                    onValueChange={(type: SmartFieldType) =>
                      handlePrimitiveTypeChange(type)
                    }
                  >
                    <SelectTrigger className="rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {getAvailableFieldTypes().map(({ type, description }) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex flex-col">
                            <span className="capitalize">
                              {type.replace(/([A-Z])/g, " $1").trim()}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Value
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter value or generate"
                      value={String(schema.primitiveValue || "")}
                      onChange={(e) =>
                        handlePrimitiveValueChange(e.target.value)
                      }
                      className="rounded-lg border-slate-200 dark:border-slate-700 focus:border-indigo-300 dark:focus:border-indigo-500 focus:ring-indigo-200 dark:focus:ring-indigo-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                      aria-label="Generate value"
                      onClick={() =>
                        handlePrimitiveValueChange(
                          generateValueForType(schema.primitiveType || "string")
                        )
                      }
                    >
                      <Sparkles className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <hr className="border-slate-200 dark:border-slate-700" />

          {/* Fields Configuration */}
          {(schema.type === "object" || schema.type === "array") && (
            <form className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {schema.type === "array"
                      ? "Array Item Fields"
                      : "Object Fields"}
                  </Label>
                  {schema.type === "array" && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {schema.length || 3} items will be generated
                    </span>
                  )}
                </div>
                {/* Fields */}
                {schema.fields?.map((field, index) => (
                  <RecursiveFieldWrapper
                    key={index}
                    field={field}
                    path={index.toString()}
                    depth={0}
                    expandedFields={expandedFields}
                    onToggleExpanded={toggleExpanded}
                    onUpdateField={updateFieldByPath}
                    onAddNestedField={addNestedFieldByPath}
                    onRemoveField={removeFieldByPath}
                  />
                ))}
              </div>
              <hr className="border-slate-200 dark:border-slate-700" />
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-lg border-dashed border-slate-300 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                onClick={addField}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </form>
          )}
        </section>
        {/* JSON Preview Section */}
        <section aria-label="JSON Preview" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Code className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3
                className="text-xl font-bold text-slate-800 dark:text-slate-200"
                style={{
                  fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                JSON Preview
              </h3>
            </div>
            <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 relative overflow-hidden"
                aria-label="Copy JSON to clipboard"
                onClick={copyJsonToClipboard}
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
                      className="flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 text-green-600" />
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
                      className="flex items-center justify-center"
                    >
                      <Copy className="h-4 w-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium mb-6">
            Live preview of your mock response
          </p>
          <hr className="border-slate-200 dark:border-slate-700" />
          <div className="relative">
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
              <Editor
                height="400px"
                language="json"
                theme={"custom-dark"}
                value={JSON.stringify(mockData, null, 2)}
                beforeMount={(monaco) => {
                  // Register the custom theme
                  monaco.editor.defineTheme("custom-dark", customTheme);
                }}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  fontFamily: 'Consolas, "Courier New", monospace',
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: true,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  automaticLayout: true,
                  contextmenu: true,
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  cursorStyle: "line",
                  wordWrap: "on",
                  scrollbar: {
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                  },
                  padding: {
                    top: 16,
                    bottom: 16,
                  },
                }}
                loading={
                  <div className="flex items-center justify-center h-96 bg-slate-950">
                    <div className="text-slate-400">Loading editor...</div>
                  </div>
                }
              />
            </div>
          </div>
        </section>
      </div>
      <div className="mt-12 text-center">
        <AnimatedButton
          className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          onClick={() => onGenerateAction(schema)}
          disabled={isLoading || !isSchemaValid()}
          duration={3000}
        >
          {isLoading ? (
            <AnimatedLoader size="sm" variant="dots" className="mr-2" />
          ) : (
            <Settings2 className="h-5 w-5 mr-2" />
          )}
          {isLoading ? "Generating..." : "Generate Mock Endpoint"}
        </AnimatedButton>
        {!isSchemaValid() && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">
            Please add at least one field to generate a mock endpoint
          </p>
        )}
      </div>
    </div>
  );
}
