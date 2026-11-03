// Demo content for `pnpm setup:notion --seed`: the posts, projects, and
// profile rows the template ships with. Edit or delete them in Notion freely;
// the setup script never touches rows that already exist.
//
// Notion Starter describes this repo, and its code is trimmed from it. The
// other projects belong to a fictional developer, so they explain how things
// work and leave out results and numbers nobody measured. The posts summarize
// articles from the Next.js blog, credited and linked in each one.

// ---------- block helpers ----------
export const img = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80`
export const rt = (text, annotations, url) => ({
  type: 'text',
  text: { content: text, ...(url ? { link: { url } } : {}) },
  ...(annotations ? { annotations } : {}),
})
const toRich = (parts) => (typeof parts === 'string' ? [rt(parts)] : parts.map((p) => (typeof p === 'string' ? rt(p) : rt(p.t, p.a, p.url))))
const p = (parts) => ({ type: 'paragraph', paragraph: { rich_text: toRich(parts) } })
const h2 = (t) => ({ type: 'heading_2', heading_2: { rich_text: toRich(t) } })
const ul = (...items) => items.map((t) => ({ type: 'bulleted_list_item', bulleted_list_item: { rich_text: toRich(t) } }))
const ol = (...items) => items.map((t) => ({ type: 'numbered_list_item', numbered_list_item: { rich_text: toRich(t) } }))
const code = (language, text) => ({ type: 'code', code: { language, rich_text: [rt(text)] } })
const callout = (emoji, t) => ({ type: 'callout', callout: { icon: { type: 'emoji', emoji }, rich_text: toRich(t) } })
const image = (id, caption) => ({
  type: 'image',
  image: { type: 'external', external: { url: img(id) }, caption: caption ? [rt(caption)] : [] },
})
const bold = (t) => ({ t, a: { bold: true } })
const mono = (t) => ({ t, a: { code: true } })
const link = (t, url) => ({ t, url })

// ---------- projects ----------
export const projects = [
  {
    slug: 'notion-starter',
    title: 'Notion Starter',
    description: 'This site: a blog and portfolio that reads posts, projects, and the About page from one Notion database.',
    date: '2026-11-02',
    tags: ['TanStack', 'Notion', 'TypeScript'],
    featured: true,
    cover: '1517694712202-14dd9538aa97',
    body: [
      p('Notion Starter is the template this site runs on. Posts, projects, footer links, work history, and the About text all live in one Notion database, and the site reads them through the Notion API on each request.'),
      h2('One database, five kinds of row'),
      p('A Type column tells the rows apart:'),
      ...ul(
        [bold('Post'), ' and ', bold('Project'), ' rows are the writing and the work. Everything in the row’s page body becomes the article.'],
        [bold('Link'), ' rows become the icons in the footer. The icon comes from the URL’s domain, with a globe for anything it doesn’t recognize.'],
        [bold('Experience'), ' rows list roles on the About page, using the Date range as the period.'],
        [bold('About'), ' is a single row whose page body is the About text.'],
      ),
      p('Every kind needs Published checked before it shows up.'),
      h2('Setting it up'),
      p('Share an empty Notion page with your integration and run one command. It asks for the integration secret and the page link, and writes both to .env:'),
      code('bash', 'pnpm setup:notion --seed'),
      p('The script creates the database inside that page with every column the site reads, adds demo rows like this one, and swaps the page ID in .env for the new database’s ID. Point it at a database you already have and it only adds the columns that are missing.'),
      h2('Trade-offs'),
      p('Notion is the only backend, and there’s no build step that snapshots the content. Publishing is instant, but every page load waits on the Notion API, so the site is only as fast as Notion is that day.'),
      p('Files uploaded to Notion come back as signed URLs that expire after an hour. Covers go through a /media route that looks up a fresh link each time, but images inside a page body are linked directly, so a tab left open for an hour can lose them. Paste an external image URL when that matters.'),
    ],
  },
  {
    slug: 'pulse-analytics',
    title: 'Pulse Analytics',
    description: 'A privacy-first analytics dashboard: three screens, one question each, and no data about individual visitors.',
    date: '2026-08-14',
    tags: ['React', 'TypeScript', 'Postgres'],
    featured: true,
    cover: '1460925895917-afdab827c52f',
    body: [
      p('Pulse is a small analytics product for teams who want traffic numbers without tracking people. It sets no cookies and stores no personal data.'),
      h2('Three screens, three questions'),
      p('Each screen answers one question and leads with the answer:'),
      ...ul(
        [bold('Is traffic up?'), ' Visits this week against last week.'],
        [bold('Where did it come from?'), ' Referrers, grouped by site.'],
        [bold('Which page converts?'), ' Pages ranked by the share of visits that reach a goal.'],
      ),
      p('The detail behind each answer is one click away, not on the same screen.'),
      h2('Aggregates only'),
      p('Events are rolled up per page and per hour as they’re written. The visit itself never reaches the database, only a counter that goes up by one:'),
      code('sql', "insert into hourly_visits (page, hour, visits)\nvalues ($1, date_trunc('hour', now()), 1)\non conflict (page, hour)\ndo update set visits = hourly_visits.visits + 1;"),
      image('1551288049-bebda4e38f71', 'Early exploration of the sources view'),
      p('The catch is that the questions have to be known in advance. Pulse can’t later show which pages one visitor saw in a row, because that data was never stored.'),
    ],
  },
  {
    slug: 'wireframe-kit',
    title: 'Wireframe Kit',
    description: 'A grayscale Figma kit for sketching product flows before anyone argues about colors.',
    date: '2026-05-02',
    tags: ['Figma', 'Design Systems'],
    featured: true,
    cover: '1522542550221-31fd19575a2d',
    body: [
      p('Wireframe Kit is a Figma library of low-fidelity components: buttons, inputs, tables, navigation, and empty states, all in grayscale.'),
      h2('Rules the kit follows'),
      ...ol(
        'No brand colors and no real images. A wireframe that looks finished gets reviewed like a finished design.',
        'Everything snaps to an 8 px grid, so the spacing carries over when the flow moves to real components.',
        'Notes are components too. An annotation sits on the frame it describes and moves with it.',
      ),
      image('1581291518857-4e27b48ff24e', 'Paper sketches that became the first components'),
      p('The kit includes starter flows for onboarding, checkout, and settings, so a new project starts from a working skeleton instead of a blank canvas.'),
      p('Grayscale has a blind spot: it hides contrast problems. Color and contrast still need their own review once the visual design starts.'),
    ],
  },
  {
    slug: 'fieldnotes',
    title: 'Fieldnotes',
    description: 'An offline-first notes app for researchers working where there’s often no signal.',
    date: '2026-02-20',
    tags: ['React Native', 'SQLite', 'Sync'],
    featured: true,
    cover: '1512941937669-90a1b58e7e9c',
    body: [
      p('Fieldnotes lets researchers write notes, take photos, and tag locations with no connection, then syncs everything once they’re back online.'),
      h2('Local first'),
      p('Every write goes to a SQLite database on the device first. A sync queue replays the changes to the server when a connection comes back, so the app never waits on the network.'),
      h2('Merging per field'),
      p('Two researchers can edit the same note while offline. Merging per field instead of per note keeps both edits when they changed different fields:'),
      code('typescript', "type Change = {\n  noteId: string\n  field: 'title' | 'body' | 'tags'\n  value: string\n  updatedAt: number\n}\n\n// Last write wins per field, not per note.\nfunction merge(local: Change, remote: Change) {\n  return local.updatedAt >= remote.updatedAt ? local : remote\n}"),
      p('This isn’t a complete answer. If both people change the same field, the later timestamp wins and the other edit is lost. The timestamps also come from device clocks, which can be wrong.'),
      callout('📍', 'Location tags use GPS, which doesn’t need a data connection.'),
    ],
  },
  {
    slug: 'palette-studio',
    title: 'Palette Studio',
    description: 'Builds a full color scale from one brand color in OKLCH and checks text contrast at every step.',
    date: '2025-11-08',
    tags: ['TypeScript', 'Color', 'Accessibility'],
    featured: false,
    cover: '1561070791-2526d30994b5',
    body: [
      p('Palette Studio takes one brand color and generates a scale from 50 to 950. For each step, it shows which other steps pass WCAG contrast as text on top of it.'),
      h2('Why OKLCH'),
      p(['OKLCH’s lightness channel follows how bright a color looks, so evenly spaced ', mono('L'), ' values look evenly spaced. HSL doesn’t: a yellow and a blue at the same ', mono('l'), ' look nothing alike.']),
      code('css', ':root {\n  --brand-500: oklch(0.62 0.19 255);\n  --brand-600: oklch(0.54 0.19 255);\n  --brand-700: oklch(0.46 0.17 255);\n}'),
      p('Exports go to CSS variables, a Tailwind theme, or a design tokens JSON file.'),
      h2('Limits'),
      p('High-chroma OKLCH colors can fall outside sRGB. Browsers map them back into range on sRGB screens, so the same token can look different on a P3 display and a regular one.'),
      p('The contrast check uses the WCAG 2 formula. It’s the one accessibility audits ask for, and it’s also known to misjudge some pairs of dark colors.'),
    ],
  },
  {
    slug: 'signal-monitor',
    title: 'Signal',
    description: 'Uptime and latency monitoring from five regions, with outage alerts that wait until two regions agree.',
    date: '2025-07-19',
    tags: ['Node.js', 'WebSockets', 'Charts'],
    featured: false,
    cover: '1551288049-bebda4e38f71',
    body: [
      p('Signal checks each endpoint every 30 seconds from five regions and streams the results to a live dashboard over WebSockets.'),
      h2('When it alerts'),
      ...ul(
        'An outage alert fires only when two or more regions see the endpoint fail. One region failing on its own is usually that region’s network.',
        'Latency alerts compare against the same hour last week, not a fixed threshold, so a slow but normal Monday morning doesn’t page anyone.',
        'During quiet hours, non-critical alerts collect into a summary that goes out in the morning.',
      ),
      p('The two-region rule has a cost. An outage that starts in one region is reported a check later, up to 30 seconds after the first failure.'),
    ],
  },
  {
    slug: 'circuit-cli',
    title: 'Circuit CLI',
    description: 'A command-line tool that builds, tests, and releases TypeScript packages with ESM and CommonJS output.',
    date: '2025-04-03',
    tags: ['CLI', 'TypeScript', 'Open Source'],
    featured: false,
    cover: '1550751827-4bd374c3f58b',
    body: [
      p('Circuit wraps the steps of publishing a TypeScript package (build, type declarations, tests, changelog, release) into one tool. The defaults cover the common case, and there’s no config file until you need one.'),
      h2('What it produces'),
      ...ul(
        'ESM and CommonJS builds, each with its own type declarations',
        'Source maps',
        'A changelog generated from commit messages',
        'npm releases with provenance, published from CI',
      ),
      p('The builds are wired up with conditional exports in package.json, so each module system gets its own files and types:'),
      code('json', '"exports": {\n  ".": {\n    "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" },\n    "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }\n  }\n}'),
      p('Shipping both formats has a known catch, the dual package hazard. If an app loads the package once through import and once through require, it gets two copies, and anything that relies on a single instance (a cache, an instanceof check) stops lining up. Circuit can’t prevent that, so a package that holds state is better off shipping ESM only.'),
    ],
  },
]

// ---------- posts ----------
// Placeholder writing, so the blog has something real-looking to show. Each
// post is a short summary, in our own words, of a post on the Next.js blog
// (https://nextjs.org/blog): the original title, date, and authors, a note
// saying where it comes from, and a link to the full article. Replace them
// with your own writing; nothing else depends on them.
const NEXT_BLOG = 'https://nextjs.org/blog'

// The note at the top of every sample post.
const source = (title, slug, authors) =>
  callout('📝', [
    'Sample post: a short summary of ',
    link(title, `${NEXT_BLOG}/${slug}`),
    ` by ${authors} on the Next.js blog. Replace it with your own writing.`,
  ])

// The closing link to the original article.
const readMore = (slug) => p([link('Read the full post on the Next.js blog →', `${NEXT_BLOG}/${slug}`)])

export const posts = [
  {
    slug: 'ship-less-javascript-with-ai',
    title: 'Ship less JavaScript in Next.js with your AI agent',
    summary: 'Next.js 16.4 gives coding agents Turbopack’s module graph, so they can find the imports that drag heavy code into the first page load.',
    date: '2026-10-28',
    tags: ['Next.js', 'Performance', 'AI'],
    cover: '1633356122544-f134324a6cee',
    body: [
      source('Ship less JavaScript in Next.js with your AI agent', 'ship-less-javascript-with-ai', 'Will Binns-Smith'),
      p('Next.js 16.1 shipped the Turbopack Bundle Analyzer for people. In 16.4 the same data is available to coding agents through a skill, next-bundle-optimizer. It needs Turbopack, which has been the default bundler since Next.js 16.'),
      code('bash', 'npx skills add vercel/next.js --skill next-bundle-optimizer'),
      h2('Why lazy() isn’t always lazy'),
      p(['A component wrapped in ', mono('lazy()'), ' only stays out of the initial bundle if nothing else in that bundle imports it directly. One stray static import somewhere else and the “deferred” code loads up front anyway. That’s hard to spot by reading code, and it’s exactly what the skill goes looking for.']),
      code('typescript', "'use client'\nimport { lazy } from 'react'\n\nexport const HeavyComponentLoader = lazy(() => import('./HeavyComponent'))"),
      h2('What the agent does'),
      ...ul(
        ['Exports saved ', mono('next analyze'), ' snapshots as JSON and rebuilds the module and chunk graphs so it can query them.'],
        'Finds large clusters of connected modules, traces how they get imported, and uses a minimum cut to pick the fewest import boundaries that would defer them.',
        'Flags code that could move to Server Components, duplicate versions of large dependencies, and places where tree shaking couldn’t apply.',
      ),
      p(['By default it only reports. ', mono('/next-bundle-optimizer fix'), ' applies the changes, reruns the analysis, and compares the snapshots so you can see what each change saved.']),
      h2('Results at Vercel'),
      p('Run against v0 and vercel.com, the agent removed or deferred nearly two megabytes of compressed JavaScript across their pages. One example: an experimental code editor was loading on most v0 pages, even for people outside the experiment. Another: a shared URL helper on vercel.com was pulling an entire query engine onto the deployments page.'),
      h2('New in the analyzer'),
      ...ul(
        'A route summary that starts you at your largest client routes.',
        'Snapshots saved on every run, so you can diff bundles after a change.',
        'A filter that leaves only the code on the critical render path.',
      ),
      readMore('ship-less-javascript-with-ai'),
    ],
  },
  {
    slug: 'improving-navigation-experience-in-v0',
    title: 'Improving navigation experience in v0 with Next.js 16.4',
    summary: 'How v0 swapped loading skeletons for content that’s ready on click, using Partial Prefetching, the navigation() API, and instant() tests.',
    date: '2026-10-16',
    tags: ['Next.js', 'Caching', 'Case Study'],
    cover: '1498050108023-c5249f4df085',
    body: [
      source('Improving navigation experience in v0 with Next.js 16.4', 'improving-navigation-experience-in-v0-with-nextjs-16-4', 'Aurora Scharff'),
      p('Parts of v0 showed loading skeletons even on pages people had already opened. The goal was to make them feel like a single-page app: content prefetched before the click, and still there on the way back.'),
      h2('Partial Prefetching'),
      p(['Before, ', mono('prefetch={true}'), ' fetched the whole destination, dynamic parts included. That spent requests on pages nobody opened, and a quick click could still beat it. Partial Prefetching, added in 16.3, prefetches the reusable parts of a route and leaves the rest for the navigation. From 16.4, new apps get it by default:']),
      code('typescript', 'const nextConfig: NextConfig = {\n  cacheComponents: true,\n  partialPrefetching: true,\n}'),
      h2('A test for “instant”'),
      p(['The ', mono('instant()'), ' helper from ', mono('@next/playwright'), ' holds back anything that only arrives during navigation. A test can then check what’s on screen the moment a link is clicked. If an assertion fails, that content wasn’t prefetched.']),
      h2('Letting an agent run the loop'),
      p(['The ', mono('next-partial-prefetching-optimizer'), ' skill has an agent write a passing ', mono('instant()'), ' test for the current UI, add assertions for the UI it should have, then refactor caching and prefetching until they pass. The test stays in CI to catch regressions.']),
      h2('Deferring what can wait'),
      p(['The new ', mono('navigation()'), ' API marks cached work that should wait until the page opens. v0 used it for sections like Recent Chats on a project page: cached for return visits, but not prefetched.']),
      code('typescript', "import { navigation } from 'next/cache'\n\nasync function RecentChats({ projectId }) {\n  await navigation()\n  const chats = await loadProjectChats(projectId)\n  return <ChatList chats={chats} />\n}"),
      h2('What it cost'),
      p('After every PR had merged, total daily cost for the app was slightly lower, even though cache spend went up. Traffic changed over the same period, so the team reads that as “no more expensive”, not as a saving.'),
      readMore('improving-navigation-experience-in-v0-with-nextjs-16-4'),
    ],
  },
  {
    slug: 'next-16-4',
    title: 'Next.js 16.4',
    summary: 'Cache Components becomes the recommended model for every app, alongside agent-assisted upgrades and a round of Turbopack improvements.',
    date: '2026-10-06',
    tags: ['Next.js', 'Release'],
    cover: '1507721999472-8ed4421c4af2',
    body: [
      source('Next.js 16.4', 'next-16-4', 'the Next.js team'),
      p('Over the 16.x releases, Next.js introduced Cache Components: a model built for fast first loads on personalized pages, instant client navigations, and caching that’s opt-in and composable. 16.4 closes the gaps that kept it from being recommended everywhere. New apps from create-next-app now have it on, and it’s planned as the default in Next.js 17.'),
      h2('Cache Components in one line'),
      p([mono("'use cache'"), ' marks part of the component tree as cacheable. The post describes it as a component-level version of the Cache-Control header.']),
      h2('For agents'),
      ...ul(
        [mono('next upgrade --agent'), ' checks your version, picks a target release, and hands your agent the migration guides, codemods, and verification steps.'],
        'An experimental feedback workflow lets agents draft reports about framework errors or unclear docs, which you review before anything is sent.',
      ),
      h2('For every app'),
      ...ul(
        'Turbopack’s disk cache takes 20–25% less space.',
        'Editing a shared server module no longer updates pages you aren’t viewing.',
        'One Turbopack runtime chunk is shared across routes.',
        'Shorter CSS Module class names in production builds.',
        'React 19.3, with stable View Transitions and Fragment Refs.',
      ),
      h2('Experimental'),
      ...ul(
        'The Rust React Compiler, running inside Next.js instead of through Babel.',
        'Disk cache cleanup, lazy dynamic imports in development, and worker threads for loaders.',
      ),
      readMore('next-16-4'),
    ],
  },
  {
    slug: 'how-we-closed-1500-github-issues',
    title: 'How we closed 1,500 GitHub issues in one month',
    summary: 'A read-only research agent investigated stale reports, and maintainers reviewed its evidence to bring the backlog below 1,000.',
    date: '2026-09-04',
    tags: ['Open Source', 'AI'],
    cover: '1484417894907-623942c8ee29',
    body: [
      source('How we closed 1,500 GitHub issues in one month', 'how-we-closed-1500-github-issues', 'Marcos Hernanz'),
      p('The Next.js tracker gets around 36 new reports a week. The open backlog peaked at 3,109 in January 2025 and was still at 2,244 in August 2026, with fixed bugs and duplicates burying current regressions.'),
      h2('Why “stale” wasn’t enough'),
      p('A bot that closed issues after long inactivity helped, but inactivity can’t tell a fixed bug from a duplicate, or from a real bug nobody had looked at again. Some reports that mattered got closed.'),
      h2('An agent that researches but can’t act'),
      p('The team built a research agent called closability on eve, Vercel’s open-source agent framework. Each run gets a fresh sandbox with the repo, Node.js, Playwright, and Chromium, and works through the same steps a maintainer would:'),
      ...ol(
        'Read the thread and check which versions are still supported.',
        'Search related issues, pull requests, commits, releases, and docs.',
        'When needed, reproduce the bug on the reported version, the latest stable release, and canary.',
        'Look for evidence against its own conclusion.',
      ),
      p('It returns a confidence score, a primary reason, and the evidence behind them. Outside its sandbox it can’t comment, close, or push anything, and it ignores instructions it finds in issue text, which guards against prompt injection.'),
      code('json', '{\n  "closeConfidence": 86,\n  "primaryReason": "fixed",\n  "evidence": ["No longer reproduces on the latest canary"]\n}'),
      h2('People still make the call'),
      p(['Results went into a queue that maintainers worked through, reading the evidence behind each one. A GitHub Action let anyone reopen a closed issue within 14 days by replying ', mono('Reopen: <reason>'), '. About three weeks later, 1,462 issues were closed and the backlog was under 1,000.']),
      h2('Keeping it that way'),
      p('Every week the agent reviews up to 100 issues with no recent activity. For the clearest cases, a second agent argues for keeping the issue open, and an issue is only closed when both agree. Every code change still goes through human review.'),
      readMore('how-we-closed-1500-github-issues'),
    ],
  },
  {
    slug: 'turbopack-chunking',
    title: 'How Turbopack chunks your JavaScript',
    summary: 'One big bundle, one chunk per page, and one chunk per module each fail somewhere. Here’s how Turbopack decides which chunks to merge.',
    date: '2026-09-03',
    tags: ['Turbopack', 'Performance'],
    cover: '1586717791821-3f44a563fa4c',
    body: [
      source('How Turbopack chunks your JavaScript', 'turbopack-chunking', 'Sam Poder'),
      p('Chunking decides which code goes into which JavaScript file. Each of the obvious strategies breaks somewhere:'),
      ...ul(
        [bold('One chunk for the whole app:'), ' every later page is a cache hit, but every page ships every other page’s code.'],
        [bold('One chunk per page:'), ' nothing extra ships, but shared code like a footer downloads again on every page.'],
        [bold('One chunk per module:'), ' nothing is duplicated, but hundreds of tiny requests add overhead, and compression works worse on small files.'],
      ),
      h2('Merging inside chunk groups'),
      p('A chunk group is the set of chunks a route loads together. Turbopack only merges chunks within one group, so a merge can never add code the page wasn’t already downloading.'),
      p('Whether a merge pays off depends on the next page. If a visitor leaves after one page, merging chunks A and B saves a request. If the next page needs only A, the merged file is no use there and A downloads twice. Turbopack weighs those cases by how many groups use A, B, or both, and assumes about two thirds of visits are a single page.'),
      h2('New in Next.js 16.3'),
      ...ul(
        [mono('generateComponentChunks'), ' emits unmerged chunks next to the merged ones, so the runtime can fetch only the pieces a browser is missing.'],
        ['Options under ', mono('experimental.turbopackChunking'), ' let you tune merging to your own traffic: how much to favor the first page load, which routes matter most, and which routes are usually visited together.'],
        'Tree shaking for CommonJS modules, and one shared runtime chunk instead of one per page.',
      ),
      readMore('turbopack-chunking'),
    ],
  },
  {
    slug: 'turbopack-incremental-computation',
    title: 'Inside Turbopack: Building Faster by Building Less',
    summary: 'Turbopack records which functions read which values, so after an edit it recomputes only what actually changed.',
    date: '2026-01-20',
    tags: ['Turbopack', 'Performance'],
    cover: '1581291518857-4e27b48ff24e',
    body: [
      source('Inside Turbopack: Building Faster by Building Less', 'turbopack-incremental-computation', 'the Turbopack team'),
      p('Incremental builds are hard to get right. Caches cost memory, tracking costs CPU, and a badly placed cache can be slower than none. Turbopack was designed around caching from the start, drawing on lessons from webpack and on systems like Salsa, Parcel, and the Rust compiler’s query system.'),
      h2('Files are too coarse'),
      p('Tools like GNU Make track dependencies per file, declared by hand. A bundler’s outputs depend on its inputs many-to-many, through tree shaking and shared chunks, so Turbopack tracks dependencies automatically, down to individual function calls.'),
      h2('Value cells'),
      p(['Almost everything inside Turbopack, from a file on disk to a module’s list of exports, lives in a value cell, ', mono('Vc<…>'), '. Reading a cell records the current function as depending on it, much like signals in SolidJS. Because dependencies are only recorded on read, a function reruns only when a cell it actually read changes.']),
      h2('Marking work dirty'),
      p('When a file changes, the functions that read it are marked dirty and recomputed. If a recomputed value comes out the same, the change stops spreading there. The work is also on demand: dirty functions only rerun when something asks for their output, like a page open in the browser.'),
      h2('Answering big questions quickly'),
      p('With millions of cached results, questions like “what’s dirty under this route?” would be slow to answer by walking the graph. A layered aggregation graph summarizes regions of it, so those queries visit far fewer nodes.'),
      h2('Saved to disk'),
      p(['Since Next.js 16.1, these caches are written to disk for ', mono('next dev'), ', stable and on by default, so a restarted dev server picks up where it left off.']),
      readMore('turbopack-incremental-computation'),
    ],
  },
]

// ---------- profile ----------
// Fictional, so no real person's account is linked. No Link rows: add your own
// (Type = Link, Title = label, URL = profile) for the footer icons.
export const about = {
  title: 'About',
  body: [
    p('I’m a full-stack developer. I build web apps end to end, from the database schema to the last loading state, and I care most about how fast a page loads and whether it works for everyone who uses it.'),
    p('This text is the About row in the Notion database. Edit its page body to replace it, and add Experience rows to fill the list below.'),
  ],
}
export const experience = [
  { title: 'Senior Frontend Engineer', company: 'Acme Inc.', start: '2022-01-01', end: null },
  { title: 'Frontend Engineer', company: 'Studio Name', start: '2019-01-01', end: '2022-01-01' },
]
