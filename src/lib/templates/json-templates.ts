import { MockSchema } from "@/types";

export interface JSONTemplate {
  id: string;
  name: string;
  description: string;
  category: 'user' | 'ecommerce' | 'blog' | 'api' | 'business';
  icon: string;
  schema: MockSchema;
  tags: string[];
}

export const jsonTemplates: JSONTemplate[] = [
  // User Templates
  {
    id: 'user-profile',
    name: 'User Profile',
    description: 'Complete user profile with personal information',
    category: 'user',
    icon: '👤',
    tags: ['user', 'profile', 'personal'],
    schema: {
      type: 'object',
      fields: [
        { key: 'id', type: 'number', value: 1 },
        { key: 'firstName', type: 'firstName', value: 'John' },
        { key: 'lastName', type: 'lastName', value: 'Doe' },
        { key: 'email', type: 'email', value: 'john.doe@example.com' },
        { key: 'age', type: 'age', value: 25 },
        { key: 'avatar', type: 'avatar', value: 'https://avatars.githubusercontent.com/u/1?v=4' },
        { key: 'phone', type: 'phone', value: '+1-234-567-8900' },
        { 
          key: 'address', 
          type: 'object',
          fields: [
            { key: 'street', type: 'address', value: '123 Main St' },
            { key: 'city', type: 'city', value: 'New York' },
            { key: 'zipCode', type: 'zipCode', value: '10001' },
            { key: 'country', type: 'country', value: 'United States' }
          ]
        }
      ]
    }
  },
  {
    id: 'user-list',
    name: 'User List',
    description: 'Array of users with basic information',
    category: 'user',
    icon: '👥',
    tags: ['users', 'list', 'array'],
    schema: {
      type: 'array',
      length: 5,
      fields: [
        { key: 'id', type: 'number', value: 1 },
        { key: 'name', type: 'fullName', value: 'John Doe' },
        { key: 'email', type: 'email', value: 'user@example.com' },
        { key: 'username', type: 'username', value: 'johndoe' },
        { key: 'isActive', type: 'boolean', value: true }
      ]
    }
  },

  // E-commerce Templates
  {
    id: 'product',
    name: 'Product',
    description: 'E-commerce product with pricing and details',
    category: 'ecommerce',
    icon: '🛍️',
    tags: ['product', 'ecommerce', 'shopping'],
    schema: {
      type: 'object',
      fields: [
        { key: 'id', type: 'number', value: 1 },
        { key: 'name', type: 'title', value: 'Awesome Product' },
        { key: 'description', type: 'description', value: 'This is an amazing product' },
        { key: 'price', type: 'price', value: 29.99 },
        { key: 'currency', type: 'currency', value: 'USD' },
        { key: 'image', type: 'image', value: 'https://picsum.photos/400/300' },
        { key: 'inStock', type: 'boolean', value: true },
        { key: 'category', type: 'string', value: 'Electronics' },
        { 
          key: 'tags', 
          type: 'array',
          length: 3,
          fields: [
            { key: 'item', type: 'string', value: 'tech' }
          ]
        }
      ]
    }
  },
  {
    id: 'order',
    name: 'Order',
    description: 'Customer order with items and billing',
    category: 'ecommerce',
    icon: '📦',
    tags: ['order', 'purchase', 'billing'],
    schema: {
      type: 'object',
      fields: [
        { key: 'id', type: 'uuid', value: '123e4567-e89b-12d3-a456-426614174000' },
        { key: 'orderNumber', type: 'string', value: 'ORD-2024-001' },
        { key: 'customerId', type: 'number', value: 123 },
        { key: 'status', type: 'string', value: 'pending' },
        { key: 'total', type: 'price', value: 299.99 },
        { key: 'currency', type: 'currency', value: 'USD' },
        { key: 'orderDate', type: 'date', value: new Date().toISOString().split('T')[0] },
        {
          key: 'items',
          type: 'array',
          length: 3,
          fields: [
            { key: 'productId', type: 'number', value: 1 },
            { key: 'name', type: 'title', value: 'Product Name' },
            { key: 'quantity', type: 'number', value: 2 },
            { key: 'price', type: 'price', value: 99.99 }
          ]
        }
      ]
    }
  },

  // Blog Templates
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Blog article with author and metadata',
    category: 'blog',
    icon: '📝',
    tags: ['blog', 'article', 'content'],
    schema: {
      type: 'object',
      fields: [
        { key: 'id', type: 'number', value: 1 },
        { key: 'title', type: 'title', value: 'Amazing Blog Post Title' },
        { key: 'slug', type: 'string', value: 'amazing-blog-post-title' },
        { key: 'content', type: 'description', value: 'This is the blog post content...' },
        { key: 'excerpt', type: 'description', value: 'Brief excerpt of the post' },
        { key: 'publishedAt', type: 'date', value: new Date().toISOString().split('T')[0] },
        { key: 'readTime', type: 'number', value: 5 },
        { key: 'featured', type: 'boolean', value: false },
        {
          key: 'author',
          type: 'object',
          fields: [
            { key: 'id', type: 'number', value: 1 },
            { key: 'name', type: 'fullName', value: 'Jane Smith' },
            { key: 'email', type: 'email', value: 'jane@example.com' },
            { key: 'avatar', type: 'avatar', value: 'https://avatars.githubusercontent.com/u/2?v=4' }
          ]
        },
        {
          key: 'tags',
          type: 'array',
          length: 4,
          fields: [
            { key: 'item', type: 'string', value: 'technology' }
          ]
        }
      ]
    }
  },

  // API Response Templates
  {
    id: 'api-response',
    name: 'API Response',
    description: 'Standard API response with data and metadata',
    category: 'api',
    icon: '🌐',
    tags: ['api', 'response', 'standard'],
    schema: {
      type: 'object',
      fields: [
        { key: 'success', type: 'boolean', value: true },
        { key: 'message', type: 'string', value: 'Request successful' },
        { key: 'statusCode', type: 'number', value: 200 },
        { key: 'timestamp', type: 'date', value: new Date().toISOString().split('T')[0] },
        {
          key: 'data',
          type: 'object',
          fields: [
            { key: 'id', type: 'number', value: 1 },
            { key: 'name', type: 'string', value: 'Sample Data' },
            { key: 'value', type: 'string', value: 'Some value' }
          ]
        },
        {
          key: 'meta',
          type: 'object',
          fields: [
            { key: 'page', type: 'number', value: 1 },
            { key: 'limit', type: 'number', value: 10 },
            { key: 'total', type: 'number', value: 100 }
          ]
        }
      ]
    }
  },

  // Business Templates
  {
    id: 'company',
    name: 'Company',
    description: 'Company profile with business information',
    category: 'business',
    icon: '🏢',
    tags: ['company', 'business', 'organization'],
    schema: {
      type: 'object',
      fields: [
        { key: 'id', type: 'number', value: 1 },
        { key: 'name', type: 'company', value: 'Acme Corporation' },
        { key: 'description', type: 'description', value: 'Leading provider of innovative solutions' },
        { key: 'website', type: 'url', value: 'https://acme.com' },
        { key: 'email', type: 'email', value: 'contact@acme.com' },
        { key: 'phone', type: 'phone', value: '+1-555-123-4567' },
        { key: 'employees', type: 'number', value: 250 },
        { key: 'founded', type: 'number', value: 2010 },
        {
          key: 'address',
          type: 'object',
          fields: [
            { key: 'street', type: 'address', value: '123 Business Ave' },
            { key: 'city', type: 'city', value: 'San Francisco' },
            { key: 'state', type: 'string', value: 'CA' },
            { key: 'zipCode', type: 'zipCode', value: '94105' },
            { key: 'country', type: 'country', value: 'United States' }
          ]
        }
      ]
    }
  }
];

export function getTemplatesByCategory(category: JSONTemplate['category']): JSONTemplate[] {
  return jsonTemplates.filter(template => template.category === category);
}

export function searchTemplates(query: string): JSONTemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return jsonTemplates.filter(template => 
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function getTemplateById(id: string): JSONTemplate | undefined {
  return jsonTemplates.find(template => template.id === id);
}
