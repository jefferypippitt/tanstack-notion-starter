import type { AboutContent, NotionBlock, Post, Project, RichText, SocialLink } from './types'
import { posts as demoPosts, type DemoBlock, type DemoRichText } from '../../scripts/notion-demo-content.mjs'

// The sample posts are the same demo posts `pnpm setup:notion --seed`
// writes to Notion, converted from the Notion API's block shape to the one
// the renderer reads, so the site looks the same before and after setup.
function toRichText(runs: DemoRichText[]): RichText[] {
  return runs.map((run) => ({ text: run.text.content, href: run.text.link?.url, ...run.annotations }))
}

function toBlock(block: DemoBlock): NotionBlock | null {
  const value = block[block.type]
  switch (block.type) {
    case 'paragraph':
    case 'heading_1':
    case 'heading_2':
    case 'heading_3':
    case 'bulleted_list_item':
    case 'numbered_list_item':
    case 'quote':
      return { type: block.type, text: toRichText(value.rich_text) }
    case 'callout':
      return { type: 'callout', text: toRichText(value.rich_text), icon: value.icon?.emoji }
    case 'code':
      return { type: 'code', text: toRichText(value.rich_text), language: value.language }
    case 'image':
      return { type: 'image', url: value.external.url, caption: value.caption?.[0]?.text.content }
    case 'divider':
      return { type: 'divider' }
    default:
      return null
  }
}

export const samplePosts: Post[] = demoPosts.map((post, index) => ({
  id: `sample-post-${index + 1}`,
  slug: post.slug,
  title: post.title,
  summary: post.summary,
  date: post.date,
  published: true,
  tags: post.tags,
  coverImage: post.cover,
  featured: index === 0,
  content: post.body.map(toBlock).filter((block): block is NotionBlock => block !== null),
}))

export const sampleProjects: Project[] = [
  {
    id: 'sample-project-1',
    slug: 'notion-cms-starter',
    title: 'Notion CMS Starter',
    description:
      'A blog and portfolio template that uses Notion as its CMS.',
    date: '2024-01-20',
    published: true,
    tags: ['TanStack', 'Notion', 'TypeScript'],
    featured: true,
    repoUrl: 'https://example.com/notion-cms-starter',
    liveUrl: 'https://example.com',
    content: [
      {
        type: 'paragraph',
        text: [
          { text: 'This is a sample project. Connect your Notion database to show your own.' },
        ],
      },
      {
        type: 'heading_2',
        text: [{ text: 'Features' }],
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
    description: 'A shared task list for teams.',
    date: '2024-01-15',
    published: true,
    tags: ['React', 'TypeScript', 'Firebase'],
    featured: true,
    repoUrl: 'https://example.com/task-manager',
    liveUrl: 'https://example.com',
  },
  {
    id: 'sample-project-3',
    slug: 'weather-dashboard',
    title: 'Weather Dashboard',
    description: 'Live weather data with charts and forecasts.',
    date: '2024-01-10',
    published: true,
    tags: ['React', 'API', 'Data Visualization'],
    featured: false,
    liveUrl: 'https://example.com',
  },
]

// No sample links: any placeholder username would point at a real person's
// account. Add Type = Link rows in Notion to fill the links row.
export const sampleLinks: SocialLink[] = []

export const sampleAbout: AboutContent = {
  blocks: [
    {
      type: 'paragraph',
      text: [
        {
          text: 'I build web applications that load fast, work for everyone, and are easy to use.',
        },
      ],
    },
    {
      type: 'paragraph',
      text: [
        {
          text: 'This sample text comes from the starter. Add a Type = About page in Notion and its body replaces it.',
        },
      ],
    },
  ],
  experience: [
    {
      id: 'sample-experience-1',
      role: 'Senior Frontend Engineer',
      company: 'Acme Inc.',
      start: '2022-01-01',
      end: null,
    },
    {
      id: 'sample-experience-2',
      role: 'Frontend Engineer',
      company: 'Acme Inc.',
      start: '2019-01-01',
      end: '2022-01-01',
    },
  ],
}
