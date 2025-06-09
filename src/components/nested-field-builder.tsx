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
    <div className={`space-y-3 ${depth > 0 ? indentClass : ''}`}>
      <Card className={`${depth > 0 ? 'border-l-4 border-l-blue-200 dark:border-l-blue-800' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {field.type === 'object' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-0 h-auto"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            <CardTitle className="text-sm">
              {field.key || 'New Field'} 
              {field.type === 'object' && (
                <span className="text-xs font-normal text-muted-foreground ml-2">
                  ({field.fields?.length || 0} nested field{field.fields?.length !== 1 ? 's' : ''})
                </span>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Field Name</Label>
              <Input
                value={field.key}
                onChange={(e) => updateFieldKey(e.target.value)}
                placeholder="field name"
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Type</Label>
              <Select 
                value={field.type} 
                onValueChange={updateFieldType}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="object">Object</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Value input for primitive types */}
          {field.type !== 'object' && (
            <div>
              <Label className="text-xs">Value</Label>
              {field.type === 'string' && (
                <Input
                  value={field.value as string || ''}
                  onChange={(e) => updateFieldValue(e.target.value)}
                  placeholder="Enter string value"
                  className="h-8"
                />
              )}
              {field.type === 'number' && (
                <Input
                  type="number"
                  value={field.value as number || 0}
                  onChange={(e) => updateFieldValue(parseFloat(e.target.value) || 0)}
                  placeholder="Enter number value"
                  className="h-8"
                />
              )}
              {field.type === 'boolean' && (
                <Select 
                  value={String(field.value)} 
                  onValueChange={(value) => updateFieldValue(value === 'true')}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">true</SelectItem>
                    <SelectItem value="false">false</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            {field.type === 'object' && (
              <Button onClick={addNestedField} size="sm" variant="outline">
                <Plus className="h-3 w-3 mr-1" />
                Add Nested Field
              </Button>
            )}
            <Button 
              onClick={onRemove} 
              size="sm" 
              variant="destructive"
              className="ml-auto"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Nested fields */}
      {field.type === 'object' && isExpanded && field.fields && (
        <div className="space-y-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
          {field.fields.map((nestedField, index) => (
            <NestedFieldBuilder
              key={index}
              field={nestedField}
              onUpdate={(updatedField) => updateNestedField(index, updatedField)}
              onRemove={() => removeNestedField(index)}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
