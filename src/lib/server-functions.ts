import { createServerFn } from '@tanstack/react-start'
import {
  getPosts as getNotionPosts,
  getProjects as getNotionProjects,
  getPostBySlug as getNotionPostBySlug,
  getProjectBySlug as getNotionProjectBySlug,
  isNotionConfigured,
} from './notion'
import { samplePosts, sampleProjects } from './sample-data'
import type { Post, Project } from './types'

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

export const fetchPostBySlug = createServerFn({
  method: 'GET',
}).handler(async (slug: string) => {
  if (isNotionConfigured()) {
    return await getNotionPostBySlug(slug)
  }
  return samplePosts.find((p) => p.slug === slug) || null
})

export const fetchProjectBySlug = createServerFn({
  method: 'GET',
}).handler(async (slug: string) => {
  if (isNotionConfigured()) {
    return await getNotionProjectBySlug(slug)
  }
  return sampleProjects.find((p) => p.slug === slug) || null
})

export const checkNotionStatus = createServerFn({
  method: 'GET',
}).handler(async () => {
  return {
    configured: isNotionConfigured(),
    usingFallback: !isNotionConfigured(),
  }
})
