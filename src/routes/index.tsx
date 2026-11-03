import { createFileRoute } from '@tanstack/react-router'
import { Intro, RecentPosts, RecentProjects } from '@/components/home'
import { fetchPosts, fetchProjects } from '@/lib/server-functions'
import { siteConfig } from '@/config/site'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const [posts, projects] = await Promise.all([fetchPosts(), fetchProjects()])

    // Both lists arrive newest first, so the most recent are at the front.
    return {
      posts: posts.slice(0, siteConfig.homepage.posts),
      projects: projects.slice(0, siteConfig.homepage.projects),
    }
  },
  head: () => ({
    meta: [
      { title: `${siteConfig.name} - ${siteConfig.title}` },
      { name: 'description', content: siteConfig.description },
      { property: 'og:title', content: `${siteConfig.name} - ${siteConfig.title}` },
      { property: 'og:description', content: siteConfig.description },
    ],
  }),
})

function Home() {
  const { posts, projects } = Route.useLoaderData()

  return (
    <div className="page-stack">
      <Intro />
      <RecentPosts posts={posts} />
      <RecentProjects projects={projects} />
    </div>
  )
}
