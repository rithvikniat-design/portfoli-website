# Director Portfolio

A cinematic, full-stack portfolio website built for a film/TV director and novelist. It features a completely custom **Editorial CMS** that allows the site owner to manage all content without writing a single line of code. 

## Features

- **Cinematic Design**: Minimal, dark A24-style aesthetic with film grain, elegant typography (Playfair Display / Inter), and gold accents.
- **Editorial CMS**: Fully custom admin dashboard to manage Works, In-Development projects, Novels, the About page, and Site Settings.
- **Rich Text Editor**: Integrated TipTap editor for writing treatments, synopses, and formatting long descriptions.
- **Media Library**: Upload posters, cover images, and stills. Images are automatically optimized and converted to WebP format using `sharp`.
- **Works & Filmography**: Detailed project pages with loglines, embedded trailers, and rich descriptions.
- **In-Development Projects**: Track projects in their conceptual, pre-production, or financing stages.
- **Literature / Novels**: Display published or forthcoming written works with synopses and excerpts.
- **Contact Form**: Direct messaging system that logs submissions into the admin dashboard.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom animations and variables
- **Database**: Prisma ORM with SQLite (development)
- **Authentication**: NextAuth.js (Credentials Provider)
- **Image Processing**: `sharp` via `react-dropzone`
- **Typography**: `next/font/google`

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rithvikniat-design/portfoli-website.git
   cd portfoli-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Copy the example environment file and create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   Ensure you have a `NEXTAUTH_SECRET` generated (e.g. `openssl rand -base64 32`).

4. **Initialize the Database:**
   Generate Prisma client and push the schema to your SQLite database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the Database:**
   Populate the initial admin user and sample content:
   ```bash
   npm run db:seed
   ```

6. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The site will be available at [http://localhost:3000](http://localhost:3000).

## Admin Access

You can access the Editorial CMS by navigating to `/admin`.

**Default Seed Credentials:**
- **Email:** `director@example.com`
- **Password:** `changeme123`

*(Note: Please change these credentials or modify the seed script for production use.)*

## Deployment

For production, it is highly recommended to migrate from SQLite to a robust database like PostgreSQL (e.g., Supabase, Vercel Postgres, or Neon). You will need to update the `provider` in `prisma/schema.prisma` from `"sqlite"` to `"postgresql"` and run `npx prisma db push`.
