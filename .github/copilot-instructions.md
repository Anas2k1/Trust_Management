# Trust Management Database App - Project Documentation

## Project Overview
A modern MongoDB database management application built with Next.js 16, React 19, and TypeScript. Provides a beautiful UI for performing CRUD operations on MongoDB collections: Donors, Messages, Subscribers, and Volunteers.

## Technology Stack
- **Framework**: Next.js 16.1.6 with App Router
- **Frontend**: React 19 with TypeScript
- **Database**: MongoDB with Node.js driver
- **Styling**: Tailwind CSS 3.4
- **Build Tool**: Turbopack (Next.js 16 default)
- **Package Manager**: npm

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   └── [collection]/
│   │       ├── route.ts              # GET (list all), POST (create)
│   │       └── [id]/route.ts         # GET (fetch one), PUT (update), DELETE
│   ├── page.tsx                       # Main dashboard
│   ├── layout.tsx                     # Root layout with metadata
│   └── globals.css                    # Tailwind CSS imports
├── components/
│   ├── CollectionSelector.tsx         # Sidebar navigation
│   ├── DocumentTable.tsx              # Display documents in table
│   └── DocumentForm.tsx               # CRUD form component
└── lib/
    └── mongodb.ts                     # MongoDB connection and helpers
```

## Environment Configuration
MongoDB connection string is configured in `.env.local`:
```
MONGODB_URI=mongodb+srv://anasbinasad2:qwe123@trust.kdtbnby.mongodb.net/?appName=Trust
```

## Features Implemented
✅ View all documents in each collection
✅ Create new documents with dynamic field addition
✅ Edit existing documents
✅ Delete documents with confirmation
✅ Real-time table updates
✅ Beautiful dark-themed UI with Tailwind CSS
✅ Responsive design
✅ TypeScript for type safety
✅ API routes following Next.js 16 patterns

## API Endpoints
- `GET /api/donors` - List all donors
- `POST /api/donors` - Create new donor
- `GET /api/donors/[id]` - Get specific donor
- `PUT /api/donors/[id]` - Update donor
- `DELETE /api/donors/[id]` - Delete donor

Same pattern applies for: messages, subscribers, volunteers

## Development Commands
```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Create production build
npm start        # Run production server
npm run lint     # Run ESLint
```

## Key Implementation Details

### API Route Pattern (Next.js 16)
Routes accept params as a Promise that must be awaited:
```typescript
async function handler(request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
}
```

### MongoDB Connection
Connection is cached and reused across requests to improve performance:
- `connectToDatabase()` - Establish/return cached connection
- `getDatabase()` - Get database instance
- `getCollection(name)` - Get specific collection

### Form Handling
The DocumentForm component:
- Auto-parses primitive types (booleans, numbers, null)
- Allows adding/removing fields dynamically
- Supports both create and edit modes
- Handles ObjectId properly for MongoDB

## Testing the App
1. Open http://localhost:3000
2. Select a collection from the sidebar (Donors, Messages, Subscribers, Volunteers)
3. View existing documents in the table
4. Click "New" to create a document
5. Click "✏️" to edit or "🗑️" to delete
6. Use "Refresh" to reload data

## Build Information
- Built on: March 4, 2026
- Next.js Version: 16.1.6
- Node.js requirement: 18+
- Build output: Optimized with Turbopack

## Notes
- Credentials are embedded in .env.local (for development only)
- For production, use environment variables from deployment platform
- The app uses MongoDB's Node.js driver for direct database access
- All API routes are server-side rendered and secure
