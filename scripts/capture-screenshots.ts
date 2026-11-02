import { chromium } from 'playwright'
import { join } from 'path'

async function captureScreenshots() {
  const browser = await chromium.launch({
    executablePath: '/usr/local/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  
  const artifactsDir = '/opt/cursor/artifacts'
  const baseUrl = 'http://localhost:4173'
  
  // Light mode screenshots
  const lightContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    colorScheme: 'light',
  })
  const lightPage = await lightContext.newPage()
  
  // Home - Light
  await lightPage.goto(baseUrl)
  await lightPage.waitForLoadState('networkidle')
  await lightPage.screenshot({ path: join(artifactsDir, 'home-light.png'), fullPage: true })
  console.log('✓ Captured home-light.png')
  
  // Blog list
  await lightPage.goto(`${baseUrl}/blog`)
  await lightPage.waitForLoadState('networkidle')
  await lightPage.screenshot({ path: join(artifactsDir, 'blog-list.png'), fullPage: true })
  console.log('✓ Captured blog-list.png')
  
  // Blog post
  await lightPage.goto(`${baseUrl}/blog/getting-started-with-tanstack-start`)
  await lightPage.waitForLoadState('networkidle')
  await lightPage.screenshot({ path: join(artifactsDir, 'blog-post.png'), fullPage: true })
  console.log('✓ Captured blog-post.png')
  
  // Projects
  await lightPage.goto(`${baseUrl}/projects`)
  await lightPage.waitForLoadState('networkidle')
  await lightPage.screenshot({ path: join(artifactsDir, 'projects.png'), fullPage: true })
  console.log('✓ Captured projects.png')
  
  await lightContext.close()
  
  // Dark mode screenshot
  const darkContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    colorScheme: 'dark',
  })
  const darkPage = await darkContext.newPage()
  
  // Home - Dark
  await darkPage.goto(baseUrl)
  await darkPage.waitForLoadState('networkidle')
  await darkPage.screenshot({ path: join(artifactsDir, 'home-dark.png'), fullPage: true })
  console.log('✓ Captured home-dark.png')
  
  await darkContext.close()
  await browser.close()
  
  console.log('\n✅ All screenshots captured successfully!')
}

captureScreenshots().catch((error) => {
  console.error('Error capturing screenshots:', error)
  process.exit(1)
})
