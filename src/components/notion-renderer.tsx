import { ChevronRightIcon } from 'lucide-react'
import type { NotionBlock, RichText } from '@/lib/types'
import { useHighlightedCode } from '@/hooks/use-highlighted-code'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from '@/components/ui/code-block'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'
import { typeClass } from '@/lib/type-scale'
import { surfaceClasses } from '@/lib/surface-classes'
import { useSurface } from '@/lib/surface-context'
import { Elevated } from '@/lib/elevated'

function RichTextRenderer({ richText }: { richText: RichText[] }) {
  return (
    <>
      {richText.map((text, i) => {
        let element: React.ReactNode = text.text

        // Plain elements: .typeset styles code, strong, and links.
        if (text.code) element = <code>{element}</code>
        if (text.bold) element = <strong>{element}</strong>
        if (text.italic) element = <em>{element}</em>
        if (text.strikethrough) element = <s>{element}</s>
        if (text.underline) element = <u>{element}</u>
        if (text.href) {
          element = (
            <a href={text.href} target="_blank" rel="noopener noreferrer">
              {element}
            </a>
          )
        }

        return <span key={i}>{element}</span>
      })}
    </>
  )
}

function plainText(richText: RichText[]) {
  return richText.map((t) => t.text).join('')
}

function NotionCode({ code, language }: { code: string; language: string }) {
  const lines = useHighlightedCode(code, language)
  const label = language === 'plain text' ? 'Text' : language

  return (
    // A card one step above the prose. The stock block goes transparent inside
    // it (its own dark fill would cover the surface). .not-typeset keeps the
    // prose rules out while the card still takes the prose spacing above it.
    <Elevated offset={1} className="not-typeset rounded-lg">
      <CodeBlock className="border-0 bg-transparent dark:bg-transparent">
        <CodeBlockHeader>
          <CodeBlockTitle>{label}</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </Elevated>
  )
}

function ToggleBlock({ text, children }: { text: RichText[]; children: NotionBlock[] }) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="group/toggle flex items-baseline gap-2 text-left text-foreground weight-semibold">
        <ChevronRightIcon
          aria-hidden
          className="size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform group-data-[panel-open]/toggle:rotate-90"
        />
        <RichTextRenderer richText={text} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 pl-6">
        <BlockList blocks={children} />
      </CollapsibleContent>
    </Collapsible>
  )
}

type ListGroup = { type: 'list'; ordered: boolean; items: RichText[][] }

// Notion returns list items one by one. Group runs of them into real lists.
function groupBlocks(blocks: NotionBlock[]) {
  const grouped: Array<NotionBlock | ListGroup> = []

  for (const block of blocks) {
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      const ordered = block.type === 'numbered_list_item'
      const previous = grouped[grouped.length - 1]
      if (previous?.type === 'list' && previous.ordered === ordered) {
        previous.items.push(block.text)
      } else {
        grouped.push({ type: 'list', ordered, items: [block.text] })
      }
    } else {
      grouped.push(block)
    }
  }

  return grouped
}

// Blocks render as plain HTML (headings, lists, quotes, rules, figures) and
// the surrounding .typeset sets them in the type system's prose styles.
function BlockList({ blocks }: { blocks: NotionBlock[] }) {
  // Callouts sit one step above whatever the prose sits on.
  const level = useSurface() + 1

  return (
    <>
      {groupBlocks(blocks).map((block, index) => {
        switch (block.type) {
          case 'list': {
            const List = block.ordered ? 'ol' : 'ul'
            return (
              <List key={index}>
                {block.items.map((item, i) => (
                  <li key={i}>
                    <RichTextRenderer richText={item} />
                  </li>
                ))}
              </List>
            )
          }

          case 'paragraph':
            return (
              <p key={index}>
                <RichTextRenderer richText={block.text} />
              </p>
            )

          // The page title is the h1, so Notion headings start at h2.
          case 'heading_1':
            return (
              <h2 key={index}>
                <RichTextRenderer richText={block.text} />
              </h2>
            )

          case 'heading_2':
            return (
              <h3 key={index}>
                <RichTextRenderer richText={block.text} />
              </h3>
            )

          case 'heading_3':
            return (
              <h4 key={index}>
                <RichTextRenderer richText={block.text} />
              </h4>
            )

          case 'code':
            return <NotionCode key={index} code={plainText(block.text)} language={block.language} />

          case 'quote':
            return (
              <blockquote key={index}>
                <RichTextRenderer richText={block.text} />
              </blockquote>
            )

          case 'callout':
            return (
              // The Alert only builds its icon column for an svg, so an emoji
              // icon sets the two columns itself.
              <Alert
                key={index}
                className={cn('not-typeset border-0', block.icon && 'grid-cols-[auto_1fr] gap-x-2', surfaceClasses(level))}
              >
                {block.icon && (
                  <span aria-hidden className={cn('row-span-2', typeClass('body'))}>
                    {block.icon}
                  </span>
                )}
                <AlertDescription className={cn(typeClass('body'), 'text-foreground')}>
                  <RichTextRenderer richText={block.text} />
                </AlertDescription>
              </Alert>
            )

          case 'divider':
            return <hr key={index} />

          case 'image':
            return (
              <figure key={index} className="flex flex-col gap-2">
                <img
                  src={block.url}
                  alt={block.caption || ''}
                  className="w-full rounded-lg outline outline-1 -outline-offset-1 outline-foreground/10"
                  loading="lazy"
                />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            )

          case 'bookmark':
            return (
              <p key={index} className="flex flex-col">
                <a href={block.url} target="_blank" rel="noopener noreferrer" className="break-all">
                  {block.url}
                </a>
                {block.caption && <span className={typeClass('caption')}>{block.caption}</span>}
              </p>
            )

          case 'toggle':
            return <ToggleBlock key={index} text={block.text} children={block.children} />

          default:
            return null
        }
      })}
    </>
  )
}

export function NotionRenderer({ blocks }: { blocks: NotionBlock[] }) {
  return (
    <div className="typeset">
      <BlockList blocks={blocks} />
    </div>
  )
}
