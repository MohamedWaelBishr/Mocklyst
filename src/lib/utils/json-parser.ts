import { MockSchema, SchemaField } from "@/types";
import { detectFieldType, SmartFieldType } from "@/lib/field-type-detector";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  lineNumber?: number;
  column?: number;
}

export interface ParseResult {
  schema: MockSchema | null;
  validation: ValidationResult;
}

/**
 * Validates JSON structure and returns detailed error information
 */
export function validateJsonStructure(jsonString: string): ValidationResult {
  if (!jsonString.trim()) {
    return {
      isValid: false,
      error: "Empty JSON string",
    };
  }

  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Try to extract line and column information from the error message
      const match = error.message.match(/at position (\d+)/);
      const position = match ? parseInt(match[1], 10) : undefined;
      
      let lineNumber: number | undefined;
      let column: number | undefined;
      
      if (position !== undefined) {
        const lines = jsonString.substring(0, position).split('\n');
        lineNumber = lines.length;
        column = lines[lines.length - 1].length + 1;
      }

      return {
        isValid: false,
        error: error.message,
        lineNumber,
        column,
      };
    }
    
    return {
      isValid: false,
      error: "Invalid JSON format",
    };
  }
}

/**
 * Infers the appropriate field type based on the JSON value and key
 */
export function inferFieldTypes(jsonValue: any, key: string): SmartFieldType {
  // If the value is null or undefined, default to string
  if (jsonValue === null || jsonValue === undefined) {
    return "string";
  }

  // For primitive types, use the basic type first
  if (typeof jsonValue === "boolean") {
    return "boolean";
  }
  
  if (typeof jsonValue === "number") {
    return "number";
  }
  
  if (typeof jsonValue === "string") {
    // Use smart field detection for strings
    const suggestions = detectFieldType(key);
    if (suggestions.length > 0 && suggestions[0].confidence > 0.7) {
      return suggestions[0].type;
    }
    
    // Additional pattern matching based on the actual value
    if (isEmail(jsonValue)) return "email";
    if (isUrl(jsonValue)) return "url";
    if (isUuid(jsonValue)) return "uuid";
    if (isDate(jsonValue)) return "date";
    if (isPhoneNumber(jsonValue)) return "phone";
    if (isColor(jsonValue)) return "color";
    
    return "string";
  }
  
  if (Array.isArray(jsonValue)) {
    return "array";
  }
  
  if (typeof jsonValue === "object") {
    return "object";
  }
  
  return "string";
}

/**
 * Converts a parsed JSON object into a SchemaField structure
 */
function convertObjectToSchemaFields(obj: Record<string, any>): SchemaField[] {
  return Object.entries(obj).map(([key, value]) => {
    const type = inferFieldTypes(value, key);
    
    const field: SchemaField = {
      key,
      type,
    };
    
    if (type === "object" && value && typeof value === "object" && !Array.isArray(value)) {
      field.fields = convertObjectToSchemaFields(value);
    } else if (type === "array" && Array.isArray(value)) {
      // For arrays, we need to determine the structure
      if (value.length > 0) {
        const firstItem = value[0];
        if (typeof firstItem === "object" && !Array.isArray(firstItem)) {
          // Array of objects - use the first object as the template
          field.fields = convertObjectToSchemaFields(firstItem);
        } else {
          // Array of primitives - create a single field representing the array item type
          const itemType = inferFieldTypes(firstItem, "item");
          field.fields = [{
            key: "item",
            type: itemType,
            value: firstItem,
          }];
        }
      } else {
        // Empty array - default to string items
        field.fields = [{
          key: "item",
          type: "string",
          value: "",
        }];
      }
      field.length = Math.min(value.length, 10); // Cap at 10 for reasonable UI
    } else {
      // Primitive value
      field.value = value;
    }
    
    return field;
  });
}

/**
 * Parses JSON string and converts it to MockSchema format
 */
export function parseJsonToSchema(jsonString: string): ParseResult {
  const validation = validateJsonStructure(jsonString);
  
  if (!validation.isValid) {
    return {
      schema: null,
      validation,
    };
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    
    let schema: MockSchema;
    
    if (Array.isArray(parsed)) {
      // Root is an array
      schema = {
        type: "array",
        length: Math.min(parsed.length, 10), // Cap at 10 for UI
      };
      
      if (parsed.length > 0) {
        const firstItem = parsed[0];
        if (typeof firstItem === "object" && !Array.isArray(firstItem)) {
          schema.fields = convertObjectToSchemaFields(firstItem);
        } else {
          // Array of primitives
          const itemType = inferFieldTypes(firstItem, "item");
          schema.fields = [{
            key: "item",
            type: itemType,
            value: firstItem,
          }];
        }
      } else {
        // Empty array
        schema.fields = [{
          key: "item",
          type: "string",
          value: "",
        }];
      }
    } else if (typeof parsed === "object" && parsed !== null) {
      // Root is an object
      schema = {
        type: "object",
        fields: convertObjectToSchemaFields(parsed),
      };
    } else {
      // Root is a primitive
      const primitiveType = inferFieldTypes(parsed, "value");
      schema = {
        type: "primitive",
        primitiveType,
        primitiveValue: parsed,
      };
    }
    
    return {
      schema,
      validation: { isValid: true },
    };
  } catch (error) {
    return {
      schema: null,
      validation: {
        isValid: false,
        error: `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    };
  }
}

// Helper functions for pattern matching
function isEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

function isDate(value: string): boolean {
  if (value.length < 8) return false; // Too short to be a date
  const date = new Date(value);
  return !isNaN(date.getTime()) && value.includes('-');
}

function isPhoneNumber(value: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanValue = value.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanValue) && cleanValue.length >= 7;
}

function isColor(value: string): boolean {
  // Check for hex colors
  const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
  if (hexRegex.test(value)) return true;
  
  // Check for RGB/RGBA
  const rgbRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/i;
  if (rgbRegex.test(value)) return true;
  
  // Check for common color names
  const colorNames = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white', 'gray', 'brown'];
  return colorNames.includes(value.toLowerCase());
}
