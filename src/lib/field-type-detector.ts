import { faker } from '@faker-js/faker';

export type SmartFieldType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "email"
  | "firstName"
  | "lastName"
  | "fullName"
  | "phone"
  | "address"
  | "city"
  | "country"
  | "zipCode"
  | "company"
  | "jobTitle"
  | "date"
  | "url"
  | "username"
  | "password"
  | "uuid"
  | "avatar"
  | "price"
  | "currency"
  | "color"
  | "ip"
  | "mac"
  | "domain"
  | "creditCard"
  | "iban"
  | "age"
  | "gender"
  | "description"
  | "title"
  | "image";

export interface FieldSuggestion {
  type: SmartFieldType;
  confidence: number;
  generator: () => any;
  description: string;
  example: string;
}

// Field name patterns and their corresponding smart types
const fieldPatterns: Array<{
  pattern: RegExp;
  type: SmartFieldType;
  confidence: number;
}> = [
  // Email patterns
  {
    pattern: /^(email|e_mail|mail|email_address)$/i,
    type: "email",
    confidence: 0.9,
  },
  { pattern: /email$/i, type: "email", confidence: 0.8 },

  // Name patterns
  {
    pattern: /^(first_name|firstName|first|fname|given_name)$/i,
    type: "firstName",
    confidence: 0.9,
  },
  {
    pattern: /^(last_name|lastName|last|lname|surname|family_name)$/i,
    type: "lastName",
    confidence: 0.9,
  },
  {
    pattern: /^(full_name|fullName|name|display_name)$/i,
    type: "fullName",
    confidence: 0.8,
  },
  { pattern: /name$/i, type: "fullName", confidence: 0.6 },

  // Contact patterns
  {
    pattern: /^(phone|telephone|tel|phone_number|mobile|cell)$/i,
    type: "phone",
    confidence: 0.9,
  },
  { pattern: /(phone|tel)$/i, type: "phone", confidence: 0.7 },

  // Address patterns
  {
    pattern: /^(address|street|street_address|addr)$/i,
    type: "address",
    confidence: 0.9,
  },
  { pattern: /^(city|town)$/i, type: "city", confidence: 0.9 },
  { pattern: /^(country|nation)$/i, type: "country", confidence: 0.9 },
  {
    pattern: /^(zip|zipcode|zip_code|postal|postal_code|postcode)$/i,
    type: "zipCode",
    confidence: 0.9,
  },

  // Company patterns
  {
    pattern: /^(company|corp|corporation|business|organization|org)$/i,
    type: "company",
    confidence: 0.9,
  },
  {
    pattern: /^(job|position|role|title|job_title|occupation)$/i,
    type: "jobTitle",
    confidence: 0.8,
  },

  // Date patterns
  {
    pattern: /^(date|created|updated|birth|birthday|born|timestamp)$/i,
    type: "date",
    confidence: 0.8,
  },
  { pattern: /(date|time)$/i, type: "date", confidence: 0.6 },

  // Web patterns
  {
    pattern: /^(url|link|website|site|homepage)$/i,
    type: "url",
    confidence: 0.9,
  },
  {
    pattern: /^(username|user|login|handle)$/i,
    type: "username",
    confidence: 0.8,
  },
  {
    pattern: /^(password|pass|pwd|secret)$/i,
    type: "password",
    confidence: 0.9,
  },
  { pattern: /^(id|uuid|guid|identifier)$/i, type: "uuid", confidence: 0.8 },
  {
    pattern: /^(avatar|profile_pic|picture|photo|image)$/i,
    type: "avatar",
    confidence: 0.8,
  },

  // Financial patterns
  {
    pattern: /^(price|cost|amount|value|fee)$/i,
    type: "price",
    confidence: 0.8,
  },
  { pattern: /^(currency|curr)$/i, type: "currency", confidence: 0.9 },
  {
    pattern: /^(credit_card|card|cc|card_number)$/i,
    type: "creditCard",
    confidence: 0.9,
  },
  { pattern: /^(iban|bank_account|account)$/i, type: "iban", confidence: 0.8 },

  // Other patterns
  { pattern: /^(color|colour)$/i, type: "color", confidence: 0.9 },
  { pattern: /^(ip|ip_address|ipv4)$/i, type: "ip", confidence: 0.9 },
  { pattern: /^(mac|mac_address)$/i, type: "mac", confidence: 0.9 },
  { pattern: /^(domain|hostname|host)$/i, type: "domain", confidence: 0.8 },
  { pattern: /^(age|years)$/i, type: "age", confidence: 0.8 },
  { pattern: /^(gender|sex)$/i, type: "gender", confidence: 0.9 },
  {
    pattern: /^(description|desc|summary|bio|about)$/i,
    type: "description",
    confidence: 0.7,
  },
  { pattern: /^(title|heading|subject)$/i, type: "title", confidence: 0.6 },
  {
    pattern: /^(image|img|pic|picture|photo)$/i,
    type: "image",
    confidence: 0.7,
  },
];

// Generators for each smart field type
const fieldGenerators: Record<SmartFieldType, () => any> = {
  string: () => faker.lorem.words(2),
  number: () => faker.number.int({ min: 1, max: 1000 }),
  boolean: () => faker.datatype.boolean(),
  object: () => ({}),
  array: () => [], // Empty array that will be populated based on field configuration
  email: () => faker.internet.email(),
  firstName: () => faker.person.firstName(),
  lastName: () => faker.person.lastName(),
  fullName: () => faker.person.fullName(),
  phone: () => faker.phone.number(),
  address: () => faker.location.streetAddress(),
  city: () => faker.location.city(),
  country: () => faker.location.country(),
  zipCode: () => faker.location.zipCode(),
  company: () => faker.company.name(),
  jobTitle: () => faker.person.jobTitle(),
  date: () => faker.date.recent().toISOString().split("T")[0],
  url: () => faker.internet.url(),
  username: () => faker.internet.username(),
  password: () => faker.internet.password(),
  uuid: () => faker.string.uuid(),
  avatar: () => faker.image.avatar(),
  price: () => faker.commerce.price(),
  currency: () => faker.finance.currencyCode(),
  color: () => faker.color.human(),
  ip: () => faker.internet.ip(),
  mac: () => faker.internet.mac(),
  domain: () => faker.internet.domainName(),
  creditCard: () => faker.finance.creditCardNumber(),
  iban: () => faker.finance.iban(),
  age: () => faker.number.int({ min: 18, max: 80 }),
  gender: () => faker.person.sex(),
  description: () => faker.lorem.sentence(),
  title: () => faker.lorem.words(3),
  image: () => faker.image.url(),
};

// Descriptions for each field type
const fieldDescriptions: Record<SmartFieldType, string> = {
  string: "Generic text string",
  number: "Numeric value",
  boolean: "True/false value",
  object: "Nested object",
  array: "Array/list of items",
  email: "Valid email address",
  firstName: "Person's first name",
  lastName: "Person's last name",
  fullName: "Person's full name",
  phone: "Phone number",
  address: "Street address",
  city: "City name",
  country: "Country name",
  zipCode: "Postal/ZIP code",
  company: "Company name",
  jobTitle: "Job title/position",
  date: "Date in YYYY-MM-DD format",
  url: "Web URL",
  username: "Username/handle",
  password: "Password string",
  uuid: "Unique identifier",
  avatar: "Avatar image URL",
  price: "Price/currency amount",
  currency: "Currency code",
  color: "Color name",
  ip: "IP address",
  mac: "MAC address",
  domain: "Domain name",
  creditCard: "Credit card number",
  iban: "IBAN bank account",
  age: "Age in years",
  gender: "Gender/sex",
  description: "Descriptive text",
  title: "Title or heading",
  image: "Image URL",
};

/**
 * Detects the most likely field type based on field name
 */
export function detectFieldType(fieldName: string): FieldSuggestion[] {
  const suggestions: FieldSuggestion[] = [];
  
  for (const { pattern, type, confidence } of fieldPatterns) {
    if (pattern.test(fieldName)) {
      suggestions.push({
        type,
        confidence,
        generator: fieldGenerators[type],
        description: fieldDescriptions[type],
        example: fieldGenerators[type](),
      });
    }
  }
  
  // Sort by confidence (highest first)
  suggestions.sort((a, b) => b.confidence - a.confidence);
  
  // If no matches found, return default string type
  if (suggestions.length === 0) {
    suggestions.push({
      type: 'string',
      confidence: 0.5,
      generator: fieldGenerators.string,
      description: fieldDescriptions.string,
      example: fieldGenerators.string(),
    });
  }
  
  return suggestions;
}

/**
 * Gets the best field type suggestion for a field name
 */
export function getBestFieldType(fieldName: string): FieldSuggestion {
  const suggestions = detectFieldType(fieldName);
  return suggestions[0];
}

/**
 * Generates a value for a specific field type
 */
export function generateValueForType(type: SmartFieldType): any {
  return fieldGenerators[type]();
}

/**
 * Gets all available field types
 */
export function getAvailableFieldTypes(): Array<{ type: SmartFieldType; description: string }> {
  return Object.entries(fieldDescriptions).map(([type, description]) => ({
    type: type as SmartFieldType,
    description,
  }));
}

/**
 * Checks if a field type is a primitive type
 */
export function isPrimitiveType(type: SmartFieldType): boolean {
  return ['string', 'number', 'boolean'].includes(type);
}

/**
 * Checks if a field type is a smart/enhanced type
 */
export function isSmartType(type: SmartFieldType): boolean {
  return !isPrimitiveType(type) && type !== 'object';
}
