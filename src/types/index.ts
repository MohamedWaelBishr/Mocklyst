import { SmartFieldType } from "@/lib/field-type-detector";

export interface SchemaField {
  key: string;
  type: SmartFieldType;
  value?: string | number | boolean; // For primitive values
  fields?: SchemaField[]; // For nested objects and array items
  length?: number; // For array types (max 100)
}

export interface MockSchema {
  type: "object" | "array" | "primitive";
  primitiveType?: SmartFieldType;
  primitiveValue?: string | number | boolean;
  fields?: SchemaField[];
  length?: number;
}

export interface MockEndpoint {
  id: string;
  config: MockSchema;
  endpoint: string;
  createdAt: Date;
  expiresAt: Date;
  updatedAt: Date;
  hits: number;
}

export interface CreateMockRequest {
  type: "object" | "array" | "primitive";
  primitiveType?: SmartFieldType;
  primitiveValue?: string | number | boolean;
  fields?: SchemaField[];
  length?: number;
}

export interface CreateMockResponse {
  endpoint: string;
  id: string;
  expiresAt: string;
}
