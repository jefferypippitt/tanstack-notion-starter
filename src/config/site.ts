// Site-wide settings. Personal content (profile links, the About text, and
// experience) lives in Notion; see the README for the Link, Experience, and
// About row types.
export const siteConfig = {
  name: 'John Doe',
  title: 'Portfolio & Blog',
  description: 'Projects and writing on web development and design.',
  url: 'https://example.com',
  intro: 'Full-stack developer',
  author: {
    name: 'John Doe',
    role: 'Full-stack developer',
    bio: "These days I'm most interested in web frameworks, TypeScript, and developer tools.",
  },
  homepage: {
    projects: 2, // one row of project cards on the home page
    posts: 3,
  },

  links: {
    home: '/',
    blog: '/blog',
    projects: '/projects',
    about: '/about',
  },
}
