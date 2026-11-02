import type { Post, Project } from './types'

export const samplePosts: Post[] = [
  {
    id: 'sample-1',
    slug: 'getting-started-with-tanstack-start',
    title: 'Getting Started with TanStack Start',
    summary:
      'Learn how to build modern web applications with TanStack Start, the full-stack React framework.',
    date: '2024-01-15',
    published: true,
    tags: ['TanStack', 'React', 'Tutorial'],
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    content: [
      {
        type: 'paragraph',
        text: [{ text: 'This is a sample post to demonstrate the blog functionality.' }],
      },
      {
        type: 'heading_2',
        text: [{ text: 'Connect your Notion database' }],
      },
      {
        type: 'paragraph',
        text: [
          {
            text: 'To replace this sample content with your own posts from Notion, follow the setup instructions in the README.',
          },
        ],
      },
      {
        type: 'code',
        text: [{ text: 'npm install\nnpm run dev' }],
        language: 'bash',
      },
    ],
  },
  {
    id: 'sample-2',
    slug: 'building-with-typescript',
    title: 'Building Type-Safe Applications with TypeScript',
    summary: 'Explore best practices for building robust applications with TypeScript.',
    date: '2024-01-10',
    published: true,
    tags: ['TypeScript', 'Best Practices'],
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
  },
  {
    id: 'sample-3',
    slug: 'modern-css-with-tailwind',
    title: 'Modern CSS with Tailwind',
    summary: 'How Tailwind CSS changed the way we think about styling web applications.',
    date: '2024-01-05',
    published: true,
    tags: ['CSS', 'Tailwind', 'Design'],
    coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80',
  },
]

export const sampleProjects: Project[] = [
  {
    id: 'sample-project-1',
    slug: 'notion-cms-starter',
    title: 'Notion CMS Starter',
    description:
      'A production-ready starter template for building blogs and portfolios with Notion as a CMS.',
    date: '2024-01-20',
    published: true,
    tags: ['TanStack', 'Notion', 'TypeScript'],
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    featured: true,
    repoUrl: 'https://github.com/yourusername/notion-cms-starter',
    liveUrl: 'https://notion-starter.vercel.app',
    content: [
      {
        type: 'paragraph',
        text: [
          { text: 'This is a sample project. Connect your Notion database to display real projects.' },
        ],
      },
      {
        type: 'heading_2',
        text: [{ text: 'Key Features' }],
      },
      {
        type: 'bulleted_list_item',
        text: [{ text: 'TanStack Start for full-stack React' }],
      },
      {
        type: 'bulleted_list_item',
        text: [{ text: 'Notion as a headless CMS' }],
      },
      {
        type: 'bulleted_list_item',
        text: [{ text: 'TypeScript for type safety' }],
      },
      {
        type: 'bulleted_list_item',
        text: [{ text: 'Tailwind CSS for styling' }],
      },
    ],
  },
  {
    id: 'sample-project-2',
    slug: 'task-manager-app',
    title: 'Task Manager App',
    description: 'A collaborative task management application built with modern web technologies.',
    date: '2024-01-15',
    published: true,
    tags: ['React', 'TypeScript', 'Firebase'],
    featured: true,
    repoUrl: 'https://github.com/yourusername/task-manager',
    liveUrl: 'https://task-manager-demo.vercel.app',
  },
  {
    id: 'sample-project-3',
    slug: 'weather-dashboard',
    title: 'Weather Dashboard',
    description: 'Real-time weather data visualization with charts and forecasts.',
    date: '2024-01-10',
    published: true,
    tags: ['React', 'API', 'Data Visualization'],
    featured: false,
    liveUrl: 'https://weather-dash-demo.vercel.app',
  },
]
