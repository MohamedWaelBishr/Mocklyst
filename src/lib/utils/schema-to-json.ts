import { MockSchema, SchemaField } from "@/types";
import { generateMockData } from "@/lib/mock-generator";

/**
 * Converts a SchemaField array to a JSON object
 */
function convertSchemaFieldsToObject(fields: SchemaField[]): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const field of fields) {
    if (!field.key) continue; // Skip fields without keys
    
    if (field.type === "object" && field.fields) {
      result[field.key] = convertSchemaFieldsToObject(field.fields);
    } else if (field.type === "array" && field.fields) {
      const arrayLength = field.length || 3; // Default to 3 items
      result[field.key] = Array.from({ length: arrayLength }, () => {
        if (field.fields!.length === 1 && field.fields![0].key === "item") {
          // Array of primitives
          const itemField = field.fields![0];
          return getFieldValue(itemField);
        } else {
          // Array of objects
          return convertSchemaFieldsToObject(field.fields!);
        }
      });
    } else {
      // Primitive field
      result[field.key] = getFieldValue(field);
    }
  }
  
  return result;
}

/**
 * Gets the appropriate value for a field based on its type and value
 */
function getFieldValue(field: SchemaField): any {
  // If a specific value is set, use it (with type conversion)
  if (field.value !== undefined && field.value !== null && field.value !== "") {
    switch (field.type) {
      case "number":
        const numValue = Number(field.value);
        return isNaN(numValue) ? 0 : numValue;
      case "boolean":
        if (typeof field.value === "boolean") return field.value;
        return field.value === "true" || field.value === "1";
      default:
        return field.value;
    }
  }
  
  // Generate appropriate default values based on type
  switch (field.type) {
    case "string":
      return "string_value";
    case "number":
      return 123;
    case "boolean":
      return true;
    case "email":
      return "user@example.com";
    case "firstName":
      return "John";
    case "lastName":
      return "Doe";
    case "fullName":
      return "John Doe";
    case "phone":
      return "+1-234-567-8900";
    case "address":
      return "123 Main St";
    case "city":
      return "New York";
    case "country":
      return "United States";
    case "zipCode":
      return "10001";
    case "company":
      return "Acme Corp";
    case "jobTitle":
      return "Software Engineer";
    case "date":
      return new Date().toISOString().split('T')[0];
    case "url":
      return "https://example.com";
    case "username":
      return "johndoe";
    case "password":
      return "password123";
    case "uuid":
      return "123e4567-e89b-12d3-a456-426614174000";
    case "avatar":
      return "https://avatars.githubusercontent.com/u/1?v=4";
    case "price":
      return 29.99;
    case "currency":
      return "USD";
    case "color":
      return "#3b82f6";
    case "ip":
      return "192.168.1.1";
    case "mac":
      return "00:1B:44:11:3A:B7";
    case "domain":
      return "example.com";
    case "creditCard":
      return "4111-1111-1111-1111";
    case "iban":
      return "GB82 WEST 1234 5698 7654 32";
    case "age":
      return 25;
    case "gender":
      return "male";
    case "description":
      return "Lorem ipsum dolor sit amet";
    case "title":
      return "Sample Title";
    case "image":
      return "https://picsum.photos/200/300";
    default:
      return "";
  }
}

/**
 * Converts a MockSchema to formatted JSON string
 */
export function schemaToJson(schema: MockSchema): string {
  try {
    let jsonObject: any;
    
    if (schema.type === "primitive") {
      // For primitive types, return the value directly
      if (schema.primitiveValue !== undefined && schema.primitiveValue !== null && schema.primitiveValue !== "") {
        jsonObject = schema.primitiveValue;
      } else {
        // Generate default value based on primitive type
        const dummyField: SchemaField = {
          key: "value",
          type: schema.primitiveType || "string",
          value: undefined,
        };
        jsonObject = getFieldValue(dummyField);
      }
    } else if (schema.type === "array") {
      const arrayLength = schema.length || 3;
      if (schema.fields && schema.fields.length > 0) {
        jsonObject = Array.from({ length: arrayLength }, () => {
          if (schema.fields!.length === 1 && schema.fields![0].key === "item") {
            // Array of primitives
            return getFieldValue(schema.fields![0]);
          } else {
            // Array of objects
            return convertSchemaFieldsToObject(schema.fields!);
          }
        });
      } else {
        // Empty array structure
        jsonObject = ["string_value", "string_value", "string_value"];
      }
    } else {
      // Object type
      if (schema.fields && schema.fields.length > 0) {
        jsonObject = convertSchemaFieldsToObject(schema.fields);
      } else {
        jsonObject = {};
      }
    }
    
    return JSON.stringify(jsonObject, null, 2);
  } catch (error) {
    console.error("Error converting schema to JSON:", error);
    return "{}";
  }
}

/**
 * Formats a JSON object into a pretty-printed string
 */
export function formatJsonOutput(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    console.error("Error formatting JSON:", error);
    return "{}";
  }
}

/**
 * Converts schema to JSON using the existing mock generator for consistency
 * This ensures the output matches what users see in the current preview
 */
export function schemaToJsonWithMockGenerator(schema: MockSchema): string {
  try {
    const mockData = generateMockData(schema);
    return JSON.stringify(mockData, null, 2);
  } catch (error) {
    console.error("Error generating mock data:", error);
    return schemaToJson(schema); // Fallback to our implementation
  }
}
