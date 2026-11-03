import pkg from '@notionhq/client'
const { Client, APIErrorCode, isNotionClientError } = pkg
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'
import type {
  AboutContent,
  Experience,
  NotionBlock,
  Post,
  Project,
  RichText,
  SocialLink,
} from './types'

// An env var, ignoring .env.example's untouched placeholders ("your_..._here"),
// so a fresh copy shows the sample content rather than a Notion error.
function setting(name: string) {
  const value = process.env[name]?.trim()
  return value && !/your_.*_here$/.test(value) ? value : undefined
}

const NOTION_API_KEY = setting('NOTION_API_KEY')
const NOTION_DATABASE_ID = setting('NOTION_DATABASE_ID')
const NOTION_POSTS_DATABASE_ID = setting('NOTION_POSTS_DATABASE_ID')
const NOTION_PROJECTS_DATABASE_ID = setting('NOTION_PROJECTS_DATABASE_ID')
// Links, Experience, and About rows. With one database they sit beside posts and
// projects; with separate databases they get their own.
const NOTION_PROFILE_DATABASE_ID = NOTION_DATABASE_ID || setting('NOTION_PROFILE_DATABASE_ID')

let notionClient: InstanceType<typeof Client> | null = null

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

type DatabaseQuery = {
  filter?: Record<string, unknown>
  sorts?: Array<Record<string, unknown>>
}

// A database's first data source, looked up once per server process. A failed
// lookup isn't kept, so fixing the setup works without a restart.
const dataSourceIds = new Map<string, Promise<string>>()

function getDataSourceId(databaseId: string) {
  let id = dataSourceIds.get(databaseId)
  if (!id) {
    id = (async () => {
      const database = await getNotionClient()!.databases.retrieve({ database_id: databaseId })
      if (!('data_sources' in database) || database.data_sources.length === 0) {
        throw new Error(`Notion database ${databaseId} has no data source`)
      }
      return database.data_sources[0].id
    })()
    id.catch(() => dataSourceIds.delete(databaseId))
    dataSourceIds.set(databaseId, id)
  }
  return id
}

async function queryDatabase(databaseId: string, query: DatabaseQuery) {
  const notion = getNotionClient()
  if (!notion) return { results: [] }

  return notion.dataSources.query({
    data_source_id: await getDataSourceId(databaseId),
    filter: query.filter as never,
    sorts: query.sorts as never,
  })
}

// What's wrong with the Notion setup, if anything, so the site can say how to
// fix it instead of rendering empty. `pnpm setup:notion` fixes most of these.
export type NotionSetupProblem =
  | { code: 'missing-env' }
  | { code: 'bad-token' }
  | { code: 'page-id'; variable: string }
  | { code: 'not-shared'; variable: string }
  | { code: 'missing-columns'; variable: string; columns: string[] }
  | { code: 'unreachable'; message: string }

let setupVerified = false

export async function checkNotionSetup(): Promise<NotionSetupProblem | null> {
  const notion = getNotionClient()
  if (!notion || !isNotionConfigured()) return { code: 'missing-env' }
  if (setupVerified) return null

  // One database for everything, or separate posts and projects databases.
  const databases: Array<[variable: string, id: string, columns: string[]]> = NOTION_DATABASE_ID
    ? [['NOTION_DATABASE_ID', NOTION_DATABASE_ID, ['Title', 'Type', 'Slug', 'Published', 'Date']]]
    : [
        ['NOTION_POSTS_DATABASE_ID', NOTION_POSTS_DATABASE_ID!, ['Title', 'Slug', 'Published', 'Date']],
        ['NOTION_PROJECTS_DATABASE_ID', NOTION_PROJECTS_DATABASE_ID!, ['Title', 'Slug', 'Published', 'Date']],
      ]

  for (const [variable, databaseId, columns] of databases) {
    try {
      const dataSource = await notion.dataSources.retrieve({
        data_source_id: await getDataSourceId(databaseId),
      })
      const missing = columns.filter((column) => !(column in dataSource.properties))
      if (missing.length) return { code: 'missing-columns', variable, columns: missing }
    } catch (error) {
      if (isNotionClientError(error)) {
        if (error.code === APIErrorCode.Unauthorized) return { code: 'bad-token' }
        if (error.code === APIErrorCode.ObjectNotFound) return { code: 'not-shared', variable }
        if (error.code === APIErrorCode.ValidationError && /is a page/i.test(error.message)) {
          return { code: 'page-id', variable }
        }
      }
      return { code: 'unreachable', message: error instanceof Error ? error.message : String(error) }
    }
  }

  setupVerified = true
  return null
}

const NOTION_ID_PATTERN = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i

// Pages without a Slug are linked by their Notion page ID, so fall back to that.
async function findPageBySlug(databaseId: string, slug: string) {
  const response = await queryDatabase(databaseId, {
    filter: { property: 'Slug', rich_text: { equals: slug } },
  })
  if (response.results.length > 0) {
    return response.results[0] as PageObjectResponse
  }

  const notion = getNotionClient()
  if (!notion || !NOTION_ID_PATTERN.test(slug)) return null
  try {
    const page = await notion.pages.retrieve({ page_id: slug })
    return 'properties' in page ? (page as PageObjectResponse) : null
  } catch {
    return null
  }
}

// Files uploaded to Notion come back as signed links that expire after about an
// hour, so they never go into a page directly. Instead the site links to
// /media/<page id>/<kind>, and that route (src/routes/media.$pageId.$kind.ts)
// asks Notion for a fresh link on every request and redirects to it. Links to
// files hosted elsewhere don't expire and are used as they are.
export const MEDIA_KINDS = {
  cover: 'Cover', // the Cover files column
  'cover-video': 'Cover Video', // the Cover Video files column
  'page-cover': null, // the page's own cover, used when there's no Cover column value
} as const

export type MediaKind = keyof typeof MEDIA_KINDS

type FileObject =
  | { type: 'external'; external: { url: string } }
  | { type: 'file'; file: { url: string } }
  | { type: string }

// The file a page holds for one media kind, if any.
function getMediaFile(page: PageObjectResponse, kind: MediaKind): FileObject | undefined {
  const column = MEDIA_KINDS[kind]
  if (column === null) return page.cover ?? undefined
  const property = page.properties[column]
  return property?.type === 'files' ? property.files[0] : undefined
}

function fileUrl(file: FileObject) {
  if (file.type === 'external' && 'external' in file) return file.external.url
  if (file.type === 'file' && 'file' in file) return file.file.url
  return undefined
}

// The link a page should use for one media kind: the file's own URL when it is
// hosted elsewhere, the /media route when Notion hosts it.
function mediaUrl(page: PageObjectResponse, kind: MediaKind): string | undefined {
  const file = getMediaFile(page, kind)
  if (!file) return undefined
  if (file.type === 'file') return `/media/${page.id}/${kind}`
  return fileUrl(file)
}

// The cover image: the Cover column, else the page's own cover.
function coverImageUrl(page: PageObjectResponse) {
  return mediaUrl(page, 'cover') ?? mediaUrl(page, 'page-cover')
}

const normalizeId = (id: string) => id.replace(/-/g, '').toLowerCase()

// A fresh, directly usable URL for one page's media, for the /media route. Only
// published pages in the site's own databases are served, so the route can't be
// used to read drafts or anything else the integration can see.
export async function resolveMediaUrl(pageId: string, kind: MediaKind): Promise<string | null> {
  const notion = getNotionClient()
  if (!notion || !NOTION_ID_PATTERN.test(pageId)) return null

  let page: PageObjectResponse
  try {
    const response = await notion.pages.retrieve({ page_id: pageId })
    if (!('properties' in response)) return null
    page = response as PageObjectResponse
  } catch {
    return null
  }

  const allowed = [NOTION_DATABASE_ID, NOTION_POSTS_DATABASE_ID, NOTION_PROJECTS_DATABASE_ID]
    .filter((id): id is string => !!id)
    .map(normalizeId)
  const parent = page.parent as { database_id?: string }
  if (!parent.database_id || !allowed.includes(normalizeId(parent.database_id))) return null
  if (getProperty(page, 'Published') !== true) return null

  const file = getMediaFile(page, kind)
  return file ? (fileUrl(file) ?? null) : null
}

export async function getPosts(): Promise<Post[]> {
  const notion = getNotionClient()
  if (!notion) return []

  const databaseId = NOTION_DATABASE_ID || NOTION_POSTS_DATABASE_ID
  if (!databaseId) return []

  try {
    const response = await queryDatabase(databaseId, {
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
        coverImage: coverImageUrl(p),
        featured: getProperty(p, 'Featured') || false,
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
    const response = await queryDatabase(databaseId, {
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
        coverImage: coverImageUrl(p),
        coverVideo: mediaUrl(p, 'cover-video'),
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
    const page = await findPageBySlug(databaseId, slug)
    if (!page) return null

    const blocks = await getPageBlocks(page.id)

    return {
      id: page.id,
      slug: getProperty(page, 'Slug') || page.id,
      title: getProperty(page, 'Title') || 'Untitled',
      summary: getProperty(page, 'Summary') || '',
      date: getProperty(page, 'Date') || new Date().toISOString(),
      published: getProperty(page, 'Published') || false,
      tags: getProperty(page, 'Tags') || [],
      coverImage: coverImageUrl(page),
      featured: getProperty(page, 'Featured') || false,
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
    const page = await findPageBySlug(databaseId, slug)
    if (!page) return null

    const blocks = await getPageBlocks(page.id)

    return {
      id: page.id,
      slug: getProperty(page, 'Slug') || page.id,
      title: getProperty(page, 'Title') || 'Untitled',
      description: getProperty(page, 'Description') || '',
      date: getProperty(page, 'Date') || new Date().toISOString(),
      published: getProperty(page, 'Published') || false,
      tags: getProperty(page, 'Tags') || [],
      coverImage: coverImageUrl(page),
      coverVideo: mediaUrl(page, 'cover-video'),
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

// Profile rows: everything personal (links, roles, the About text) lives in
// Notion beside the posts and projects, told apart by Type. Only Published
// rows count, same as posts and projects.
async function queryProfileRows(type: 'Link' | 'Experience' | 'About', sorts: DatabaseQuery['sorts']) {
  if (!NOTION_PROFILE_DATABASE_ID) return []
  const response = await queryDatabase(NOTION_PROFILE_DATABASE_ID, {
    filter: {
      and: [
        { property: 'Published', checkbox: { equals: true } },
        { property: 'Type', select: { equals: type } },
      ],
    },
    sorts,
  })
  return response.results as PageObjectResponse[]
}

// Links show in the order they were created in Notion.
export async function getLinks(): Promise<SocialLink[]> {
  try {
    const pages = await queryProfileRows('Link', [
      { timestamp: 'created_time', direction: 'ascending' },
    ])
    return pages
      .map((page) => ({
        id: page.id,
        label: getProperty(page, 'Title') || '',
        url: getProperty(page, 'URL') || '',
      }))
      .filter((link) => link.label && link.url)
  } catch (error) {
    console.error('Error fetching links:', error)
    return []
  }
}

export async function getAbout(): Promise<AboutContent> {
  try {
    const [aboutPages, experiencePages] = await Promise.all([
      queryProfileRows('About', [{ timestamp: 'last_edited_time', direction: 'descending' }]),
      queryProfileRows('Experience', [{ property: 'Date', direction: 'descending' }]),
    ])

    const blocks = aboutPages[0] ? await getPageBlocks(aboutPages[0].id) : []

    const experience: Experience[] = experiencePages.map((page) => {
      const date = page.properties.Date
      const range = date?.type === 'date' ? date.date : null
      return {
        id: page.id,
        role: getProperty(page, 'Title') || '',
        company: getProperty(page, 'Company') || '',
        start: range?.start ?? '',
        end: range?.end ?? null,
      }
    })

    return { blocks, experience }
  } catch (error) {
    console.error('Error fetching about:', error)
    return { blocks: [], experience: [] }
  }
}
