// Types for the parts of notion-demo-content.mjs the app imports: the demo
// posts double as the site's sample posts when Notion isn't connected.

/** A rich-text run in the Notion API's shape. */
export interface DemoRichText {
  type: 'text'
  text: { content: string; link?: { url: string } }
  annotations?: { bold?: boolean; italic?: boolean; code?: boolean }
}

/** A page-body block in the Notion API's shape, as `notion.pages.create` takes it. */
export type DemoBlock = { type: string } & Record<string, any>

export interface DemoPost {
  slug: string
  title: string
  summary: string
  date: string
  tags: string[]
  /** The cover image's URL. */
  cover: string
  /** The original article. */
  url?: string
  body: DemoBlock[]
}

export declare const posts: DemoPost[]
