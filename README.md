# 📝 Mocklyst - Instant API Mocking Tool

Create instant, temporary mock API endpoints in seconds. No login required, auto-expires in 7 days.

## ✨ Features

- **Zero Friction**: No authentication, no install, no clutter
- **Fast**: 30 seconds from landing to working endpoint
- **Flexible**: Support for objects, arrays, and primitive types
- **Auto-Cleanup**: All endpoints expire after 7 days
- **CORS Enabled**: Ready for cross-origin requests
- **Modern UI**: Built with Next.js, shadcn/ui, and TailwindCSS

## 🚀 Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: shadcn/ui, TailwindCSS, Radix UI
- **Icons**: Lucide React
- **Storage**: File-based JSON storage (configurable)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── create-mock/   # Create mock endpoint
│   │   ├── mock/[id]/     # Serve mock data
│   │   └── cleanup/       # Cleanup expired endpoints
│   ├── docs/              # Documentation page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── schema-designer.tsx
│   └── endpoint-result.tsx
├── lib/                   # Utilities
│   ├── utils.ts          # General utilities
│   ├── mock-generator.ts # Mock data generation
│   └── cleanup.ts        # Cleanup utilities
└── types/                 # TypeScript types
    └── index.ts
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
CLEANUP_TOKEN=your-secure-cleanup-token-here
NODE_ENV=development
```

### Storage

By default, mock endpoints are stored as JSON files in the `data/mocks/` directory. This can be easily changed to use a database by modifying the API routes.

## 🔗 API Usage

### Create Mock Endpoint

```bash
POST /api/create-mock
Content-Type: application/json

{
  "type": "object",
  "fields": [
    { "key": "id", "type": "number" },
    { "key": "name", "type": "string" }
  ]
}
```

### Use Mock Endpoint

```bash
GET /api/mock/{id}
```

### Cleanup (Automated)

```bash
POST /api/cleanup
Authorization: Bearer your-cleanup-token
```

## 📚 Response Types

### Object
Returns a single JSON object:
```json
{
  "id": 1,
  "name": "string_value",
  "active": true
}
```

### Array
Returns an array of objects:
```json
[
  { "id": 1, "name": "string_1" },
  { "id": 2, "name": "string_2" }
]
```

### Primitive
Returns a single value:
```json
"Hello World"
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Response Types**: Extend the `MockSchema` type and update the generator
2. **Database Storage**: Replace file operations in API routes with database calls
3. **Authentication**: Add auth middleware to API routes
4. **Rate Limiting**: Implement rate limiting in API routes

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Cleanup

Set up a cron job to call the cleanup endpoint:

```bash
# Run daily at midnight
0 0 * * * curl -X POST -H "Authorization: Bearer your-token" https://your-domain.com/api/cleanup
```

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- 📖 [Documentation](http://localhost:3000/docs)
- 🐛 [Issues](https://github.com/yourusername/mocklyst/issues)
- 💬 [Discussions](https://github.com/yourusername/mocklyst/discussions)

---

Built with ❤️ using Next.js, shadcn/ui, and TailwindCSS
