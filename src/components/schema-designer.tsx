'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Eye, Zap } from 'lucide-react';
import { MockSchema, SchemaField } from '@/types';
import { generateMockData } from '@/lib/mock-generator';

interface SchemaDesignerProps {
  onGenerate: (schema: MockSchema) => void;
  isLoading?: boolean;
}

export function SchemaDesigner({ onGenerate, isLoading }: SchemaDesignerProps) {
  const [schema, setSchema] = useState<MockSchema>({
    type: 'object',
    fields: [{ key: 'id', type: 'number' }]
  });

  const addField = () => {
    if (schema.type === 'object' || schema.type === 'array') {
      setSchema(prev => ({
        ...prev,
        fields: [...(prev.fields || []), { key: '', type: 'string' }]
      }));
    }
  };

  const removeField = (index: number) => {
    setSchema(prev => ({
      ...prev,
      fields: prev.fields?.filter((_, i) => i !== index)
    }));
  };

  const updateField = (index: number, field: SchemaField) => {
    setSchema(prev => ({
      ...prev,
      fields: prev.fields?.map((f, i) => i === index ? field : f)
    }));
  };

  const updateSchemaType = (type: 'object' | 'array' | 'primitive') => {
    if (type === 'primitive') {
      setSchema({
        type,
        primitiveType: 'string',
        primitiveValue: 'sample text'
      });
    } else {
      setSchema({
        type,
        fields: [{ key: 'id', type: 'number' }],
        ...(type === 'array' && { length: 3 })
      });
    }
  };

  const mockData = generateMockData(schema);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Schema Designer */}
      <Card>        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Schema Designer
          </CardTitle>
          <CardDescription>
            Design your mock API response structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Response Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Response Type</Label>
            <Select 
              value={schema.type} 
              onValueChange={(value: 'object' | 'array' | 'primitive') => updateSchemaType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="object">Object</SelectItem>
                <SelectItem value="array">Array</SelectItem>
                <SelectItem value="primitive">Primitive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Array Length */}
          {schema.type === 'array' && (
            <div className="space-y-2">
              <Label htmlFor="length">Array Length</Label>
              <Input
                id="length"
                type="number"
                min="1"
                max="100"
                value={schema.length || 1}
                onChange={(e) => setSchema(prev => ({ 
                  ...prev, 
                  length: parseInt(e.target.value) || 1 
                }))}
              />
            </div>
          )}

          {/* Primitive Type */}
          {schema.type === 'primitive' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primitiveType">Primitive Type</Label>
                <Select 
                  value={schema.primitiveType} 
                  onValueChange={(value: 'string' | 'number' | 'boolean') => 
                    setSchema(prev => ({ ...prev, primitiveType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primitiveValue">Value</Label>
                {schema.primitiveType === 'string' && (
                  <Input
                    id="primitiveValue"
                    value={schema.primitiveValue as string || ''}
                    onChange={(e) => setSchema(prev => ({ 
                      ...prev, 
                      primitiveValue: e.target.value 
                    }))}
                    placeholder="Enter string value"
                  />
                )}
                {schema.primitiveType === 'number' && (
                  <Input
                    id="primitiveValue"
                    type="number"
                    value={schema.primitiveValue as number || 0}
                    onChange={(e) => setSchema(prev => ({ 
                      ...prev, 
                      primitiveValue: parseFloat(e.target.value) || 0 
                    }))}
                    placeholder="Enter number value"
                  />
                )}
                {schema.primitiveType === 'boolean' && (
                  <Select 
                    value={String(schema.primitiveValue)} 
                    onValueChange={(value) => 
                      setSchema(prev => ({ ...prev, primitiveValue: value === 'true' }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">true</SelectItem>
                      <SelectItem value="false">false</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}

          {/* Object/Array Fields */}
          {(schema.type === 'object' || schema.type === 'array') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Fields</Label>
                <Button onClick={addField} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Field
                </Button>
              </div>
              
              <div className="space-y-3">
                {schema.fields?.map((field, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label className="text-xs">Key</Label>
                      <Input
                        value={field.key}
                        onChange={(e) => updateField(index, { ...field, key: e.target.value })}
                        placeholder="field name"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs">Type</Label>
                      <Select 
                        value={field.type} 
                        onValueChange={(value: 'string' | 'number' | 'boolean') => 
                          updateField(index, { ...field, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">String</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={() => removeField(index)} 
                      size="sm" 
                      variant="outline"
                      className="mb-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <Button 
            onClick={() => onGenerate(schema)} 
            className="w-full" 
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? 'Generating...' : 'Generate Mock Endpoint'}
          </Button>
        </CardContent>
      </Card>      {/* JSON Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            JSON Preview
          </CardTitle>
          <CardDescription>
            Live preview of your mock response
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {schema.type === 'array' ? `Array (${schema.length || 1} items)` : 
               schema.type === 'object' ? 'Object' : 
               `Primitive (${schema.primitiveType})`}
            </Badge>
            {(schema.type === 'object' || schema.type === 'array') && (
              <Badge variant="outline">
                {schema.fields?.length || 0} field{(schema.fields?.length || 0) !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 overflow-auto">
            <pre className="text-sm">
              {JSON.stringify(mockData, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
