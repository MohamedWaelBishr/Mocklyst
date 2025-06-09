'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { SchemaField } from '@/types';

interface NestedFieldBuilderProps {
  field: SchemaField;
  onUpdate: (field: SchemaField) => void;
  onRemove: () => void;
  depth?: number;
}

export function NestedFieldBuilder({ 
  field, 
  onUpdate, 
  onRemove, 
  depth = 0 
}: NestedFieldBuilderProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const addNestedField = () => {
    if (field.type === 'object') {
      const newFields = [...(field.fields || []), { key: '', type: 'string' as const }];
      onUpdate({ ...field, fields: newFields });
    }
  };

  const removeNestedField = (index: number) => {
    if (field.fields) {
      const newFields = field.fields.filter((_, i) => i !== index);
      onUpdate({ ...field, fields: newFields });
    }
  };

  const updateNestedField = (index: number, updatedField: SchemaField) => {
    if (field.fields) {
      const newFields = field.fields.map((f, i) => i === index ? updatedField : f);
      onUpdate({ ...field, fields: newFields });
    }
  };

  const updateFieldKey = (key: string) => {
    onUpdate({ ...field, key });
  };

  const updateFieldType = (type: 'string' | 'number' | 'boolean' | 'object') => {
    const updatedField: SchemaField = { ...field, type };
    
    if (type === 'object') {
      updatedField.fields = updatedField.fields || [{ key: 'id', type: 'number' }];
      delete updatedField.value;
    } else {
      delete updatedField.fields;
      updatedField.value = getDefaultValue(type);
    }
    
    onUpdate(updatedField);
  };

  const updateFieldValue = (value: string | number | boolean) => {
    onUpdate({ ...field, value });
  };

  const getDefaultValue = (type: string) => {
    switch (type) {
      case 'string': return 'sample text';
      case 'number': return 123;
      case 'boolean': return true;
      default: return undefined;
    }
  };

  const indentClass = `ml-${Math.min(depth * 4, 16)}`;

  return (
    <div className={`space-y-3 ${depth > 0 ? indentClass : ""}`}>
      <Card
        className={`${
          depth > 0
            ? "border-l-4 border-l-blue-200 dark:border-l-blue-600/70"
            : ""
        } bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-gray-200/50 dark:border-slate-600/50 shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {field.type === "object" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 h-auto hover:bg-blue-50 dark:hover:bg-slate-700/80 transition-colors duration-200"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                )}
              </Button>
            )}
            <CardTitle className="text-sm text-gray-900 dark:text-white">
              {field.key || "New Field"}
              {field.type === "object" && (
                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({field.fields?.length || 0} nested field
                  {field.fields?.length !== 1 ? "s" : ""})
                </span>
              )}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {" "}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                Field Name
              </Label>
              <Input
                value={field.key}
                onChange={(e) => updateFieldKey(e.target.value)}
                placeholder="field name"
                className="h-8 bg-white/90 dark:bg-slate-700/90 border-gray-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-slate-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                Type
              </Label>
              <Select value={field.type} onValueChange={updateFieldType}>
                <SelectTrigger className="h-8 bg-white/90 dark:bg-slate-700/90 border-gray-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-slate-500 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-gray-200/50 dark:border-slate-600/50">
                  <SelectItem
                    value="string"
                    className="hover:bg-blue-50 dark:hover:bg-slate-700/80"
                  >
                    String
                  </SelectItem>
                  <SelectItem
                    value="number"
                    className="hover:bg-blue-50 dark:hover:bg-slate-700/80"
                  >
                    Number
                  </SelectItem>
                  <SelectItem
                    value="boolean"
                    className="hover:bg-blue-50 dark:hover:bg-slate-700/80"
                  >
                    Boolean
                  </SelectItem>
                  <SelectItem
                    value="object"
                    className="hover:bg-blue-50 dark:hover:bg-slate-700/80"
                  >
                    Object
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>{" "}
          {/* Value input for primitive types */}
          {field.type !== "object" && (
            <div>
              <Label className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                Value
              </Label>
              {field.type === "string" && (
                <Input
                  value={(field.value as string) || ""}
                  onChange={(e) => updateFieldValue(e.target.value)}
                  placeholder="Enter string value"
                  className="h-8 bg-white/90 dark:bg-slate-700/90 border-gray-200/50 dark:border-slate-600/50 hover:border-purple-300 dark:hover:border-slate-500 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-200"
                />
              )}
              {field.type === "number" && (
                <Input
                  type="number"
                  value={(field.value as number) || 0}
                  onChange={(e) =>
                    updateFieldValue(parseFloat(e.target.value) || 0)
                  }
                  placeholder="Enter number value"
                  className="h-8 bg-white/90 dark:bg-slate-700/90 border-gray-200/50 dark:border-slate-600/50 hover:border-purple-300 dark:hover:border-slate-500 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-200"
                />
              )}
              {field.type === "boolean" && (
                <Select
                  value={String(field.value)}
                  onValueChange={(value) => updateFieldValue(value === "true")}
                >
                  <SelectTrigger className="h-8 bg-white/90 dark:bg-slate-700/90 border-gray-200/50 dark:border-slate-600/50 hover:border-purple-300 dark:hover:border-slate-500 transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-gray-200/50 dark:border-slate-600/50">
                    <SelectItem
                      value="true"
                      className="hover:bg-purple-50 dark:hover:bg-slate-700/80"
                    >
                      true
                    </SelectItem>
                    <SelectItem
                      value="false"
                      className="hover:bg-purple-50 dark:hover:bg-slate-700/80"
                    >
                      false
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}{" "}
          <div className="flex justify-between items-center">
            {field.type === "object" && (
              <Button
                onClick={addNestedField}
                size="sm"
                variant="outline"
                className="bg-white/90 dark:bg-slate-700/90 border-blue-200/50 dark:border-slate-600/50 hover:bg-blue-50 dark:hover:bg-slate-600/90 hover:border-blue-300 dark:hover:border-slate-500 transition-all duration-200"
              >
                <Plus className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300">
                  Add Nested Field
                </span>
              </Button>
            )}
            <Button
              onClick={onRemove}
              size="sm"
              variant="destructive"
              className="ml-auto bg-red-500/90 dark:bg-red-600/90 hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-200"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>{" "}
      {/* Nested fields */}
      {field.type === "object" && isExpanded && field.fields && (
        <div className="space-y-3 border-l-2 border-gray-200 dark:border-slate-600 pl-4">
          {field.fields.map((nestedField, index) => (
            <NestedFieldBuilder
              key={index}
              field={nestedField}
              onUpdate={(updatedField) =>
                updateNestedField(index, updatedField)
              }
              onRemove={() => removeNestedField(index)}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
