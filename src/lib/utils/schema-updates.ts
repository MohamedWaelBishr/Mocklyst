// Optimized schema update utilities
import { MockSchema, SchemaField } from "@/types";

/**
 * Efficiently update a schema field by path without cloning the entire object
 * Optimized to reduce memory allocation and improve performance
 */
export function updateSchemaFieldByPath(
  schema: MockSchema,
  path: string,
  updater: (field: SchemaField) => SchemaField
): MockSchema {
  const pathArray = path.split('.').map(Number);
  const newSchema = { ...schema };
  
  // Only clone the path we're updating
  let current: any = newSchema;
  
  for (let i = 0; i < pathArray.length - 1; i++) {
    const index = pathArray[i];
    if (!current.fields) break;
    
    current.fields = [...current.fields];
    current = current.fields[index] = { ...current.fields[index] };
  }
  
  const lastIndex = pathArray[pathArray.length - 1];
  if (current.fields) {
    current.fields = [...current.fields];
    current.fields[lastIndex] = updater({ ...current.fields[lastIndex] });
  }
  
  return newSchema;
}

/**
 * Efficiently add a nested field without full object cloning
 * Optimized to minimize memory allocations
 */
export function addNestedFieldByPath(
  schema: MockSchema,
  path: string,
  newField: SchemaField = { key: "", type: "string", value: "" }
): MockSchema {
  const pathArray = path.split('.').map(Number);
  const newSchema = { ...schema };
  
  let current: any = newSchema;
  
  for (let i = 0; i < pathArray.length; i++) {
    const index = pathArray[i];
    if (!current.fields) break;
    
    current.fields = [...current.fields];
    if (i === pathArray.length - 1) {
      // We're at the target field
      current = current.fields[index] = { ...current.fields[index] };
    } else {
      current = current.fields[index] = { ...current.fields[index] };
    }
  }
  
  if (current.type === "object" || current.type === "array") {
    if (!current.fields) {
      current.fields = [];
    } else {
      current.fields = [...current.fields];
    }
    current.fields.push(newField);
  }
  
  return newSchema;
}

/**
 * Efficiently remove a field by path without full schema cloning
 * Optimized for better performance with large schemas
 */
export function removeFieldByPath(
  schema: MockSchema,
  path: string
): MockSchema {
  const pathArray = path.split('.').map(Number);
  const newSchema = { ...schema };
  
  if (pathArray.length === 1) {
    // Removing top-level field
    newSchema.fields = newSchema.fields?.filter((_, i) => i !== pathArray[0]);
  } else {
    // Removing nested field
    let current: any = newSchema;
    
    for (let i = 0; i < pathArray.length - 1; i++) {
      const index = pathArray[i];
      if (!current.fields) break;
      
      current.fields = [...current.fields];
      current = current.fields[index] = { ...current.fields[index] };
    }
    
    const lastIndex = pathArray[pathArray.length - 1];
    if (current.fields) {
      current.fields = current.fields.filter((_:any, i:any) => i !== lastIndex);
    }
  }
  
  return newSchema;
}

/**
 * Get default value for a field type with more realistic examples
 */
export function getDefaultValueForType(type: string): any {
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
      return new Date().toISOString().split('T')[0];
    case "uuid":
      return "123e4567-e89b-12d3-a456-426614174000";
    case "phoneNumber":
      return "+1-555-123-4567";
    case "object":
      return {};
    case "array":
      return [];
    default:
      return "";
  }
}
