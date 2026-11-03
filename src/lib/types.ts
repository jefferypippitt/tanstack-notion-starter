export type ContentType = 'Post' | 'Project' | 'Link' | 'Experience' | 'About'

export interface Post {
  id: string
  slug: string
  title: string
  summary: string
  date: string
  published: boolean
  tags: string[]
  coverImage?: string
  featured: boolean
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
  // Cover in Notion. With a Cover Video, this is its poster: the clip's first
  // frame, shown while the video loads.
  coverImage?: string
  // Cover Video in Notion: plays in place of the cover image when set.
  coverVideo?: string
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

// A profile link (Type = Link in Notion): Title is the label, URL the target.
export interface SocialLink {
  id: string
  label: string
  url: string
}

// A role (Type = Experience in Notion): Title is the role, Company the
// employer, Date the start and Date's end the finish (no end means current).
export interface Experience {
  id: string
  role: string
  company: string
  start: string
  end: string | null
}

// Everything the About section shows: the About page's body, then experience.
export interface AboutContent {
  blocks: NotionBlock[]
  experience: Experience[]
}
