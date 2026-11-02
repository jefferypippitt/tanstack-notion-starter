import pkg from '@notionhq/client'
const { Client } = pkg
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import type { Post, Project, NotionBlock, RichText } from './types'

const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID
const NOTION_POSTS_DATABASE_ID = process.env.NOTION_POSTS_DATABASE_ID
const NOTION_PROJECTS_DATABASE_ID = process.env.NOTION_PROJECTS_DATABASE_ID

let notionClient: Client | null = null

export function getNotionClient() {
  if (!NOTION_API_KEY) {
    return null
  }
  if (!notionClient) {
    notionClient = new Client({ auth: NOTION_API_KEY })
  }
  return notionClient
}

export function isNotionConfigured() {
  return !!(
    NOTION_API_KEY &&
    (NOTION_DATABASE_ID || (NOTION_POSTS_DATABASE_ID && NOTION_PROJECTS_DATABASE_ID))
  )
}

function getProperty(page: PageObjectResponse, propertyName: string): any {
  const property = page.properties[propertyName]
  if (!property) return null

  switch (property.type) {
    case 'title':
      return property.title.map((t) => t.plain_text).join('')
    case 'rich_text':
      return property.rich_text.map((t) => t.plain_text).join('')
    case 'checkbox':
      return property.checkbox
    case 'date':
      return property.date?.start || null
    case 'select':
      return property.select?.name || null
    case 'multi_select':
      return property.multi_select.map((s) => s.name)
    case 'url':
      return property.url || null
    case 'files':
      if (property.files.length > 0) {
        const file = property.files[0]
        if (file.type === 'external') {
          return file.external.url
        } else if (file.type === 'file') {
          return file.file.url
        }
      }
      return null
    default:
      return null
  }
}

function getCoverImage(page: PageObjectResponse): string | undefined {
  if (page.cover) {
    if (page.cover.type === 'external') {
      return page.cover.external.url
    } else if (page.cover.type === 'file') {
      return page.cover.file.url
    }
  }
  return undefined
}

export async function getPosts(): Promise<Post[]> {
  const notion = getNotionClient()
  if (!notion) return []

  const databaseId = NOTION_DATABASE_ID || NOTION_POSTS_DATABASE_ID
  if (!databaseId) return []

  try {
    const response = await (notion.databases as any).query({
      database_id: databaseId,
      filter: NOTION_DATABASE_ID
        ? {
            and: [
              { property: 'Published', checkbox: { equals: true } },
              { property: 'Type', select: { equals: 'Post' } },
            ],
          }
        : { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
    })

    return response.results.map((page: any) => {
      const p = page as PageObjectResponse
      return {
        id: p.id,
        slug: getProperty(p, 'Slug') || p.id,
        title: getProperty(p, 'Title') || 'Untitled',
        summary: getProperty(p, 'Summary') || '',
        date: getProperty(p, 'Date') || new Date().toISOString(),
        published: getProperty(p, 'Published') || false,
        tags: getProperty(p, 'Tags') || [],
        coverImage: getProperty(p, 'Cover') || getCoverImage(p),
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export async function getProjects(): Promise<Project[]> {
  const notion = getNotionClient()
  if (!notion) return []

  const databaseId = NOTION_DATABASE_ID || NOTION_PROJECTS_DATABASE_ID
  if (!databaseId) return []

  try {
    const response = await (notion.databases as any).query({
      database_id: databaseId,
      filter: NOTION_DATABASE_ID
        ? {
            and: [
              { property: 'Published', checkbox: { equals: true } },
              { property: 'Type', select: { equals: 'Project' } },
            ],
          }
        : { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
    })

    return response.results.map((page: any) => {
      const p = page as PageObjectResponse
      return {
        id: p.id,
        slug: getProperty(p, 'Slug') || p.id,
        title: getProperty(p, 'Title') || 'Untitled',
        description: getProperty(p, 'Description') || '',
        date: getProperty(p, 'Date') || new Date().toISOString(),
        published: getProperty(p, 'Published') || false,
        tags: getProperty(p, 'Tags') || [],
        coverImage: getProperty(p, 'Cover') || getCoverImage(p),
        featured: getProperty(p, 'Featured') || false,
        repoUrl: getProperty(p, 'Repo URL'),
        liveUrl: getProperty(p, 'Live URL'),
      }
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const notion = getNotionClient()
  if (!notion) return null

  const databaseId = NOTION_DATABASE_ID || NOTION_POSTS_DATABASE_ID
  if (!databaseId) return null

  try {
    const response = await (notion.databases as any).query({
      database_id: databaseId,
      filter: {
        property: 'Slug',
        rich_text: { equals: slug },
      },
    })

    if (response.results.length === 0) return null

    const page = response.results[0] as PageObjectResponse
    const blocks = await getPageBlocks(page.id)

    return {
      id: page.id,
      slug: getProperty(page, 'Slug') || page.id,
      title: getProperty(page, 'Title') || 'Untitled',
      summary: getProperty(page, 'Summary') || '',
      date: getProperty(page, 'Date') || new Date().toISOString(),
      published: getProperty(page, 'Published') || false,
      tags: getProperty(page, 'Tags') || [],
      coverImage: getProperty(page, 'Cover') || getCoverImage(page),
      content: blocks,
    }
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const notion = getNotionClient()
  if (!notion) return null

  const databaseId = NOTION_DATABASE_ID || NOTION_PROJECTS_DATABASE_ID
  if (!databaseId) return null

  try {
    const response = await (notion.databases as any).query({
      database_id: databaseId,
      filter: {
        property: 'Slug',
        rich_text: { equals: slug },
      },
    })

    if (response.results.length === 0) return null

    const page = response.results[0] as PageObjectResponse
    const blocks = await getPageBlocks(page.id)

    return {
      id: page.id,
      slug: getProperty(page, 'Slug') || page.id,
      title: getProperty(page, 'Title') || 'Untitled',
      description: getProperty(page, 'Description') || '',
      date: getProperty(page, 'Date') || new Date().toISOString(),
      published: getProperty(page, 'Published') || false,
      tags: getProperty(page, 'Tags') || [],
      coverImage: getProperty(page, 'Cover') || getCoverImage(page),
      featured: getProperty(page, 'Featured') || false,
      repoUrl: getProperty(page, 'Repo URL'),
      liveUrl: getProperty(page, 'Live URL'),
      content: blocks,
    }
  } catch (error) {
    console.error('Error fetching project:', error)
    return null
  }
}

async function getPageBlocks(pageId: string): Promise<NotionBlock[]> {
  const notion = getNotionClient()
  if (!notion) return []

  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    })

    const blocks: NotionBlock[] = []

    for (const block of response.results as BlockObjectResponse[]) {
      const parsed = await parseBlock(block)
      if (parsed) {
        blocks.push(parsed)
      }
    }

    return blocks
  } catch (error) {
    console.error('Error fetching blocks:', error)
    return []
  }
}

async function parseBlock(block: BlockObjectResponse): Promise<NotionBlock | null> {
  const notion = getNotionClient()

  switch (block.type) {
    case 'paragraph':
      return {
        type: 'paragraph',
        text: parseRichText(block.paragraph.rich_text),
      }
    case 'heading_1':
      return {
        type: 'heading_1',
        text: parseRichText(block.heading_1.rich_text),
      }
    case 'heading_2':
      return {
        type: 'heading_2',
        text: parseRichText(block.heading_2.rich_text),
      }
    case 'heading_3':
      return {
        type: 'heading_3',
        text: parseRichText(block.heading_3.rich_text),
      }
    case 'bulleted_list_item':
      return {
        type: 'bulleted_list_item',
        text: parseRichText(block.bulleted_list_item.rich_text),
      }
    case 'numbered_list_item':
      return {
        type: 'numbered_list_item',
        text: parseRichText(block.numbered_list_item.rich_text),
      }
    case 'code':
      return {
        type: 'code',
        text: parseRichText(block.code.rich_text),
        language: block.code.language || 'plaintext',
      }
    case 'quote':
      return {
        type: 'quote',
        text: parseRichText(block.quote.rich_text),
      }
    case 'callout':
      return {
        type: 'callout',
        text: parseRichText(block.callout.rich_text),
        icon: block.callout.icon?.type === 'emoji' ? block.callout.icon.emoji : undefined,
      }
    case 'divider':
      return { type: 'divider' }
    case 'image':
      const imageUrl =
        block.image.type === 'external'
          ? block.image.external.url
          : block.image.type === 'file'
            ? block.image.file.url
            : ''
      return {
        type: 'image',
        url: imageUrl,
        caption: block.image.caption?.[0]?.plain_text,
      }
    case 'bookmark':
      return {
        type: 'bookmark',
        url: block.bookmark.url,
        caption: block.bookmark.caption?.[0]?.plain_text,
      }
    case 'toggle':
      let children: NotionBlock[] = []
      if (block.has_children && notion) {
        try {
          const childResponse = await notion.blocks.children.list({
            block_id: block.id,
          })
          for (const child of childResponse.results as BlockObjectResponse[]) {
            const parsed = await parseBlock(child)
            if (parsed) children.push(parsed)
          }
        } catch (error) {
          console.error('Error fetching toggle children:', error)
        }
      }
      return {
        type: 'toggle',
        text: parseRichText(block.toggle.rich_text),
        children,
      }
    default:
      return null
  }
}

function parseRichText(richText: any[]): RichText[] {
  return richText.map((text) => ({
    text: text.plain_text || '',
    href: text.href,
    bold: text.annotations?.bold,
    italic: text.annotations?.italic,
    code: text.annotations?.code,
    strikethrough: text.annotations?.strikethrough,
    underline: text.annotations?.underline,
    color: text.annotations?.color,
  }))
}
