# Trust Management - MongoDB Database Admin

A modern web application for managing your MongoDB "Trust" database with an intuitive UI for performing CRUD operations on collections: Donors, Messages, Subscribers, and Volunteers.

## Features

✨ **Collection Management**
- View all documents in each collection
- Create new documents
- Edit existing documents
- Delete documents

🎨 **Beautiful UI**
- Dark-themed, modern interface
- Responsive design
- Easy navigation
- Real-time updates

🚀 **Technology Stack**
- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **API**: Next.js App Router with dynamic routes

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env.local`

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Collections
The app manages four main collections:
- **Donors** 💰 - Donation records
- **Messages** 💬 - Communication logs
- **Subscribers** 👥 - Subscriber information
- **Volunteers** 🙋 - Volunteer details

### CRUD Operations

**Create**: Click the "New" button to add a new document
**Read**: Documents are displayed in a table with sortable columns
**Update**: Click the edit icon (✏️) to modify a document
**Delete**: Click the delete icon (🗑️) to remove a document

## API Routes

All API endpoints follow the pattern `/api/[collection]`:

- `GET /api/[collection]` - Fetch all documents
- `POST /api/[collection]` - Create a new document
- `GET /api/[collection]/[id]` - Fetch a specific document
- `PUT /api/[collection]/[id]` - Update a document
- `DELETE /api/[collection]/[id]` - Delete a document

## Available Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── [collection]/
│   │       └── [id]/route.ts      # API handlers
│   ├── page.tsx                     # Main page
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Global styles
├── components/
│   ├── CollectionSelector.tsx      # Collection navigation
│   ├── DocumentTable.tsx           # Document list view
│   └── DocumentForm.tsx             # CRUD form
└── lib/
    └── mongodb.ts                   # Database connection
```

## Configuration

The MongoDB connection string is stored in `.env.local`:
```
MONGODB_URI=mongodb+srv://anasbinasad2:qwe123@trust.kdtbnby.mongodb.net/?appName=Trust
```

## License

MIT
