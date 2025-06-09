'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Eye, Zap, Settings2, Layers, Code, Play } from "lucide-react";
import { MockSchema, SchemaField } from "@/types";
import { generateMockData } from "@/lib/mock-generator";
import { NestedFieldBuilder } from "@/components/nested-field-builder";

interface SchemaDesignerProps {
  onGenerate: (schema: MockSchema) => void;
  isLoading?: boolean;
}

export function SchemaDesigner({ onGenerate, isLoading }: SchemaDesignerProps) {
  const [schema, setSchema] = useState<MockSchema>({
    type: "object",
    fields: [
      { key: "id", type: "number" },
      {
        key: "myobject",
        type: "object",
        fields: [
          { key: "id", type: "number" },
          { key: "name", type: "string" },
        ],
      },
    ],
  });

  const addField = () => {
    if (schema.type === "object" || schema.type === "array") {
      setSchema((prev) => ({
        ...prev,
        fields: [...(prev.fields || []), { key: "", type: "string" }],
      }));
    }
  };

  const removeField = (index: number) => {
    setSchema((prev) => ({
      ...prev,
      fields: prev.fields?.filter((_, i) => i !== index),
    }));
  };

  const updateField = (index: number, field: SchemaField) => {
    setSchema((prev) => ({
      ...prev,
      fields: prev.fields?.map((f, i) => (i === index ? field : f)),
    }));
  };

  const updateSchemaType = (type: "object" | "array" | "primitive") => {
    if (type === "primitive") {
      setSchema({
        type,
        primitiveType: "string",
        primitiveValue: "sample text",
      });
    } else {
      setSchema({
        type,
        fields: [{ key: "id", type: "number" }],
        ...(type === "array" && { length: 3 }),
      });
    }
  };

  const mockData = generateMockData(schema);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 xl:grid-cols-3 gap-8"
    >
      {/* Schema Designer */}
      <motion.div variants={itemVariants} className="xl:col-span-2">
        {" "}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
              >
                <Settings2 className="h-6 w-6" />
              </motion.div>
              <div>
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  Schema Designer
                </span>
                <CardDescription className="mt-1 text-base text-gray-600 dark:text-gray-300">
                  Design your mock API response structure with precision
                </CardDescription>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Response Type Section */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                  Response Type
                </Label>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Select
                  value={schema.type}
                  onValueChange={(value: "object" | "array" | "primitive") =>
                    updateSchemaType(value)
                  }
                >
                  {" "}
                  <SelectTrigger className="h-12 bg-white/90 dark:bg-slate-800/90 border-blue-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-slate-500 transition-all duration-200 text-base">
                    <SelectValue placeholder="Choose response type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-blue-200/50 dark:border-slate-600/50">
                    <SelectItem
                      value="object"
                      className="text-base hover:bg-blue-50 dark:hover:bg-slate-700/80"
                    >
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Object
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="array"
                      className="text-base hover:bg-blue-50 dark:hover:bg-slate-700/80"
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-green-600 dark:text-green-400" />
                        Array
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="primitive"
                      className="text-base hover:bg-blue-50 dark:hover:bg-slate-700/80"
                    >
                      <div className="flex items-center gap-2">
                        <Play className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        Primitive
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>
            {/* Array Length */}
            <AnimatePresence>
              {schema.type === "array" && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Layers className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                      Array Length
                    </Label>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {" "}
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={schema.length || 1}
                      onChange={(e) =>
                        setSchema((prev) => ({
                          ...prev,
                          length: parseInt(e.target.value) || 1,
                        }))
                      }
                      className="h-12 bg-white/90 dark:bg-slate-800/90 border-green-200/50 dark:border-slate-600/50 hover:border-green-300 dark:hover:border-slate-500 focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 text-base"
                      placeholder="Enter array length"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Primitive Type */}
            <AnimatePresence>
              {schema.type === "primitive" && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Play className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                        Primitive Type
                      </Label>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Select
                        value={schema.primitiveType}
                        onValueChange={(
                          value: "string" | "number" | "boolean"
                        ) =>
                          setSchema((prev) => ({
                            ...prev,
                            primitiveType: value,
                          }))
                        }
                      >
                        {" "}
                        <SelectTrigger className="h-12 bg-white/90 dark:bg-slate-800/90 border-purple-200/50 dark:border-slate-600/50 hover:border-purple-300 dark:hover:border-slate-500 transition-all duration-200 text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-purple-200/50 dark:border-slate-600/50">
                          <SelectItem
                            value="string"
                            className="text-base hover:bg-purple-50 dark:hover:bg-slate-700/80"
                          >
                            String
                          </SelectItem>
                          <SelectItem
                            value="number"
                            className="text-base hover:bg-purple-50 dark:hover:bg-slate-700/80"
                          >
                            Number
                          </SelectItem>
                          <SelectItem
                            value="boolean"
                            className="text-base hover:bg-purple-50 dark:hover:bg-slate-700/80"
                          >
                            Boolean
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                      Value
                    </Label>

                    {schema.primitiveType === "string" && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        {" "}
                        <Input
                          value={(schema.primitiveValue as string) || ""}
                          onChange={(e) =>
                            setSchema((prev) => ({
                              ...prev,
                              primitiveValue: e.target.value,
                            }))
                          }
                          placeholder="Enter string value"
                          className="h-12 bg-white/90 dark:bg-slate-800/90 border-purple-200/50 dark:border-slate-600/50 hover:border-purple-300 dark:hover:border-slate-500 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-200 text-base"
                        />
                      </motion.div>
                    )}

                    {schema.primitiveType === "number" && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        {" "}
                        <Input
                          type="number"
                          value={(schema.primitiveValue as number) || 0}
                          onChange={(e) =>
                            setSchema((prev) => ({
                              ...prev,
                              primitiveValue: parseFloat(e.target.value) || 0,
                            }))
                          }
                          placeholder="Enter number value"
                          className="h-12 bg-white/90 dark:bg-slate-800/90 border-purple-200/50 dark:border-slate-600/50 hover:border-purple-300 dark:hover:border-slate-500 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-200 text-base"
                        />
                      </motion.div>
                    )}

                    {schema.primitiveType === "boolean" && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Select
                          value={String(schema.primitiveValue)}
                          onValueChange={(value) =>
                            setSchema((prev) => ({
                              ...prev,
                              primitiveValue: value === "true",
                            }))
                          }
                        >
                          {" "}
                          <SelectTrigger className="h-12 bg-white/90 dark:bg-slate-800/90 border-purple-200/50 dark:border-slate-600/50 hover:border-purple-300 dark:hover:border-slate-500 transition-all duration-200 text-base">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-purple-200/50 dark:border-slate-600/50">
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
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Object/Array Fields */}
            <AnimatePresence>
              {(schema.type === "object" || schema.type === "array") && (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <Label className="text-lg font-semibold text-gray-900 dark:text-white">
                        Fields
                      </Label>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={addField}
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Field
                      </Button>
                    </motion.div>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence>
                      {schema.fields?.map((field, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <NestedFieldBuilder
                            field={field}
                            onUpdate={(updatedField) =>
                              updateField(index, updatedField)
                            }
                            onRemove={() => removeField(index)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>{" "}
            <motion.div variants={itemVariants}>
              <Separator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent" />
            </motion.div>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => onGenerate(schema)}
                className="w-full h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-3"
                  >
                    <Settings2 className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <Zap className="h-5 w-5 mr-3" />
                )}
                {isLoading ? "Generating..." : "Generate Mock Endpoint"}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>{" "}
      {/* JSON Preview */}
      <motion.div variants={itemVariants} className="xl:col-span-1">
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-300 h-fit sticky top-8">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg"
              >
                <Eye className="h-5 w-5" />
              </motion.div>
              <div>
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                  JSON Preview
                </span>
                <CardDescription className="mt-1 text-gray-600 dark:text-gray-300">
                  Live preview of your mock response
                </CardDescription>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <motion.div
              className="flex flex-wrap items-center gap-3"
              variants={itemVariants}
            >
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 px-3 py-1"
              >
                {schema.type === "array"
                  ? `Array (${schema.length || 1} items)`
                  : schema.type === "object"
                  ? "Object"
                  : `Primitive (${schema.primitiveType})`}
              </Badge>

              {(schema.type === "object" || schema.type === "array") && (
                <Badge
                  variant="outline"
                  className="border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 px-3 py-1"
                >
                  {schema.fields?.length || 0} field
                  {(schema.fields?.length || 0) !== 1 ? "s" : ""}
                </Badge>
              )}
            </motion.div>{" "}
            <motion.div
              variants={itemVariants}
              className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-800/90 dark:to-slate-900/90 rounded-2xl p-6 overflow-auto border border-gray-200/50 dark:border-slate-600/50 shadow-inner max-h-96"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <pre className="text-sm leading-relaxed text-gray-800 dark:text-gray-100 font-mono">
                {JSON.stringify(mockData, null, 2)}
              </pre>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
