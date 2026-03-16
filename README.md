<p align="center">
  <img src="./public/logo.svg" alt="Obscur logo" width="88" />
</p>

<h1 align="center">Obscur</h1>

<p align="center">
  Personal Portfolio and Engineering Blog
</p>

<p align="center">
  Built with Next.js, React, TypeScript, Prisma, and PostgreSQL
</p>

This project is where I showcase my background, publish writing on software and algorithms, and keep improving full-stack product and UI craft.

## What This Project Includes

- Portfolio landing page with animated sections for background, skills, and experience
- Blog platform with searchable posts
- Tag filtering, pinned posts, and per-post view counts
- Public comment system on posts
- Admin authoring flow for creating, editing, and publishing posts
- PostgreSQL data layer modeled with Prisma
- Type-safe API and UI code with modern Next.js App Router

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- Backend: Next.js Route Handlers, Prisma ORM
- Database: PostgreSQL
- Tooling: ESLint, Prettier

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME"
ADMIN_PASSWORD="change-this-password"
DEFAULT_BLOG_USER_EMAIL="blog@yourdomain.com"
```

### 3. Run database migrations

```bash
npx prisma migrate dev
```

### 4. Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Scripts

- `npm run dev` - start development server
- `npm run build` - generate Prisma client, run deploy migrations, then build Next.js app
- `npm run start` - start production server
- `npm run lint` - run lint checks
- `npm run format` - format code with Prettier

## Main Routes

- `/` - portfolio home
- `/blog` - public blog index
- `/blog/[slug]` - blog post detail page
- `/admin/blog/new` - create post (admin password protected)
- `/admin/blog/[slug]/edit` - edit, delete, pin, or publish a post

## Data Model (Prisma)

Core entities:

- `User`
- `BlogPost`
- `Comment`
- `Todo`
- `Note`

## Current Status

The portfolio and blog are the primary polished experience and the main focus of this repository.

`/notes` and `/todos` are experimental and still in progress, and are being iterated on separately from the portfolio/blog core.

## Contact

- Email: `strychn2005@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/minh-gia-nguyen-884792257/`
- GitHub: `https://github.com/MinhGiaNgy`

## Credits

Some animation patterns and visual inspiration are adapted from `reactbits.dev`.
