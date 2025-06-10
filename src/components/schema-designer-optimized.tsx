'use client';

import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import { MockSchema, SchemaField } from "@/types";
import { generateMockData } from "@/lib/mock-generator";

interface SchemaDesignerProps {
  onGenerate: (schema: MockSchema) => void;
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
const RecursiveField = memo(({
  field,
  path,
  depth,
  isExpanded,
  onToggleExpanded,
  onUpdateField,
  onAddNestedField,
  onRemoveField,
}: RecursiveFieldProps) => {
  const handleKeyChange = useCallback((value: string) => {
    onUpdateField(path, { ...field, key: value });
  }, [field, path, onUpdateField]);

  const handleTypeChange = useCallback((type: "string" | "number" | "boolean" | "object") => {
    onUpdateField(path, { ...field, type });
  }, [field, path, onUpdateField]);

  const handleValueChange = useCallback((value: string) => {
    onUpdateField(path, { ...field, value });
  }, [field, path, onUpdateField]);

  const handleToggleExpanded = useCallback(() => {
    onToggleExpanded(path);
  }, [path, onToggleExpanded]);

  const handleAddNestedField = useCallback(() => {
    onAddNestedField(path);
  }, [path, onAddNestedField]);

  const handleRemoveField = useCallback(() => {
    onRemoveField(path);
  }, [path, onRemoveField]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {field.type === "object" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-slate-100"
            aria-label="Toggle object"
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
            className="rounded-lg border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
          />

          <Select
            value={field.type}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="rounded-lg border-slate-200 focus:border-indigo-300 focus:ring-indigo-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="string">String</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
              <SelectItem value="object">Object</SelectItem>
            </SelectContent>
          </Select>

          {field.type !== "object" && (
            <Input
              placeholder="Enter value"
              value={String(field.value || "")}
              onChange={(e) => handleValueChange(e.target.value)}
              className="rounded-lg border-slate-200 focus:border-indigo-300 focus:ring-indigo-200"
            />
          )}
        </div>

        <div className="flex items-center gap-1">
          {field.type === "object" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
              aria-label="Add nested field"
              onClick={handleAddNestedField}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            aria-label="Remove field"
            onClick={handleRemoveField}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Recursive nested fields */}
      {field.type === "object" && isExpanded && field.fields && (
        <div className="space-y-3 ml-6 pl-4 border-l-2 border-slate-200">
          {field.fields.map((nestedField, index) => (
            <RecursiveField
              key={`${path}.${index}`}
              field={nestedField}
              path={`${path}.${index}`}
              depth={depth + 1}
              isExpanded={false} // This will be managed by parent
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
});

RecursiveField.displayName = "RecursiveField";

export function SchemaDesigner({ onGenerate, isLoading }: SchemaDesignerProps) {
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

  // Optimized state update functions
  const updateFieldByPath = useCallback((path: string, newField: SchemaField) => {
    setSchema((prev) => {
      const pathArray = pathToArray(path);
      const newSchema = structuredClone(prev); // More efficient than JSON.parse/stringify

      let current: any = newSchema;
      for (let i = 0; i < pathArray.length - 1; i++) {
        current = current.fields[pathArray[i]];
      }

      const updatedField = { ...newField };

      // Handle type changes for object fields
      if (newField.type === "object" && !newField.fields) {
        updatedField.fields = [];
        delete updatedField.value;
      } else if (newField.type !== "object" && newField.fields) {
        delete updatedField.fields;
        if (!updatedField.value) {
          updatedField.value = getDefaultValueForType(newField.type);
        }
      }

      current.fields[pathArray[pathArray.length - 1]] = updatedField;
      return newSchema;
    });
  }, [pathToArray, getDefaultValueForType]);

  const addNestedFieldByPath = useCallback((path: string) => {
    setSchema((prev) => {
      const pathArray = pathToArray(path);
      const newSchema = structuredClone(prev);

      let current: any = newSchema;
      for (const index of pathArray) {
        current = current.fields[index];
      }

      if (current.type === "object") {
        if (!current.fields) {
          current.fields = [];
        }
        current.fields.push({ key: "", type: "string", value: "" });
      }

      return newSchema;
    });
  }, [pathToArray]);

  const removeFieldByPath = useCallback((path: string) => {
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
  }, [pathToArray]);

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

  const mockData = generateMockData(schema);

  return (
    <div className="backdrop-blur-sm bg-white/70 rounded-3xl shadow-xl border border-white/40 p-8 lg:p-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Schema Designer Section */}
        <section aria-label="Schema Designer" className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-100">
              <Settings2 className="h-5 w-5 text-blue-600" />
            </div>
            <h3
              className="text-xl font-bold text-slate-800"
              style={{
                fontFamily:
                  "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
              }}
            >
              Schema Designer
            </h3>
          </div>
          <p className="text-slate-600 font-medium mb-6">
            Design your mock API response structure with precision
          </p>
          <hr className="border-slate-200" />

          <form className="space-y-4">
            <div className="space-y-4">
              {/* Fields */}
              {schema.fields?.map((field, index) => (
                <RecursiveField
                  key={index}
                  field={field}
                  path={index.toString()}
                  depth={0}
                  isExpanded={expandedFields.has(index.toString())}
                  onToggleExpanded={toggleExpanded}
                  onUpdateField={updateFieldByPath}
                  onAddNestedField={addNestedFieldByPath}
                  onRemoveField={removeFieldByPath}
                />
              ))}
            </div>

            <hr className="border-slate-200" />

            <Button
              type="button"
              variant="outline"
              className="w-full rounded-lg border-dashed border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600"
              onClick={addField}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Field
            </Button>
          </form>
        </section>

        {/* JSON Preview Section */}
        <section aria-label="JSON Preview" className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Code className="h-5 w-5 text-green-600" />
              </div>
              <h3
                className="text-xl font-bold text-slate-800"
                style={{
                  fontFamily:
                    "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                JSON Preview
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              aria-label="Copy JSON to clipboard"
              onClick={() => {
                navigator.clipboard.writeText(
                  JSON.stringify(mockData, null, 2)
                );
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-slate-600 font-medium mb-6">
            Live preview of your mock response
          </p>
          <hr className="border-slate-200" />

          <div className="relative">
            <pre className="backdrop-blur-sm bg-slate-900/90 text-green-400 p-6 rounded-xl shadow-lg border border-slate-700/50 overflow-x-auto text-sm leading-relaxed">
              <code>{JSON.stringify(mockData, null, 2)}</code>
            </pre>
          </div>
        </section>
      </div>

      <div className="mt-12 text-center">
        <Button
          className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          onClick={() => onGenerate(schema)}
          disabled={isLoading}
        >
          <Settings2 className="h-5 w-5 mr-2" />
          Generate Mock Endpoint
        </Button>
      </div>
    </div>
  );
}
