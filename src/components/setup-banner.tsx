export function SetupBanner() {
  return (
    <div className="mb-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-2">
            Using Sample Content
          </h3>
          <p className="text-yellow-800 dark:text-yellow-200 mb-3">
            You're seeing sample blog posts and projects. To display your own content from Notion:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-200 mb-3">
            <li>Create a Notion integration at notion.so/my-integrations</li>
            <li>Duplicate the provided database template</li>
            <li>Share your database with the integration</li>
            <li>Add your integration token and database ID to .env</li>
          </ol>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            See the <a href="https://github.com/yourusername/your-repo#readme" className="underline font-medium">README</a> for detailed setup instructions.
          </p>
        </div>
      </div>
    </div>
  )
}
