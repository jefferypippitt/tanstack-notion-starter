import { createServerFn } from '@tanstack/react-start'
import {
  getPosts as getNotionPosts,
  getProjects as getNotionProjects,
  getPostBySlug as getNotionPostBySlug,
  getProjectBySlug as getNotionProjectBySlug,
  getAbout,
  getLinks,
  checkNotionSetup,
  isNotionConfigured,
} from './notion'
import { sampleAbout, sampleLinks, samplePosts, sampleProjects } from './sample-data'

export const fetchPosts = createServerFn({
  method: 'GET',
}).handler(async () => {
  if (isNotionConfigured()) {
    return await getNotionPosts()
  }
  return samplePosts
})

export const fetchProjects = createServerFn({
  method: 'GET',
}).handler(async () => {
  if (isNotionConfigured()) {
    return await getNotionProjects()
  }
  return sampleProjects
})

export const fetchPostBySlug = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    if (isNotionConfigured()) {
      return await getNotionPostBySlug(slug)
    }
    return samplePosts.find((post) => post.slug === slug) || null
  })

export const fetchProjectBySlug = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    if (isNotionConfigured()) {
      return await getNotionProjectBySlug(slug)
    }
    return sampleProjects.find((project) => project.slug === slug) || null
  })


// Null when Notion is set up and reachable; otherwise what's wrong, for the
// setup banner. Without env vars the site shows sample content instead.
export const checkNotionStatus = createServerFn({
  method: 'GET',
}).handler(async () => {
  return { problem: await checkNotionSetup() }
})

export const fetchLinks = createServerFn({ method: 'GET' }).handler(async () => {
  if (isNotionConfigured()) return await getLinks()
  return sampleLinks
})

export const fetchAbout = createServerFn({ method: 'GET' }).handler(async () => {
  if (isNotionConfigured()) return await getAbout()
  return sampleAbout
})
