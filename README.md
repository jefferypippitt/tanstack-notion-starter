# TanStack Start + Notion CMS Starter

A production-ready, forkable starter template for building beautiful blogs and portfolio sites using **TanStack Start** with **Notion as a headless CMS**.

![Screenshot placeholder - Replace with your deployed site](https://via.placeholder.com/1200x630/4FB8B2/FFFFFF?text=Your+Blog+%26+Portfolio)

## ✨ Features

- **🚀 TanStack Start** - Full-stack React framework with type-safe routing
- **📝 Notion as CMS** - Manage all content in Notion, no database required
- **🎨 Beautiful Design** - Modern, minimal UI with Tailwind CSS
- **🌓 Dark Mode** - Automatic light/dark theme with system preference detection
- **📱 Fully Responsive** - Looks great on all devices
- **⚡ Fast & Optimized** - Server-side rendering with intelligent caching
- **🔍 SEO Ready** - Meta tags, Open Graph, sitemap, RSS feed, robots.txt
- **📦 Zero Config** - Works out of the box with sample content
- **🎯 TypeScript** - Full type safety across the entire stack
- **✅ Production Ready** - Deploy to Vercel in minutes

## 📁 Content Model

This template supports two approaches for organizing content in Notion:

### Option 1: Single Database (Recommended)
Create one database with a **Type** select property (`Post` or `Project`). This keeps everything in one place.

### Option 2: Separate Databases
Create two databases: one for **Posts** and one for **Projects**. Use this if you prefer complete separation.

### Required Properties

Both approaches need these properties:

**For Posts & Projects:**
- **Title** (Title)
- **Slug** (Text) - URL-friendly identifier (e.g., "my-first-post")
- **Published** (Checkbox) - Controls visibility
- **Date** (Date) - Publication or project date
- **Tags** (Multi-select) - For filtering and categorization
- **Cover** (Files) - Optional cover image (or use Notion's page cover)

**Posts only:**
- **Summary** (Text) - Short description for cards and meta tags

**Projects only:**
- **Description** (Text) - Project overview
- **Featured** (Checkbox) - Highlight on homepage
- **Repo URL** (URL) - Link to source code
- **Live URL** (URL) - Link to live demo

> **Content** is pulled from the Notion page body blocks automatically.

## 🚀 Quick Start

### 1. Fork and Clone

```bash
git clone https://github.com/yourusername/notion-cms-starter.git
cd notion-cms-starter
npm install
```

### 2. Set Up Notion

#### a. Create a Notion Integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **+ New integration**
3. Give it a name (e.g., "My Blog")
4. Select your workspace
5. Copy the **Internal Integration Token** (starts with `secret_`)

#### b. Create Your Database(s)

**Option 1 - Single Database:**
1. [Duplicate this template database](https://www.notion.so/your-template-link) (or create from scratch)
2. Add the required properties listed above, including a **Type** select with options: `Post`, `Project`
3. Click **Share** in the top right
4. Invite your integration by name
5. Copy the database ID from the URL:
   ```
   https://notion.so/workspace/DATABASE_ID?v=...
                            ^^^^^^^^^^^^
   ```

**Option 2 - Separate Databases:**
1. Create two databases (Posts and Projects)
2. Add the relevant properties to each
3. Share both with your integration
4. Copy both database IDs

#### c. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```bash
# Your Notion integration token
NOTION_API_KEY=secret_your_integration_token_here

# Option 1: Single database
NOTION_DATABASE_ID=your_database_id_here

# Option 2: Separate databases (comment out NOTION_DATABASE_ID above)
# NOTION_POSTS_DATABASE_ID=your_posts_database_id
# NOTION_PROJECTS_DATABASE_ID=your_projects_database_id
```

### 3. Customize Site Config

Edit `src/config/site.ts`:

```typescript
export const siteConfig = {
  name: 'Your Name',
  title: 'Portfolio & Blog',
  description: 'Developer, designer, and creator of things.',
  url: 'https://your-site.com',
  author: {
    name: 'Your Name',
    bio: 'I build things for the web...',
    avatar: '/avatar.jpg',
  },
  social: {
    github: 'https://github.com/yourusername',
    twitter: 'https://twitter.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    email: 'hello@your-site.com',
  },
  links: {
    home: '/',
    blog: '/blog',
    projects: '/projects',
    about: '/about',
  },
}
```

### 4. Run Locally

```bash
npm run dev
```

Visit [http://localhost:43210](http://localhost:43210)

> **Note:** The app works without Notion configured! It shows sample content until you add your credentials.

## 🌐 Deploy to Vercel

### Method 1: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/notion-cms-starter&env=NOTION_API_KEY,NOTION_DATABASE_ID)

### Method 2: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Method 3: GitHub Integration

1. Push your code to GitHub
2. Import the repository in [vercel.com/new](https://vercel.com/new)
3. Add environment variables:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID` (or separate database IDs)
4. Deploy!

## 🎨 Customization

### Update Styling

Global styles are in `src/styles.css`. The template uses CSS variables for theming:

```css
--sea-ink: /* Primary text color */
--sea-ink-soft: /* Secondary text color */
--lagoon-deep: /* Accent color */
```

### Add Pages

Create new route files in `src/routes/`:

```typescript
// src/routes/contact.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  return <div>Contact page</div>
}
```

### Modify Components

Reusable components are in `src/components/`:
- `Header.tsx` - Navigation bar
- `Footer.tsx` - Site footer
- `PostCard.tsx` - Blog post preview
- `ProjectCard.tsx` - Project preview
- `NotionRenderer.tsx` - Renders Notion blocks

## 📝 Content Management

### Creating Posts

1. In Notion, add a new page to your database
2. Set **Type** to `Post` (or add to Posts database)
3. Fill in all required properties
4. Write your content using Notion blocks
5. Check **Published** when ready
6. Your site will fetch it automatically!

### Creating Projects

Same as posts, but set **Type** to `Project` (or add to Projects database). Optionally set **Featured** to highlight it on the homepage.

### Supported Notion Blocks

- Paragraphs
- Headings (H1, H2, H3)
- Bulleted & numbered lists
- Code blocks (with syntax highlighting)
- Quotes
- Callouts
- Dividers
- Images
- Bookmarks/links
- Toggle blocks

## 🔧 Advanced Configuration

### Caching Strategy

The template implements sensible caching:
- **Notion API calls** are made server-side only (never exposed to client)
- **Static assets** are cached with Vercel's default strategy
- **Sitemap & RSS** regenerate every hour

To customize caching, edit the `Cache-Control` headers in route files.

### Notion Image URLs

Notion's image URLs expire after a few hours. This template:
- Displays images directly from Notion (works for SSR)
- Documents the expiration behavior

**Production options:**
1. Upload images to your own CDN and reference them
2. Use Notion's built-in image hosting (refreshed on each build)
3. Proxy images through your own domain with on-demand revalidation

### TypeScript Configuration

Strict mode is enabled. Customize in `tsconfig.json`.

### Environment Variables

All Notion credentials stay server-side. The `server-functions.ts` file ensures API keys never reach the browser.

## 📚 Tech Stack

- [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- [TanStack Router](https://tanstack.com/router) - Type-safe routing
- [Notion API](https://developers.notion.com) - Headless CMS
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter) - Code blocks
- [date-fns](https://date-fns.org) - Date formatting
- [TypeScript](https://www.typescriptlang.org) - Type safety

## 🤝 Contributing

Contributions are welcome! Please open an issue or PR.

## 📄 License

MIT License - feel free to use this template for any project!

---

Built with ❤️ using [TanStack Start](https://tanstack.com/start) and [Notion](https://notion.so)

## 📋 Known Limitations / TODOs

- **SEO Routes (sitemap.xml, rss.xml, robots.txt)**: These routes are implemented but may need adjustment based on your deployment environment. TanStack Start's handling of raw Response objects from loaders is still evolving. Consider generating these statically at build time or using a different approach for production.
- **Notion Image URLs**: Notion's image URLs expire after a few hours. For production, consider using a CDN or image proxy.

## 🆘 Troubleshooting

### Notion API errors

- Verify your integration token is correct
- Ensure the database is shared with your integration
- Check that all required properties exist in your database

### Build errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .tanstack
npm install
```

### TypeScript errors

```bash
# Run type checking
npm run typecheck
```

### Images not loading

Notion image URLs expire. For production, consider:
- Using Notion page covers (more stable)
- Uploading images to a CDN
- Proxying images through your domain
