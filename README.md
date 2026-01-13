# Obscur
A note taking, todo and blogging web app built using Next.js and PostgreSQL (Neon Prisma)

## Features
- **Notes**: notetaking with tags and pinning
- **Todos**: task management with  due dates // WIP
- **Blog**: blog posts with markdown support
- **UI**: with elements from REACTbits 
- **Type-Safe**: TypeScript coverage for reliability
- **Database**: PostgreSQL with Prisma ORM 
- **SQL Injection-proof**: self tested by myself

## Tech Stack

### Frontend
- **Next.js 14+** - React framework with App Router
- **TypeScript** 
- **TailwindCSS** 
- **shadcn/ui** 

### Backend
- **Next.js API Routes** 
- **Prisma** 
- **PostgreSQL** 

## Project Structure

```
obscur/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── api/          # API routes
│   │   ├── notes/        # Notes feature pages
│   │   ├── todos/        # Todos feature pages
│   │   └── blog/         # Blog feature pages
│   ├── components/       # React components
│   │   └── ui/           # shadcn/ui components
│   ├── lib/              # Utilities and Prisma client
│   └── types/            # TypeScript type definitions
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd obscur
```
2. Install dependencies:
```bash
npm install
```
3. Set up database:

4. Run the development server:
```bash
npm run dev
```

then open [http://localhost:3000](http://localhost:3000) in  browser


### Database Schema

The database includes four main models:
- **User**: user authentication // WIP
- **Note**: notetaking with tags and pinning
- **Todo**: task management // WIP
- **BlogPost**: blog posts with markdown 

## TODO LIST

- [ ] user auth (NextAuth.js or Clerk)
- [ ] a markdown editor
- [ ] search and filtering
- [ ] todo organization
- [ ] export functionality
- [ ] electron app version

