import { MockSchema } from "@/types";

export interface JSONTemplate {
  id: string;
  name: string;
  description: string;
  category:
    | "user"
    | "ecommerce"
    | "blog"
    | "api"
    | "business"
    | "entertainment"
    | "finance"
    | "travel"
    | "health"
    | "education"
    | "social"
    | "sports"
    | "food"
    | "weather"
    | "realestate";
  icon: string;
  schema: MockSchema;
  tags: string[];
}

export const jsonTemplates: JSONTemplate[] = [
  // User Templates
  {
    id: "user-profile",
    name: "User Profile",
    description: "Complete user profile with personal information",
    category: "user",
    icon: "👤",
    tags: ["user", "profile", "personal"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "firstName", type: "firstName", value: "John" },
        { key: "lastName", type: "lastName", value: "Doe" },
        { key: "email", type: "email", value: "john.doe@example.com" },
        { key: "age", type: "age", value: 25 },
        {
          key: "avatar",
          type: "avatar",
          value: "https://avatars.githubusercontent.com/u/1?v=4",
        },
        { key: "phone", type: "phone", value: "+1-234-567-8900" },
        {
          key: "address",
          type: "object",
          fields: [
            { key: "street", type: "address", value: "123 Main St" },
            { key: "city", type: "city", value: "New York" },
            { key: "zipCode", type: "zipCode", value: "10001" },
            { key: "country", type: "country", value: "United States" },
          ],
        },
      ],
    },
  },
  {
    id: "user-list",
    name: "User List",
    description: "Array of users with basic information",
    category: "user",
    icon: "👥",
    tags: ["users", "list", "array"],
    schema: {
      type: "array",
      length: 5,
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "name", type: "fullName", value: "John Doe" },
        { key: "email", type: "email", value: "user@example.com" },
        { key: "username", type: "username", value: "johndoe" },
        { key: "isActive", type: "boolean", value: true },
      ],
    },
  },

  // E-commerce Templates
  {
    id: "product",
    name: "Product",
    description: "E-commerce product with pricing and details",
    category: "ecommerce",
    icon: "🛍️",
    tags: ["product", "ecommerce", "shopping"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "name", type: "title", value: "Awesome Product" },
        {
          key: "description",
          type: "description",
          value: "This is an amazing product",
        },
        { key: "price", type: "price", value: 29.99 },
        { key: "currency", type: "currency", value: "USD" },
        { key: "image", type: "image", value: "https://picsum.photos/400/300" },
        { key: "inStock", type: "boolean", value: true },
        { key: "category", type: "string", value: "Electronics" },
        {
          key: "tags",
          type: "array",
          length: 3,
          fields: [{ key: "item", type: "string", value: "tech" }],
        },
      ],
    },
  },
  {
    id: "order",
    name: "Order",
    description: "Customer order with items and billing",
    category: "ecommerce",
    icon: "📦",
    tags: ["order", "purchase", "billing"],
    schema: {
      type: "object",
      fields: [
        {
          key: "id",
          type: "uuid",
          value: "123e4567-e89b-12d3-a456-426614174000",
        },
        { key: "orderNumber", type: "string", value: "ORD-2024-001" },
        { key: "customerId", type: "number", value: 123 },
        { key: "status", type: "string", value: "pending" },
        { key: "total", type: "price", value: 299.99 },
        { key: "currency", type: "currency", value: "USD" },
        {
          key: "orderDate",
          type: "date",
          value: new Date().toISOString().split("T")[0],
        },
        {
          key: "items",
          type: "array",
          length: 3,
          fields: [
            { key: "productId", type: "number", value: 1 },
            { key: "name", type: "title", value: "Product Name" },
            { key: "quantity", type: "number", value: 2 },
            { key: "price", type: "price", value: 99.99 },
          ],
        },
      ],
    },
  },

  // Blog Templates
  {
    id: "blog-post",
    name: "Blog Post",
    description: "Blog article with author and metadata",
    category: "blog",
    icon: "📝",
    tags: ["blog", "article", "content"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "title", type: "title", value: "Amazing Blog Post Title" },
        { key: "slug", type: "string", value: "amazing-blog-post-title" },
        {
          key: "content",
          type: "description",
          value: "This is the blog post content...",
        },
        {
          key: "excerpt",
          type: "description",
          value: "Brief excerpt of the post",
        },
        {
          key: "publishedAt",
          type: "date",
          value: new Date().toISOString().split("T")[0],
        },
        { key: "readTime", type: "number", value: 5 },
        { key: "featured", type: "boolean", value: false },
        {
          key: "author",
          type: "object",
          fields: [
            { key: "id", type: "number", value: 1 },
            { key: "name", type: "fullName", value: "Jane Smith" },
            { key: "email", type: "email", value: "jane@example.com" },
            {
              key: "avatar",
              type: "avatar",
              value: "https://avatars.githubusercontent.com/u/2?v=4",
            },
          ],
        },
        {
          key: "tags",
          type: "array",
          length: 4,
          fields: [{ key: "item", type: "string", value: "technology" }],
        },
      ],
    },
  },

  // API Response Templates
  {
    id: "api-response",
    name: "API Response",
    description: "Standard API response with data and metadata",
    category: "api",
    icon: "🌐",
    tags: ["api", "response", "standard"],
    schema: {
      type: "object",
      fields: [
        { key: "success", type: "boolean", value: true },
        { key: "message", type: "string", value: "Request successful" },
        { key: "statusCode", type: "number", value: 200 },
        {
          key: "timestamp",
          type: "date",
          value: new Date().toISOString().split("T")[0],
        },
        {
          key: "data",
          type: "object",
          fields: [
            { key: "id", type: "number", value: 1 },
            { key: "name", type: "string", value: "Sample Data" },
            { key: "value", type: "string", value: "Some value" },
          ],
        },
        {
          key: "meta",
          type: "object",
          fields: [
            { key: "page", type: "number", value: 1 },
            { key: "limit", type: "number", value: 10 },
            { key: "total", type: "number", value: 100 },
          ],
        },
      ],
    },
  },

  // Business Templates
  {
    id: "company",
    name: "Company",
    description: "Company profile with business information",
    category: "business",
    icon: "🏢",
    tags: ["company", "business", "organization"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "name", type: "company", value: "Acme Corporation" },
        {
          key: "description",
          type: "description",
          value: "Leading provider of innovative solutions",
        },
        { key: "website", type: "url", value: "https://acme.com" },
        { key: "email", type: "email", value: "contact@acme.com" },
        { key: "phone", type: "phone", value: "+1-555-123-4567" },
        { key: "employees", type: "number", value: 250 },
        { key: "founded", type: "number", value: 2010 },
        {
          key: "address",
          type: "object",
          fields: [
            { key: "street", type: "address", value: "123 Business Ave" },
            { key: "city", type: "city", value: "San Francisco" },
            { key: "state", type: "string", value: "CA" },
            { key: "zipCode", type: "zipCode", value: "94105" },
            { key: "country", type: "country", value: "United States" },
          ],
        },
      ],
    },
  },

  // Additional User Templates
  {
    id: "social-media-profile",
    name: "Social Media Profile",
    description: "Social media user profile with stats and activity",
    category: "user",
    icon: "👥",
    tags: ["social", "profile", "media", "followers"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "username", type: "username", value: "johndoe" },
        { key: "displayName", type: "fullName", value: "John Doe" },
        {
          key: "bio",
          type: "description",
          value: "Tech enthusiast and coffee lover ☕",
        },
        {
          key: "avatar",
          type: "avatar",
          value: "https://avatars.githubusercontent.com/u/1?v=4",
        },
        { key: "followersCount", type: "number", value: 1250 },
        { key: "followingCount", type: "number", value: 300 },
        { key: "postsCount", type: "number", value: 89 },
        { key: "verified", type: "boolean", value: false },
        { key: "joinedAt", type: "date", value: "2020-03-15" },
        { key: "isPrivate", type: "boolean", value: false },
      ],
    },
  },
  {
    id: "team-member",
    name: "Team Member",
    description: "Team member profile with role and contact info",
    category: "user",
    icon: "👤",
    tags: ["team", "member", "employee", "role"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "name", type: "fullName", value: "Sarah Johnson" },
        { key: "email", type: "email", value: "sarah.johnson@company.com" },
        { key: "role", type: "string", value: "Senior Developer" },
        { key: "department", type: "string", value: "Engineering" },
        {
          key: "avatar",
          type: "avatar",
          value: "https://avatars.githubusercontent.com/u/2?v=4",
        },
        { key: "phone", type: "phone", value: "+1-555-987-6543" },
        { key: "startDate", type: "date", value: "2022-01-15" },
        { key: "isActive", type: "boolean", value: true },
        {
          key: "skills",
          type: "array",
          length: 4,
          fields: [{ key: "item", type: "string", value: "JavaScript" }],
        },
      ],
    },
  },

  // Additional E-commerce Templates
  {
    id: "shopping-cart",
    name: "Shopping Cart",
    description: "User shopping cart with items and totals",
    category: "ecommerce",
    icon: "🛒",
    tags: ["cart", "shopping", "checkout", "items"],
    schema: {
      type: "object",
      fields: [
        {
          key: "id",
          type: "uuid",
          value: "550e8400-e29b-41d4-a716-446655440000",
        },
        { key: "userId", type: "number", value: 123 },
        { key: "sessionId", type: "string", value: "sess_abc123def456" },
        { key: "itemsCount", type: "number", value: 3 },
        { key: "subtotal", type: "price", value: 127.97 },
        { key: "tax", type: "price", value: 10.24 },
        { key: "shipping", type: "price", value: 9.99 },
        { key: "total", type: "price", value: 148.2 },
        { key: "currency", type: "currency", value: "USD" },
        {
          key: "updatedAt",
          type: "date",
          value: new Date().toISOString().split("T")[0],
        },
        {
          key: "items",
          type: "array",
          length: 3,
          fields: [
            { key: "productId", type: "number", value: 1 },
            { key: "name", type: "title", value: "Wireless Headphones" },
            { key: "quantity", type: "number", value: 1 },
            { key: "price", type: "price", value: 79.99 },
            {
              key: "image",
              type: "image",
              value: "https://picsum.photos/150/150",
            },
          ],
        },
      ],
    },
  },
  {
    id: "product-review",
    name: "Product Review",
    description: "Customer product review with rating and feedback",
    category: "ecommerce",
    icon: "⭐",
    tags: ["review", "rating", "feedback", "customer"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "productId", type: "number", value: 123 },
        { key: "userId", type: "number", value: 456 },
        { key: "userName", type: "fullName", value: "Mike Chen" },
        { key: "rating", type: "number", value: 4 },
        { key: "title", type: "title", value: "Great product!" },
        {
          key: "comment",
          type: "description",
          value:
            "Really satisfied with this purchase. Quality is excellent and delivery was fast.",
        },
        { key: "verified", type: "boolean", value: true },
        { key: "helpful", type: "number", value: 8 },
        { key: "createdAt", type: "date", value: "2024-06-10" },
        {
          key: "images",
          type: "array",
          length: 2,
          fields: [
            {
              key: "item",
              type: "image",
              value: "https://picsum.photos/300/200",
            },
          ],
        },
      ],
    },
  },
  {
    id: "inventory-item",
    name: "Inventory Item",
    description: "Warehouse inventory item with stock and location",
    category: "ecommerce",
    icon: "📦",
    tags: ["inventory", "stock", "warehouse", "tracking"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "sku", type: "string", value: "WH-HDR-001" },
        { key: "productName", type: "title", value: "Wireless Headphones" },
        { key: "stockQuantity", type: "number", value: 150 },
        { key: "reservedQuantity", type: "number", value: 25 },
        { key: "availableQuantity", type: "number", value: 125 },
        { key: "reorderLevel", type: "number", value: 50 },
        { key: "warehouseLocation", type: "string", value: "A-12-3" },
        { key: "supplier", type: "company", value: "TechSupply Inc." },
        { key: "costPrice", type: "price", value: 45.0 },
        { key: "lastRestocked", type: "date", value: "2024-06-01" },
        { key: "expiryDate", type: "date", value: "2026-06-01" },
      ],
    },
  },

  // Additional Blog Templates
  {
    id: "blog-comment",
    name: "Blog Comment",
    description: "User comment on a blog post with threading",
    category: "blog",
    icon: "💬",
    tags: ["comment", "discussion", "user", "thread"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "postId", type: "number", value: 123 },
        { key: "parentId", type: "number", value: undefined },
        { key: "authorName", type: "fullName", value: "Emma Wilson" },
        { key: "authorEmail", type: "email", value: "emma@example.com" },
        {
          key: "content",
          type: "description",
          value:
            "Great article! Really helped me understand the concept better.",
        },
        { key: "approved", type: "boolean", value: true },
        { key: "likesCount", type: "number", value: 5 },
        { key: "createdAt", type: "date", value: "2024-06-12" },
        { key: "ipAddress", type: "string", value: "192.168.1.100" },
      ],
    },
  },
  {
    id: "newsletter",
    name: "Newsletter",
    description: "Email newsletter with content and analytics",
    category: "blog",
    icon: "📧",
    tags: ["newsletter", "email", "marketing", "content"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "title", type: "title", value: "Weekly Tech Updates" },
        {
          key: "subject",
          type: "title",
          value: "Your Weekly Dose of Tech News",
        },
        {
          key: "content",
          type: "description",
          value: "Here are the most important tech updates from this week...",
        },
        {
          key: "previewText",
          type: "string",
          value: "AI breakthrough, new frameworks, and more!",
        },
        { key: "sentAt", type: "date", value: "2024-06-15" },
        { key: "recipientsCount", type: "number", value: 5432 },
        { key: "openRate", type: "number", value: 0.34 },
        { key: "clickRate", type: "number", value: 0.12 },
        { key: "status", type: "string", value: "sent" },
      ],
    },
  },

  // Additional API Templates
  {
    id: "api-error-response",
    name: "API Error Response",
    description: "Standard error response with details and debugging info",
    category: "api",
    icon: "❌",
    tags: ["api", "error", "debugging", "response"],
    schema: {
      type: "object",
      fields: [
        { key: "success", type: "boolean", value: false },
        { key: "error", type: "string", value: "ValidationError" },
        { key: "message", type: "string", value: "Invalid input parameters" },
        { key: "statusCode", type: "number", value: 400 },
        {
          key: "timestamp",
          type: "date",
          value: new Date().toISOString().split("T")[0],
        },
        {
          key: "requestId",
          type: "uuid",
          value: "123e4567-e89b-12d3-a456-426614174000",
        },
        {
          key: "details",
          type: "array",
          length: 2,
          fields: [
            { key: "field", type: "string", value: "email" },
            { key: "message", type: "string", value: "Invalid email format" },
          ],
        },
        {
          key: "debug",
          type: "object",
          fields: [
            { key: "file", type: "string", value: "validation.js" },
            { key: "line", type: "number", value: 42 },
            { key: "function", type: "string", value: "validateEmail" },
          ],
        },
      ],
    },
  },
  {
    id: "paginated-response",
    name: "Paginated Response",
    description: "API response with pagination metadata and data",
    category: "api",
    icon: "📄",
    tags: ["api", "pagination", "list", "metadata"],
    schema: {
      type: "object",
      fields: [
        { key: "success", type: "boolean", value: true },
        { key: "statusCode", type: "number", value: 200 },
        {
          key: "data",
          type: "array",
          length: 10,
          fields: [
            { key: "id", type: "number", value: 1 },
            { key: "name", type: "title", value: "Sample Item" },
            { key: "createdAt", type: "date", value: "2024-06-15" },
          ],
        },
        {
          key: "pagination",
          type: "object",
          fields: [
            { key: "currentPage", type: "number", value: 1 },
            { key: "totalPages", type: "number", value: 15 },
            { key: "pageSize", type: "number", value: 10 },
            { key: "totalItems", type: "number", value: 147 },
            { key: "hasNext", type: "boolean", value: true },
            { key: "hasPrevious", type: "boolean", value: false },
          ],
        },
      ],
    },
  },

  // Additional Business Templates
  {
    id: "employee-record",
    name: "Employee Record",
    description: "Detailed employee record with HR information",
    category: "business",
    icon: "👔",
    tags: ["employee", "hr", "payroll", "record"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "employeeId", type: "string", value: "EMP-2024-001" },
        { key: "firstName", type: "firstName", value: "Alex" },
        { key: "lastName", type: "lastName", value: "Thompson" },
        { key: "email", type: "email", value: "alex.thompson@company.com" },
        { key: "position", type: "string", value: "Software Engineer" },
        { key: "department", type: "string", value: "Engineering" },
        { key: "manager", type: "fullName", value: "Jennifer Davis" },
        { key: "salary", type: "price", value: 95000 },
        { key: "hireDate", type: "date", value: "2023-03-01" },
        { key: "status", type: "string", value: "active" },
        { key: "workLocation", type: "string", value: "Remote" },
      ],
    },
  },
  {
    id: "meeting-event",
    name: "Meeting/Event",
    description: "Business meeting or event with attendees and details",
    category: "business",
    icon: "📅",
    tags: ["meeting", "event", "calendar", "attendees"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "title", type: "title", value: "Q2 Planning Meeting" },
        {
          key: "description",
          type: "description",
          value: "Quarterly planning session for product roadmap",
        },
        { key: "startTime", type: "date", value: "2024-06-20T09:00:00Z" },
        { key: "endTime", type: "date", value: "2024-06-20T11:00:00Z" },
        { key: "location", type: "string", value: "Conference Room A" },
        { key: "organizer", type: "email", value: "manager@company.com" },
        { key: "isRecurring", type: "boolean", value: false },
        { key: "status", type: "string", value: "scheduled" },
        {
          key: "attendees",
          type: "array",
          length: 5,
          fields: [
            { key: "email", type: "email", value: "attendee@company.com" },
            { key: "name", type: "fullName", value: "John Smith" },
            { key: "status", type: "string", value: "accepted" },
          ],
        },
      ],
    },
  },
  {
    id: "project-overview",
    name: "Project Overview",
    description: "Software project with timeline and team members",
    category: "business",
    icon: "🚀",
    tags: ["project", "management", "team", "timeline"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "name", type: "title", value: "Mobile App Development" },
        {
          key: "description",
          type: "description",
          value:
            "Development of a new mobile application for customer engagement",
        },
        { key: "status", type: "string", value: "in-progress" },
        { key: "priority", type: "string", value: "high" },
        { key: "startDate", type: "date", value: "2024-05-01" },
        { key: "endDate", type: "date", value: "2024-08-15" },
        { key: "budget", type: "price", value: 250000 },
        { key: "progress", type: "number", value: 65 },
        { key: "projectManager", type: "fullName", value: "Sarah Chen" },
        {
          key: "teamMembers",
          type: "array",
          length: 4,
          fields: [
            { key: "name", type: "fullName", value: "Developer Name" },
            { key: "role", type: "string", value: "Frontend Developer" },
          ],
        },
      ],
    },
  },

  // Entertainment Templates
  {
    id: "movie-info",
    name: "Movie Info",
    description: "Movie information with cast, ratings, and details",
    category: "entertainment",
    icon: "🎬",
    tags: ["movie", "film", "entertainment", "rating"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "title", type: "title", value: "The Amazing Adventure" },
        { key: "originalTitle", type: "title", value: "The Amazing Adventure" },
        {
          key: "description",
          type: "description",
          value:
            "An epic adventure that will keep you on the edge of your seat",
        },
        { key: "director", type: "fullName", value: "Christopher Nolan" },
        { key: "releaseDate", type: "date", value: "2024-07-15" },
        { key: "runtime", type: "number", value: 148 },
        { key: "genre", type: "string", value: "Action, Adventure, Sci-Fi" },
        { key: "rating", type: "string", value: "PG-13" },
        { key: "imdbRating", type: "number", value: 8.3 },
        { key: "boxOffice", type: "price", value: 250000000 },
        {
          key: "poster",
          type: "image",
          value: "https://picsum.photos/300/450",
        },
        {
          key: "cast",
          type: "array",
          length: 3,
          fields: [
            { key: "name", type: "fullName", value: "Robert Downey Jr." },
            { key: "character", type: "string", value: "Tony Stark" },
          ],
        },
      ],
    },
  },
  {
    id: "music-track",
    name: "Music Track",
    description: "Music track with artist info and streaming data",
    category: "entertainment",
    icon: "🎵",
    tags: ["music", "track", "artist", "streaming"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "title", type: "title", value: "Summer Nights" },
        { key: "artist", type: "fullName", value: "The Midnight Band" },
        { key: "album", type: "title", value: "Golden Hours" },
        { key: "duration", type: "number", value: 243 },
        { key: "genre", type: "string", value: "Pop Rock" },
        { key: "releaseDate", type: "date", value: "2024-05-20" },
        { key: "plays", type: "number", value: 1250000 },
        { key: "likes", type: "number", value: 85600 },
        { key: "isExplicit", type: "boolean", value: false },
        {
          key: "albumCover",
          type: "image",
          value: "https://picsum.photos/400/400",
        },
        {
          key: "previewUrl",
          type: "url",
          value: "https://example.com/preview/track1.mp3",
        },
      ],
    },
  },
  {
    id: "video-game",
    name: "Video Game",
    description: "Video game information with ratings and platforms",
    category: "entertainment",
    icon: "🎮",
    tags: ["game", "gaming", "video", "entertainment"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "title", type: "title", value: "Cyber Quest 2077" },
        {
          key: "description",
          type: "description",
          value: "An open-world cyberpunk adventure game",
        },
        { key: "developer", type: "company", value: "Future Games Studio" },
        { key: "publisher", type: "company", value: "Mega Entertainment" },
        { key: "releaseDate", type: "date", value: "2024-11-15" },
        { key: "price", type: "price", value: 59.99 },
        { key: "rating", type: "string", value: "M (Mature 17+)" },
        { key: "metacriticScore", type: "number", value: 92 },
        {
          key: "playerCount",
          type: "string",
          value: "Single-player, Multiplayer (2-4)",
        },
        {
          key: "platforms",
          type: "array",
          length: 4,
          fields: [{ key: "item", type: "string", value: "PC" }],
        },
        {
          key: "genres",
          type: "array",
          length: 3,
          fields: [{ key: "item", type: "string", value: "RPG" }],
        },
      ],
    },
  },

  // Finance Templates
  {
    id: "bank-account",
    name: "Bank Account",
    description: "Bank account information with balance and transactions",
    category: "finance",
    icon: "🏦",
    tags: ["bank", "account", "finance", "balance"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "accountNumber", type: "string", value: "****1234" },
        { key: "accountType", type: "string", value: "Checking" },
        { key: "accountName", type: "string", value: "Primary Checking" },
        { key: "balance", type: "price", value: 15420.5 },
        { key: "availableBalance", type: "price", value: 15320.5 },
        { key: "currency", type: "currency", value: "USD" },
        { key: "bankName", type: "company", value: "First National Bank" },
        { key: "routingNumber", type: "string", value: "021000021" },
        { key: "isActive", type: "boolean", value: true },
        { key: "openedDate", type: "date", value: "2019-08-15" },
        { key: "lastTransaction", type: "date", value: "2024-06-14" },
      ],
    },
  },
  {
    id: "transaction-record",
    name: "Transaction Record",
    description: "Financial transaction with details and categorization",
    category: "finance",
    icon: "💳",
    tags: ["transaction", "payment", "finance", "record"],
    schema: {
      type: "object",
      fields: [
        {
          key: "id",
          type: "uuid",
          value: "550e8400-e29b-41d4-a716-446655440000",
        },
        { key: "transactionId", type: "string", value: "TXN-2024-062345" },
        { key: "amount", type: "price", value: -45.67 },
        { key: "currency", type: "currency", value: "USD" },
        { key: "description", type: "string", value: "Grocery Store Purchase" },
        { key: "merchant", type: "company", value: "Fresh Market" },
        { key: "category", type: "string", value: "Food & Dining" },
        { key: "date", type: "date", value: "2024-06-14" },
        { key: "status", type: "string", value: "completed" },
        { key: "paymentMethod", type: "string", value: "Credit Card" },
        { key: "accountId", type: "number", value: 12345 },
        { key: "isRecurring", type: "boolean", value: false },
      ],
    },
  },
  {
    id: "investment-portfolio",
    name: "Investment Portfolio",
    description: "Investment portfolio with holdings and performance",
    category: "finance",
    icon: "📈",
    tags: ["investment", "portfolio", "stocks", "finance"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "portfolioName", type: "string", value: "Retirement Fund" },
        { key: "totalValue", type: "price", value: 125000.0 },
        { key: "totalCost", type: "price", value: 95000.0 },
        { key: "totalGain", type: "price", value: 30000.0 },
        { key: "totalGainPercent", type: "number", value: 31.58 },
        { key: "currency", type: "currency", value: "USD" },
        { key: "lastUpdated", type: "date", value: "2024-06-15" },
        {
          key: "holdings",
          type: "array",
          length: 3,
          fields: [
            { key: "symbol", type: "string", value: "AAPL" },
            { key: "name", type: "string", value: "Apple Inc." },
            { key: "shares", type: "number", value: 50 },
            { key: "currentPrice", type: "price", value: 185.5 },
            { key: "totalValue", type: "price", value: 9275.0 },
          ],
        },
      ],
    },
  },

  // Travel Templates
  {
    id: "hotel-booking",
    name: "Hotel Booking",
    description: "Hotel reservation with guest details and amenities",
    category: "travel",
    icon: "🏨",
    tags: ["hotel", "booking", "travel", "reservation"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "confirmationNumber", type: "string", value: "HTL-2024-891234" },
        { key: "hotelName", type: "company", value: "Grand Plaza Hotel" },
        { key: "guestName", type: "fullName", value: "David Rodriguez" },
        { key: "email", type: "email", value: "david.rodriguez@email.com" },
        { key: "checkInDate", type: "date", value: "2024-07-10" },
        { key: "checkOutDate", type: "date", value: "2024-07-15" },
        { key: "nights", type: "number", value: 5 },
        { key: "roomType", type: "string", value: "Deluxe King Room" },
        { key: "guests", type: "number", value: 2 },
        { key: "totalPrice", type: "price", value: 750.0 },
        { key: "currency", type: "currency", value: "USD" },
        { key: "status", type: "string", value: "confirmed" },
        {
          key: "amenities",
          type: "array",
          length: 4,
          fields: [{ key: "item", type: "string", value: "Free WiFi" }],
        },
      ],
    },
  },
  {
    id: "flight-booking",
    name: "Flight Booking",
    description: "Flight reservation with passenger and journey details",
    category: "travel",
    icon: "✈️",
    tags: ["flight", "booking", "airline", "travel"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "bookingReference", type: "string", value: "FLT-ABC123" },
        { key: "airline", type: "company", value: "SkyLine Airways" },
        { key: "flightNumber", type: "string", value: "SL-4521" },
        { key: "passengerName", type: "fullName", value: "Maria Garcia" },
        { key: "departureAirport", type: "string", value: "JFK - New York" },
        { key: "arrivalAirport", type: "string", value: "LAX - Los Angeles" },
        { key: "departureTime", type: "date", value: "2024-08-05T08:30:00Z" },
        { key: "arrivalTime", type: "date", value: "2024-08-05T14:45:00Z" },
        { key: "seatClass", type: "string", value: "Economy" },
        { key: "seatNumber", type: "string", value: "14A" },
        { key: "price", type: "price", value: 425.0 },
        { key: "currency", type: "currency", value: "USD" },
        { key: "status", type: "string", value: "confirmed" },
      ],
    },
  },
  {
    id: "restaurant-info",
    name: "Restaurant Info",
    description: "Restaurant details with menu, ratings, and location",
    category: "travel",
    icon: "🍽️",
    tags: ["restaurant", "dining", "food", "location"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "name", type: "company", value: "Bella Vista Restaurant" },
        {
          key: "description",
          type: "description",
          value: "Authentic Italian cuisine with a modern twist",
        },
        { key: "cuisine", type: "string", value: "Italian" },
        { key: "priceRange", type: "string", value: "$$" },
        { key: "rating", type: "number", value: 4.6 },
        { key: "reviewCount", type: "number", value: 324 },
        { key: "phone", type: "phone", value: "+1-555-432-1098" },
        { key: "website", type: "url", value: "https://bellavista.com" },
        { key: "openingHours", type: "string", value: "11:00 AM - 10:00 PM" },
        {
          key: "address",
          type: "address",
          value: "456 Restaurant Row, Downtown",
        },
        { key: "city", type: "city", value: "Chicago" },
        {
          key: "features",
          type: "array",
          length: 4,
          fields: [{ key: "item", type: "string", value: "Outdoor Seating" }],
        },
      ],
    },
  },

  // Health Templates
  {
    id: "patient-record",
    name: "Patient Record",
    description: "Medical patient record with health information",
    category: "health",
    icon: "🏥",
    tags: ["patient", "medical", "health", "record"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "patientId", type: "string", value: "PAT-2024-001" },
        { key: "firstName", type: "firstName", value: "Jennifer" },
        { key: "lastName", type: "lastName", value: "Adams" },
        { key: "dateOfBirth", type: "date", value: "1985-03-22" },
        { key: "gender", type: "string", value: "Female" },
        { key: "bloodType", type: "string", value: "A+" },
        { key: "height", type: "number", value: 165 },
        { key: "weight", type: "number", value: 68 },
        { key: "phone", type: "phone", value: "+1-555-765-4321" },
        { key: "email", type: "email", value: "jennifer.adams@email.com" },
        { key: "emergencyContact", type: "fullName", value: "Robert Adams" },
        { key: "emergencyPhone", type: "phone", value: "+1-555-987-6543" },
        {
          key: "allergies",
          type: "array",
          length: 2,
          fields: [{ key: "item", type: "string", value: "Penicillin" }],
        },
      ],
    },
  },
  {
    id: "appointment",
    name: "Medical Appointment",
    description: "Medical appointment with doctor and patient details",
    category: "health",
    icon: "📅",
    tags: ["appointment", "medical", "doctor", "schedule"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "appointmentId", type: "string", value: "APT-2024-5678" },
        { key: "patientName", type: "fullName", value: "Michael Johnson" },
        { key: "doctorName", type: "fullName", value: "Dr. Sarah Martinez" },
        { key: "specialty", type: "string", value: "Cardiology" },
        { key: "appointmentDate", type: "date", value: "2024-06-25" },
        { key: "appointmentTime", type: "string", value: "10:30 AM" },
        { key: "duration", type: "number", value: 30 },
        { key: "reason", type: "string", value: "Annual checkup" },
        { key: "status", type: "string", value: "scheduled" },
        { key: "location", type: "string", value: "Room 205, Cardiology Wing" },
        {
          key: "notes",
          type: "description",
          value: "Patient requested early morning appointment",
        },
      ],
    },
  },

  // Education Templates
  {
    id: "course-info",
    name: "Course Info",
    description: "Educational course with curriculum and instructor details",
    category: "education",
    icon: "📚",
    tags: ["course", "education", "learning", "curriculum"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "courseCode", type: "string", value: "CS-101" },
        {
          key: "title",
          type: "title",
          value: "Introduction to Computer Science",
        },
        {
          key: "description",
          type: "description",
          value: "Fundamental concepts of computer science and programming",
        },
        { key: "instructor", type: "fullName", value: "Prof. Alan Smith" },
        { key: "credits", type: "number", value: 3 },
        { key: "semester", type: "string", value: "Fall 2024" },
        { key: "duration", type: "string", value: "16 weeks" },
        { key: "maxStudents", type: "number", value: 30 },
        { key: "enrolledStudents", type: "number", value: 28 },
        { key: "schedule", type: "string", value: "Mon, Wed, Fri - 9:00 AM" },
        { key: "room", type: "string", value: "Science Building, Room 204" },
        {
          key: "topics",
          type: "array",
          length: 5,
          fields: [
            { key: "item", type: "string", value: "Programming Fundamentals" },
          ],
        },
      ],
    },
  },
  {
    id: "student-record",
    name: "Student Record",
    description: "Student academic record with grades and enrollment info",
    category: "education",
    icon: "🎓",
    tags: ["student", "academic", "grades", "enrollment"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "studentId", type: "string", value: "STU-2024-9876" },
        { key: "firstName", type: "firstName", value: "Emily" },
        { key: "lastName", type: "lastName", value: "Chen" },
        { key: "email", type: "email", value: "emily.chen@university.edu" },
        { key: "major", type: "string", value: "Computer Science" },
        { key: "year", type: "string", value: "Junior" },
        { key: "gpa", type: "number", value: 3.7 },
        { key: "creditsCompleted", type: "number", value: 90 },
        { key: "expectedGraduation", type: "date", value: "2025-05-15" },
        { key: "advisor", type: "fullName", value: "Dr. Rebecca Johnson" },
        { key: "enrollmentStatus", type: "string", value: "Full-time" },
        {
          key: "currentCourses",
          type: "array",
          length: 4,
          fields: [
            { key: "courseCode", type: "string", value: "CS-301" },
            { key: "courseName", type: "string", value: "Data Structures" },
            { key: "grade", type: "string", value: "A-" },
          ],
        },
      ],
    },
  },

  // Social Templates
  {
    id: "social-post",
    name: "Social Post",
    description: "Social media post with engagement metrics",
    category: "social",
    icon: "📱",
    tags: ["social", "post", "media", "engagement"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "userId", type: "number", value: 123 },
        { key: "username", type: "username", value: "techguru_2024" },
        {
          key: "content",
          type: "description",
          value:
            "Just finished an amazing coding session! 💻 Building the future one line of code at a time. #coding #developer #tech",
        },
        { key: "timestamp", type: "date", value: "2024-06-15T14:30:00Z" },
        { key: "likesCount", type: "number", value: 245 },
        { key: "commentsCount", type: "number", value: 18 },
        { key: "sharesCount", type: "number", value: 12 },
        { key: "isPublic", type: "boolean", value: true },
        { key: "location", type: "string", value: "San Francisco, CA" },
        {
          key: "hashtags",
          type: "array",
          length: 3,
          fields: [{ key: "item", type: "string", value: "coding" }],
        },
        {
          key: "media",
          type: "array",
          length: 2,
          fields: [
            {
              key: "url",
              type: "image",
              value: "https://picsum.photos/600/400",
            },
            { key: "type", type: "string", value: "image" },
          ],
        },
      ],
    },
  },
  {
    id: "chat-message",
    name: "Chat Message",
    description: "Chat message in a conversation thread",
    category: "social",
    icon: "💬",
    tags: ["chat", "message", "conversation", "communication"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "conversationId", type: "number", value: 456 },
        { key: "senderId", type: "number", value: 123 },
        { key: "senderName", type: "fullName", value: "Alex Turner" },
        {
          key: "message",
          type: "string",
          value: "Hey! Are we still on for the meeting tomorrow?",
        },
        { key: "timestamp", type: "date", value: "2024-06-15T16:45:00Z" },
        { key: "messageType", type: "string", value: "text" },
        { key: "isRead", type: "boolean", value: false },
        { key: "isEdited", type: "boolean", value: false },
        { key: "replyToId", type: "number", value: undefined },
        {
          key: "reactions",
          type: "array",
          length: 2,
          fields: [
            { key: "emoji", type: "string", value: "👍" },
            { key: "count", type: "number", value: 3 },
          ],
        },
      ],
    },
  },

  // Sports Templates
  {
    id: "sports-team",
    name: "Sports Team",
    description: "Sports team information with players and statistics",
    category: "sports",
    icon: "⚽",
    tags: ["sports", "team", "players", "statistics"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "name", type: "string", value: "Lightning Bolts" },
        { key: "city", type: "city", value: "Miami" },
        { key: "sport", type: "string", value: "Soccer" },
        { key: "league", type: "string", value: "MLS" },
        { key: "founded", type: "number", value: 1998 },
        { key: "stadium", type: "string", value: "Thunder Stadium" },
        { key: "capacity", type: "number", value: 45000 },
        { key: "coach", type: "fullName", value: "Carlos Rodriguez" },
        { key: "wins", type: "number", value: 18 },
        { key: "losses", type: "number", value: 6 },
        { key: "draws", type: "number", value: 4 },
        {
          key: "players",
          type: "array",
          length: 3,
          fields: [
            { key: "name", type: "fullName", value: "Marco Silva" },
            { key: "position", type: "string", value: "Forward" },
            { key: "number", type: "number", value: 10 },
          ],
        },
      ],
    },
  },
  {
    id: "match-result",
    name: "Match Result",
    description: "Sports match result with teams and statistics",
    category: "sports",
    icon: "🏆",
    tags: ["match", "result", "sports", "score"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "matchId", type: "string", value: "MTH-2024-5567" },
        { key: "homeTeam", type: "string", value: "Lightning Bolts" },
        { key: "awayTeam", type: "string", value: "Thunder Hawks" },
        { key: "homeScore", type: "number", value: 3 },
        { key: "awayScore", type: "number", value: 1 },
        { key: "matchDate", type: "date", value: "2024-06-12" },
        { key: "venue", type: "string", value: "Thunder Stadium" },
        { key: "attendance", type: "number", value: 42000 },
        { key: "duration", type: "number", value: 90 },
        { key: "referee", type: "fullName", value: "John Martinez" },
        { key: "status", type: "string", value: "completed" },
        {
          key: "events",
          type: "array",
          length: 4,
          fields: [
            { key: "minute", type: "number", value: 23 },
            { key: "type", type: "string", value: "goal" },
            { key: "player", type: "fullName", value: "Marco Silva" },
          ],
        },
      ],
    },
  },

  // Food Templates
  {
    id: "recipe",
    name: "Recipe",
    description: "Cooking recipe with ingredients and instructions",
    category: "food",
    icon: "👨‍🍳",
    tags: ["recipe", "cooking", "food", "ingredients"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "name", type: "title", value: "Classic Chocolate Chip Cookies" },
        {
          key: "description",
          type: "description",
          value:
            "Delicious homemade chocolate chip cookies that are crispy on the outside and chewy on the inside",
        },
        { key: "cuisine", type: "string", value: "American" },
        { key: "difficulty", type: "string", value: "Easy" },
        { key: "prepTime", type: "number", value: 15 },
        { key: "cookTime", type: "number", value: 12 },
        { key: "servings", type: "number", value: 24 },
        { key: "calories", type: "number", value: 150 },
        { key: "author", type: "fullName", value: "Chef Maria Santos" },
        { key: "rating", type: "number", value: 4.8 },
        { key: "image", type: "image", value: "https://picsum.photos/400/300" },
        {
          key: "ingredients",
          type: "array",
          length: 5,
          fields: [
            { key: "item", type: "string", value: "2 cups all-purpose flour" },
            { key: "category", type: "string", value: "dry ingredients" },
          ],
        },
        {
          key: "instructions",
          type: "array",
          length: 6,
          fields: [
            { key: "step", type: "number", value: 1 },
            {
              key: "instruction",
              type: "string",
              value: "Preheat oven to 375°F (190°C)",
            },
          ],
        },
      ],
    },
  },
  {
    id: "menu-item",
    name: "Menu Item",
    description: "Restaurant menu item with pricing and details",
    category: "food",
    icon: "🍕",
    tags: ["menu", "food", "restaurant", "pricing"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "name", type: "title", value: "Margherita Pizza" },
        {
          key: "description",
          type: "description",
          value:
            "Fresh tomato sauce, mozzarella cheese, and basil on a crispy thin crust",
        },
        { key: "category", type: "string", value: "Pizza" },
        { key: "price", type: "price", value: 16.95 },
        { key: "currency", type: "currency", value: "USD" },
        { key: "calories", type: "number", value: 680 },
        { key: "isVegetarian", type: "boolean", value: true },
        { key: "isGlutenFree", type: "boolean", value: false },
        { key: "spicyLevel", type: "number", value: 0 },
        { key: "cookTime", type: "number", value: 15 },
        { key: "popularity", type: "number", value: 95 },
        { key: "image", type: "image", value: "https://picsum.photos/300/200" },
        {
          key: "allergens",
          type: "array",
          length: 2,
          fields: [{ key: "item", type: "string", value: "Gluten" }],
        },
      ],
    },
  },

  // Weather Templates
  {
    id: "weather-data",
    name: "Weather Data",
    description: "Current weather conditions and forecast data",
    category: "weather",
    icon: "🌤️",
    tags: ["weather", "forecast", "temperature", "conditions"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "location", type: "city", value: "San Francisco" },
        { key: "country", type: "country", value: "United States" },
        { key: "latitude", type: "number", value: 37.7749 },
        { key: "longitude", type: "number", value: -122.4194 },
        { key: "timestamp", type: "date", value: "2024-06-15T14:00:00Z" },
        { key: "temperature", type: "number", value: 22 },
        { key: "temperatureUnit", type: "string", value: "Celsius" },
        { key: "feelsLike", type: "number", value: 24 },
        { key: "humidity", type: "number", value: 65 },
        { key: "pressure", type: "number", value: 1013 },
        { key: "windSpeed", type: "number", value: 15 },
        { key: "windDirection", type: "string", value: "NW" },
        { key: "visibility", type: "number", value: 10 },
        { key: "condition", type: "string", value: "Partly Cloudy" },
        { key: "uvIndex", type: "number", value: 6 },
        {
          key: "forecast",
          type: "array",
          length: 5,
          fields: [
            { key: "date", type: "date", value: "2024-06-16" },
            { key: "high", type: "number", value: 25 },
            { key: "low", type: "number", value: 18 },
            { key: "condition", type: "string", value: "Sunny" },
          ],
        },
      ],
    },
  },

  // Real Estate Templates
  {
    id: "property-listing",
    name: "Property Listing",
    description: "Real estate property listing with details and pricing",
    category: "realestate",
    icon: "🏠",
    tags: ["property", "realestate", "listing", "home"],
    schema: {
      type: "object",
      fields: [
        { key: "id", type: "number", value: 1 },
        { key: "listingId", type: "string", value: "MLS-2024-7890" },
        { key: "title", type: "title", value: "Beautiful Modern Family Home" },
        {
          key: "description",
          type: "description",
          value:
            "Stunning 3-bedroom, 2-bathroom home with open floor plan and modern amenities",
        },
        { key: "price", type: "price", value: 750000 },
        { key: "currency", type: "currency", value: "USD" },
        { key: "bedrooms", type: "number", value: 3 },
        { key: "bathrooms", type: "number", value: 2 },
        { key: "squareFeet", type: "number", value: 2200 },
        { key: "lotSize", type: "number", value: 0.25 },
        { key: "yearBuilt", type: "number", value: 2018 },
        { key: "propertyType", type: "string", value: "Single Family Home" },
        { key: "status", type: "string", value: "For Sale" },
        { key: "address", type: "address", value: "123 Maple Street" },
        { key: "city", type: "city", value: "Portland" },
        { key: "state", type: "string", value: "Oregon" },
        { key: "zipCode", type: "zipCode", value: "97201" },
        { key: "agent", type: "fullName", value: "Jessica Williams" },
        { key: "agentPhone", type: "phone", value: "+1-555-123-7890" },
        {
          key: "features",
          type: "array",
          length: 5,
          fields: [{ key: "item", type: "string", value: "Hardwood Floors" }],
        },
        {
          key: "photos",
          type: "array",
          length: 6,
          fields: [
            {
              key: "url",
              type: "image",
              value: "https://picsum.photos/800/600",
            },
            { key: "caption", type: "string", value: "Living Room" },
          ],
        },
      ],
    },
  },
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
