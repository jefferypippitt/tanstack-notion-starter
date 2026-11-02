export type ContentType = 'Post' | 'Project'

export interface Post {
  id: string
  slug: string
  title: string
  summary: string
  date: string
  published: boolean
  tags: string[]
  coverImage?: string
  content?: NotionBlock[]
}

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  date: string
  published: boolean
  tags: string[]
  coverImage?: string
  featured: boolean
  repoUrl?: string
  liveUrl?: string
  content?: NotionBlock[]
}

export type NotionBlock =
  | { type: 'paragraph'; text: RichText[] }
  | { type: 'heading_1'; text: RichText[] }
  | { type: 'heading_2'; text: RichText[] }
  | { type: 'heading_3'; text: RichText[] }
  | { type: 'bulleted_list_item'; text: RichText[] }
  | { type: 'numbered_list_item'; text: RichText[] }
  | { type: 'code'; text: RichText[]; language: string }
  | { type: 'quote'; text: RichText[] }
  | { type: 'callout'; text: RichText[]; icon?: string }
  | { type: 'divider' }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'bookmark'; url: string; caption?: string }
  | { type: 'toggle'; text: RichText[]; children: NotionBlock[] }

export interface RichText {
  text: string
  href?: string
  bold?: boolean
  italic?: boolean
  code?: boolean
  strikethrough?: boolean
  underline?: boolean
  color?: string
}
