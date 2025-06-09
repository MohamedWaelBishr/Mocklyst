export interface SchemaField {
  key: string;
  type: 'string' | 'number' | 'boolean';
}

export interface MockSchema {
  type: 'object' | 'array' | 'primitive';
  primitiveType?: 'string' | 'number' | 'boolean';
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
}

export interface CreateMockRequest {
  type: 'object' | 'array' | 'primitive';
  primitiveType?: 'string' | 'number' | 'boolean';
  primitiveValue?: string | number | boolean;
  fields?: SchemaField[];
  length?: number;
}

export interface CreateMockResponse {
  endpoint: string;
  id: string;
  expiresAt: string;
}
