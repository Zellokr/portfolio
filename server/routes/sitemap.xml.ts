import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const projects = await queryCollection(event, 'projects')
    .order('order', 'ASC')
    .all() as { slug: string }[]

  const urls = [
    { loc: `${siteUrl}/`, priority: '1.0' },
    { loc: `${siteUrl}/proyectos`, priority: '0.8' },
    { loc: `${siteUrl}/sobre-mi`, priority: '0.8' },
    ...projects.map(project => ({ loc: `${siteUrl}/proyectos/${project.slug}`, priority: '0.6' }))
  ]

  const body = urls
    .map(({ loc, priority }) => `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`)
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
})
