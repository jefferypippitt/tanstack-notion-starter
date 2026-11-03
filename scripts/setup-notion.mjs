// Sets up the Notion database this template reads from.
//
//   pnpm setup:notion            create .env and the database, asking for anything missing
//   pnpm setup:notion --seed     ...and add the demo posts, projects, and profile rows
//   pnpm setup:notion --no-seed  ...and skip the question about demo rows
//
// .env is created from .env.example if it doesn't exist. Point NOTION_DATABASE_ID
// at either:
//   - an empty Notion page shared with your integration: a "Content" database is
//     created inside it, and .env is updated to the new database's ID, or
//   - an existing database: any missing columns and Type options are added.
// It never deletes or edits existing rows, so it is safe to run again.
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline'
import { Client, APIErrorCode, LogLevel, isNotionClientError } from '@notionhq/client'
import * as demo from './notion-demo-content.mjs'

const SEED_FLAG = process.argv.includes('--seed') ? true : process.argv.includes('--no-seed') ? false : undefined
const ENV_FILE = '.env'
const INTERACTIVE = process.stdin.isTTY && process.stdout.isTTY

// Stops the script with a message. It throws rather than calling process.exit,
// which crashes Node on Windows while a Notion request is still closing.
class SetupError extends Error {}
function fail(message) {
  throw new SetupError(message)
}
process.on('uncaughtException', (error) => {
  if (!(error instanceof SetupError)) throw error
  console.error(`\n✖ ${error.message}\n`)
  rl?.close()
  process.exitCode = 1
})

// ---------- prompts ----------
// Reads answers as a stream of lines, so typed-ahead or piped answers aren't lost.
let rl, lines
async function ask(question) {
  if (!rl) {
    rl = createInterface({ input: process.stdin })
    lines = rl[Symbol.asyncIterator]()
  }
  process.stdout.write(question)
  const { value, done } = await lines.next()
  if (done) fail('Setup cancelled.')
  return value.trim()
}
async function confirm(question) {
  if (!INTERACTIVE) return false
  return !/^n/i.test(await ask(`${question} (Y/n) `))
}

// ---------- .env ----------
if (!existsSync(ENV_FILE)) {
  copyFileSync('.env.example', ENV_FILE)
  console.log('✓ Created .env from .env.example')
}
let envText = readFileSync(ENV_FILE, 'utf8')
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*([A-Z_]+)\s*=\s*["']?([^"'#]*)["']?\s*(#.*)?$/))
    .filter(Boolean)
    .map((m) => [m[1], m[2].trim()]),
)
// Empty, or still .env.example's placeholder ("your_..._here").
const unset = (value) => !value || /your_.*_here$/.test(value)

function setEnv(name, value) {
  const line = new RegExp(`^(\\s*${name}\\s*=)[^\\r\\n]*`, 'm')
  envText = line.test(envText)
    ? envText.replace(line, (_, prefix) => prefix + value)
    : `${envText.trimEnd()}\n${name}=${value}\n`
  writeFileSync(ENV_FILE, envText)
  env[name] = value
}

// Accepts a full Notion URL as well as a bare ID.
const notionId = (value) => value.match(/[0-9a-f]{32}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0]

if (unset(env.NOTION_API_KEY)) {
  if (!INTERACTIVE) fail('NOTION_API_KEY is empty in .env. Create an integration at https://www.notion.so/my-integrations and paste its token.')
  console.log('\n1. Create an integration at https://www.notion.so/my-integrations and copy its secret.')
  let key = ''
  while (!key) key = await ask('   Notion integration secret: ')
  setEnv('NOTION_API_KEY', key)
}

if (unset(env.NOTION_DATABASE_ID)) {
  const how = 'Create an empty Notion page, click ••• → Connections, and add your integration.'
  if (!INTERACTIVE) fail(`NOTION_DATABASE_ID is empty in .env. ${how} Then set it to the page's link or ID.`)
  console.log(`\n2. ${how}`)
  let id
  while (!id) {
    const answer = await ask('   Paste the page link: ')
    id = notionId(answer)
    if (answer && !id) console.log("   That doesn't look like a Notion page link. Copy it from Share → Copy link.")
  }
  setEnv('NOTION_DATABASE_ID', id.replace(/-/g, ''))
  console.log('')
}

const target = notionId(env.NOTION_DATABASE_ID)
if (!target) fail(`NOTION_DATABASE_ID doesn't look like a Notion ID: "${env.NOTION_DATABASE_ID}"`)

// Notion's own warnings repeat the errors this script explains.
const notion = new Client({ auth: env.NOTION_API_KEY, logLevel: LogLevel.ERROR })
const { rt, img } = demo

// ---------- schema: the columns src/lib/notion.ts reads ----------
const TYPE_OPTIONS = [
  { name: 'Post', color: 'blue' },
  { name: 'Project', color: 'green' },
  { name: 'Link', color: 'gray' },
  { name: 'Experience', color: 'orange' },
  { name: 'About', color: 'purple' },
]
const SCHEMA = {
  Title: { title: {} },
  Type: { select: { options: TYPE_OPTIONS } },
  Slug: { rich_text: {} },
  Published: { checkbox: {} },
  Featured: { checkbox: {} },
  Date: { date: {} },
  Tags: { multi_select: {} },
  Summary: { rich_text: {} },
  Description: { rich_text: {} },
  Cover: { files: {} },
  'Cover Video': { files: {} },
  'Repo URL': { url: {} },
  'Live URL': { url: {} },
  URL: { url: {} },
  Company: { rich_text: {} },
}

const plain = (prop) => (prop?.title ?? prop?.rich_text ?? []).map((t) => t.plain_text).join('')

// Turns Notion's errors into the step that fixes them.
async function call(what, fn) {
  try {
    return await fn()
  } catch (error) {
    if (!isNotionClientError(error)) throw error
    if (error.code === APIErrorCode.Unauthorized) {
      // Clear it so the next run asks again.
      setEnv('NOTION_API_KEY', '')
      fail('Notion rejected the integration secret. Run `pnpm setup:notion` again and paste it from https://www.notion.so/my-integrations.')
    }
    if (error.code === APIErrorCode.ObjectNotFound) {
      fail(`Notion can't find ${what}. Open the page in Notion, click ••• → Connections, and add your integration.`)
    }
    fail(`${what}: ${error.message}`)
  }
}

// ---------- the database ----------
async function resolveDatabase() {
  try {
    const db = await notion.databases.retrieve({ database_id: target })
    console.log(`✓ Found database "${plain({ title: db.title })}"`)
    return { databaseId: db.id, dataSourceId: db.data_sources[0].id, created: false }
  } catch (error) {
    // "This is a page" or "not found" fall through to the page lookup, which
    // reports not-found with the fix; anything else is reported here.
    const pageOrMissing = isNotionClientError(error) && [APIErrorCode.ValidationError, APIErrorCode.ObjectNotFound].includes(error.code)
    if (!pageOrMissing) await call('the database in NOTION_DATABASE_ID', () => Promise.reject(error))
  }

  const page = await call('the page in NOTION_DATABASE_ID', () => notion.pages.retrieve({ page_id: target }))
  const pageTitle = plain(Object.values(page.properties).find((prop) => prop.type === 'title'))
  const db = await call('the page', () =>
    notion.databases.create({
      parent: { type: 'page_id', page_id: target },
      title: [rt('Content')],
      initial_data_source: { properties: SCHEMA },
    }),
  )
  console.log(`✓ Created database "Content" inside "${pageTitle}"`)
  return { databaseId: db.id, dataSourceId: db.data_sources[0].id, created: true }
}

// Adds missing columns and Type options to a database made by hand.
async function completeSchema(dataSourceId) {
  const ds = await call('the database', () => notion.dataSources.retrieve({ data_source_id: dataSourceId }))
  const update = {}

  const [titleName] = Object.entries(ds.properties).find(([, prop]) => prop.type === 'title') ?? []
  if (titleName && titleName !== 'Title') update[titleName] = { name: 'Title' }

  for (const [name, config] of Object.entries(SCHEMA)) {
    if (name === 'Title') continue
    const current = ds.properties[name]
    if (!current) {
      update[name] = config
    } else if (name === 'Type' && current.type === 'select') {
      const have = new Set(current.select.options.map((option) => option.name))
      const missing = TYPE_OPTIONS.filter((option) => !have.has(option.name))
      if (missing.length) {
        update.Type = { select: { options: [...current.select.options.map(({ name, color }) => ({ name, color })), ...missing] } }
      }
    } else if (current.type !== Object.keys(config)[0]) {
      console.warn(`! Column "${name}" is ${current.type}, expected ${Object.keys(config)[0]}. Change its type in Notion.`)
    }
  }

  const names = Object.keys(update)
  if (!names.length) return console.log('✓ All columns present')
  await call('the database', () => notion.dataSources.update({ data_source_id: dataSourceId, properties: update }))
  console.log(`✓ Added or renamed columns: ${names.map((name) => update[name].name ?? name).join(', ')}`)
}

// ---------- demo rows ----------
async function seed(dataSourceId) {
  const existing = new Set()
  let cursor
  do {
    const res = await notion.dataSources.query({ data_source_id: dataSourceId, start_cursor: cursor })
    for (const page of res.results) {
      existing.add(`${page.properties.Type?.select?.name}:${plain(page.properties.Slug) || plain(page.properties.Title)}`)
    }
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)

  let created = 0
  async function createRow(key, properties, extra = {}) {
    if (existing.has(key)) return
    await notion.pages.create({
      parent: { type: 'data_source_id', data_source_id: dataSourceId },
      properties: { Published: { checkbox: true }, ...properties },
      ...extra,
    })
    created++
    console.log(`  + ${key}`)
  }

  const cover = (id) => ({ type: 'external', external: { url: img(id) } })
  const coverFile = (id) => ({ files: [{ name: 'cover', type: 'external', external: { url: img(id) } }] })

  for (const [type, items] of [['Project', demo.projects], ['Post', demo.posts]]) {
    for (const item of items) {
      await createRow(
        `${type}:${item.slug}`,
        {
          Title: { title: [rt(item.title)] },
          Slug: { rich_text: [rt(item.slug)] },
          Type: { select: { name: type } },
          Date: { date: { start: item.date } },
          Tags: { multi_select: item.tags.map((name) => ({ name })) },
          Cover: coverFile(item.cover),
          ...(type === 'Post'
            ? { Summary: { rich_text: [rt(item.summary)] } }
            : { Description: { rich_text: [rt(item.description)] }, Featured: { checkbox: item.featured } }),
        },
        { cover: cover(item.cover), children: item.body },
      )
    }
  }

  await createRow(
    `About:${demo.about.title}`,
    { Title: { title: [rt(demo.about.title)] }, Type: { select: { name: 'About' } } },
    { children: demo.about.body },
  )
  for (const role of demo.experience) {
    await createRow(`Experience:${role.title}`, {
      Title: { title: [rt(role.title)] },
      Type: { select: { name: 'Experience' } },
      Company: { rich_text: [rt(role.company)] },
      Date: { date: { start: role.start, end: role.end } },
    })
  }

  console.log(created ? `✓ Added ${created} demo rows` : '✓ Demo rows already present')
}

// ---------- run ----------
const db = await resolveDatabase()
if (db.created) {
  const id = db.databaseId.replace(/-/g, '')
  setEnv('NOTION_DATABASE_ID', id)
  console.log(`✓ Set NOTION_DATABASE_ID in .env to the new database (${id})`)
} else {
  await completeSchema(db.dataSourceId)
}

// Ask about demo rows only for a new database; an existing one already has content.
const SEED = SEED_FLAG ?? (db.created && (await confirm('\nAdd demo posts, projects, and an About page to start from?')))
if (SEED) await seed(db.dataSourceId)
rl?.close()

console.log(`\nDone. Start the site with \`pnpm dev\`, then edit the content in Notion.`)
if (!SEED) console.log('Add the demo content any time with `pnpm setup:notion --seed`.')
console.log('Add your own profile links as rows with Type = Link (Title = label, URL = profile).\n')
