import { MockSchema, SchemaField } from "@/types";
import { generateValueForType, isPrimitiveType } from "./field-type-detector";

function generateFieldValue(field: SchemaField, index?: number): any {
  if (field.type === "object" && field.fields) {
    const nestedObj: any = {};
    field.fields.forEach((nestedField) => {
      nestedObj[nestedField.key] = generateFieldValue(nestedField, index);
    });
    return nestedObj;
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
}

export function generateMockData(schema: MockSchema): any {
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
      const obj: any = {};
      if (schema.fields) {
        schema.fields.forEach((field) => {
          obj[field.key] = generateFieldValue(field);
        });
      }
      return obj;

    case "array":
      const length = schema.length || 1;
      const array = [];
      for (let i = 0; i < length; i++) {
        if (schema.fields) {
          const item: any = {};
          schema.fields.forEach((field) => {
            item[field.key] = generateFieldValue(field, i);
          });
          array.push(item);
        }
      }
      return array;

    default:
      return null;
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
