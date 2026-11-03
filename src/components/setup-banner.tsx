import { InfoIcon } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { NotionSetupProblem } from '@/lib/notion'
import { surfaceClasses } from '@/lib/surface-classes'
import { cn } from '@/lib/utils'

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono">{children}</code>
)

const SETUP = <Code>pnpm setup:notion</Code>

// What went wrong, and the one step that fixes it.
function explain(problem: NotionSetupProblem): { title: string; body: React.ReactNode } {
  switch (problem.code) {
    case 'missing-env':
      return {
        title: 'Showing sample content',
        body: (
          <>
            Run {SETUP} to connect Notion. It asks for your integration secret and a Notion page, creates the
            database, and writes <Code>.env</Code>. Then restart the dev server.
          </>
        ),
      }
    case 'bad-token':
      return {
        title: 'Notion rejected the API key',
        body: (
          <>
            Copy the token for your integration again into <Code>NOTION_API_KEY</Code> in <Code>.env</Code>, then
            restart the dev server.
          </>
        ),
      }
    case 'page-id':
      return {
        title: 'That ID is a page, not a database',
        body: (
          <>
            <Code>{problem.variable}</Code> points to a Notion page. Run {SETUP} to create the database inside it
            and update <Code>.env</Code>, then restart the dev server.
          </>
        ),
      }
    case 'not-shared':
      return {
        title: 'Notion can’t find the database',
        body: (
          <>
            Open the page or database in <Code>{problem.variable}</Code> in Notion, click ••• → Connections, and add
            your integration.
          </>
        ),
      }
    case 'missing-columns':
      return {
        title: 'The database is missing columns',
        body: (
          <>
            {problem.columns.join(', ')}. Run {SETUP} to add them.
          </>
        ),
      }
    case 'unreachable':
      return { title: 'Couldn’t reach Notion', body: problem.message }
  }
}

// Shown while Notion isn't set up or can't be read. It opens the page, one
// block-gap above the route's own content.
export function SetupBanner({ problem }: { problem: NotionSetupProblem }) {
  const { title, body } = explain(problem)

  return (
    <div className="mb-(--space-block)">
      <Alert className={cn('border-0', surfaceClasses(2))}>
        <InfoIcon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <p>{body}</p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
