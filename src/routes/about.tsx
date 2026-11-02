import { createFileRoute } from '@tanstack/react-router'
import { siteConfig } from '../config/site'

export const Route = createFileRoute('/about')({
  component: About,
  head: () => ({
    meta: [
      {
        title: `About - ${siteConfig.name}`,
      },
      {
        name: 'description',
        content: siteConfig.author.bio,
      },
    ],
  }),
})

function About() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <article className="max-w-3xl mx-auto">
        <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14 mb-12">
          <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />

          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--sea-ink)] mb-6">
              About Me
            </h1>
            <p className="text-lg text-[var(--sea-ink-soft)] mb-6">
              {siteConfig.author.bio}
            </p>
          </div>
        </section>

        <section className="prose prose-gray dark:prose-invert max-w-none">
          <div className="island-shell rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-[var(--sea-ink)] mb-4">What I Do</h2>
            <p className="text-[var(--sea-ink-soft)] mb-4">
              I'm passionate about building high-quality web applications with modern technologies.
              My focus is on creating performant, accessible, and user-friendly experiences.
            </p>
            <p className="text-[var(--sea-ink-soft)]">
              I work primarily with React, TypeScript, and various full-stack frameworks. I enjoy
              learning new technologies and sharing what I learn through blog posts and open-source
              projects.
            </p>
          </div>

          <div className="island-shell rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-[var(--sea-ink)] mb-4">Tech Stack</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">Frontend</h3>
                <ul className="list-disc list-inside text-[var(--sea-ink-soft)] space-y-1">
                  <li>React / Next.js / TanStack Start</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>TanStack Query</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--sea-ink)] mb-2">Backend & Tools</h3>
                <ul className="list-disc list-inside text-[var(--sea-ink-soft)] space-y-1">
                  <li>Node.js</li>
                  <li>PostgreSQL / Prisma</li>
                  <li>Git / GitHub</li>
                  <li>Vercel / Netlify</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="island-shell rounded-xl p-8">
            <h2 className="text-2xl font-bold text-[var(--sea-ink)] mb-4">Get in Touch</h2>
            <p className="text-[var(--sea-ink-soft)] mb-6">
              I'm always interested in hearing about new projects and opportunities. Feel free to
              reach out!
            </p>
            <div className="flex flex-wrap gap-4">
              {siteConfig.social.email && (
                <a
                  href={`mailto:${siteConfig.social.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgba(50,143,151,0.3)] bg-[rgba(79,184,178,0.14)] text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(79,184,178,0.24)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email Me
                </a>
              )}
              {siteConfig.social.github && (
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[rgba(23,58,64,0.2)] bg-white/50 dark:bg-gray-800/50 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:-translate-y-0.5 hover:border-[rgba(23,58,64,0.35)]"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              )}
            </div>
          </div>
        </section>
      </article>
    </main>
  )
}
