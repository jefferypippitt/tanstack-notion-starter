import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { NotionBlock, RichText } from '../lib/types'
import { useState } from 'react'

function RichTextRenderer({ richText }: { richText: RichText[] }) {
  return (
    <>
      {richText.map((text, i) => {
        let element = <span key={i}>{text.text}</span>

        if (text.bold) element = <strong>{element}</strong>
        if (text.italic) element = <em>{element}</em>
        if (text.code) element = <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-sm">{element}</code>
        if (text.strikethrough) element = <s>{element}</s>
        if (text.underline) element = <u>{element}</u>
        if (text.href) {
          element = (
            <a
              href={text.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--lagoon-deep)] hover:underline"
            >
              {element}
            </a>
          )
        }

        return element
      })}
    </>
  )
}

function ToggleBlock({ text, children }: { text: RichText[]; children: NotionBlock[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden my-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="font-medium">
          <RichTextRenderer richText={text} />
        </span>
      </button>
      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <NotionRenderer blocks={children} />
        </div>
      )}
    </div>
  )
}

export function NotionRenderer({ blocks }: { blocks: NotionBlock[] }) {
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark')

  return (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={index} className="my-4 leading-relaxed">
                <RichTextRenderer richText={block.text} />
              </p>
            )

          case 'heading_1':
            return (
              <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
                <RichTextRenderer richText={block.text} />
              </h1>
            )

          case 'heading_2':
            return (
              <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
                <RichTextRenderer richText={block.text} />
              </h2>
            )

          case 'heading_3':
            return (
              <h3 key={index} className="text-xl font-bold mt-5 mb-2">
                <RichTextRenderer richText={block.text} />
              </h3>
            )

          case 'bulleted_list_item':
            return (
              <li key={index} className="ml-6 list-disc my-2">
                <RichTextRenderer richText={block.text} />
              </li>
            )

          case 'numbered_list_item':
            return (
              <li key={index} className="ml-6 list-decimal my-2">
                <RichTextRenderer richText={block.text} />
              </li>
            )

          case 'code':
            const codeText = block.text.map((t) => t.text).join('')
            return (
              <div key={index} className="my-6 rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language={block.language}
                  style={isDarkMode ? vscDarkPlus : vs}
                  customStyle={{
                    margin: 0,
                    padding: '1.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  {codeText}
                </SyntaxHighlighter>
              </div>
            )

          case 'quote':
            return (
              <blockquote
                key={index}
                className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300"
              >
                <RichTextRenderer richText={block.text} />
              </blockquote>
            )

          case 'callout':
            return (
              <div
                key={index}
                className="flex gap-3 p-4 my-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
              >
                {block.icon && <span className="text-2xl">{block.icon}</span>}
                <div className="flex-1">
                  <RichTextRenderer richText={block.text} />
                </div>
              </div>
            )

          case 'divider':
            return <hr key={index} className="my-8 border-gray-200 dark:border-gray-700" />

          case 'image':
            return (
              <figure key={index} className="my-6">
                <img
                  src={block.url}
                  alt={block.caption || ''}
                  className="rounded-lg w-full"
                  loading="lazy"
                />
                {block.caption && (
                  <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            )

          case 'bookmark':
            return (
              <a
                key={index}
                href={block.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 my-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  <span className="text-[var(--lagoon-deep)] hover:underline">{block.url}</span>
                </div>
                {block.caption && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{block.caption}</p>}
              </a>
            )

          case 'toggle':
            return <ToggleBlock key={index} text={block.text} children={block.children} />

          default:
            return null
        }
      })}
    </div>
  )
}
