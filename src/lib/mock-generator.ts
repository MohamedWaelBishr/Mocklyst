import { MockSchema, SchemaField } from "@/types";
import { generateValueForType, isPrimitiveType } from "./field-type-detector";

interface GenerationContext {
  depth: number;
  maxDepth: number;
  generatedPaths: Set<string>;
}

function generateFieldValueOptimized(
  field: SchemaField,
  context: GenerationContext,
  path: string = ""
): any {
  // Prevent infinite recursion
  if (context.depth > context.maxDepth || context.generatedPaths.has(path)) {
    return getDefaultValueForType(field.type);
  }

  context.generatedPaths.add(path);
  context.depth++;

  try {
    if (field.type === "object" && field.fields) {
      const obj: Record<string, any> = {};
      // Use for loop for better performance than forEach
      for (let i = 0; i < field.fields.length; i++) {
        const nestedField = field.fields[i];
        if (nestedField.key) {
          obj[nestedField.key] = generateFieldValueOptimized(
            nestedField,
            context,
            `${path}.${nestedField.key}`
          );
        }
      }
      return obj;
    }

    if (field.type === "array" && field.fields) {
      const arrayLength = Math.min(field.length || 3, 50); // Limit array size
      const array = new Array(arrayLength);

      for (let i = 0; i < arrayLength; i++) {
        const item: Record<string, any> = {};
        for (let j = 0; j < field.fields.length; j++) {
          const nestedField = field.fields[j];
          if (nestedField.key) {
            item[nestedField.key] = generateFieldValueOptimized(
              nestedField,
              context,
              `${path}[${i}].${nestedField.key}`
            );
          }
        }
        array[i] = item;
      }
      return array;
    }

    // If there's a custom value that's not empty, use it for primitive types
    if (
      field.value !== undefined &&
      field.value !== "" &&
      isPrimitiveType(field.type)
    ) {
      return field.value;
    }

    // Use smart field type generation
    return generateValueForType(field.type);
  } finally {
    context.depth--;
  }
}

function getDefaultValueForType(type: string): any {
  switch (type) {
    case "string":
      return "sample text";
    case "number":
      return 123;
    case "boolean":
      return true;
    case "email":
      return "user@example.com";
    case "url":
      return "https://example.com";
    case "date":
      return new Date().toISOString().split("T")[0];
    case "uuid":
      return "123e4567-e89b-12d3-a456-426614174000";
    case "phoneNumber":
      return "+1-555-123-4567";
    default:
      return "";
  }
}

// Legacy function for backward compatibility
function generateFieldValue(field: SchemaField, index?: number): any {
  const context: GenerationContext = {
    depth: 0,
    maxDepth: 10,
    generatedPaths: new Set(),
  };

  return generateFieldValueOptimized(field, context);
}

export function generateMockData(schema: MockSchema): any {
  const context: GenerationContext = {
    depth: 0,
    maxDepth: 10,
    generatedPaths: new Set(),
  };

  switch (schema.type) {
    case "primitive":
      // If there's a custom value that's not empty, use it for primitive types
      if (
        schema.primitiveValue !== undefined &&
        schema.primitiveValue !== "" &&
        schema.primitiveType &&
        isPrimitiveType(schema.primitiveType)
      ) {
        return schema.primitiveValue;
      }
      // Use smart field type generation
      return generateValueForType(schema.primitiveType || "string");

    case "object":
      if (!schema.fields || schema.fields.length === 0) {
        return {};
      }

      const obj: Record<string, any> = {};
      // Use for loop for better performance
      for (let i = 0; i < schema.fields.length; i++) {
        const field = schema.fields[i];
        if (field.key) {
          obj[field.key] = generateFieldValueOptimized(
            field,
            context,
            field.key
          );
        }
      }
      return obj;

    case "array":
      if (!schema.fields || schema.fields.length === 0) {
        return [];
      }

      const arrayLength = Math.min(schema.length || 3, 50); // Limit to 50 items
      const array = new Array(arrayLength);

      for (let i = 0; i < arrayLength; i++) {
        const item: Record<string, any> = {};
        for (let j = 0; j < schema.fields.length; j++) {
          const field = schema.fields[j];
          if (field.key) {
            item[field.key] = generateFieldValueOptimized(
              field,
              context,
              `[${i}].${field.key}`
            );
          }
        }
        array[i] = item;
      }
      return array;

    default:
      return {};
  }
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 8);
}

export function formatExpiryDate(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Expired";
  } else if (diffDays === 1) {
    return "1 day remaining";
  } else {
    return `${diffDays} days remaining`;
  }
}
