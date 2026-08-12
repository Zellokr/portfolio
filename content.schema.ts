import { z } from '@nuxt/content'

/**
 * Plain zod schemas kept separate from `content.config.ts`.
 *
 * `defineCollection()` (called from `content.config.ts`) eagerly converts the
 * schema to JSON Schema and requires Nuxt Content's internal validator
 * context to be initialized, which only happens when the config is loaded
 * through Nuxt's own content module pipeline. Importing `content.config.ts`
 * directly (e.g. from a plain unit test) throws before that context exists.
 * Keeping the raw zod schemas here lets them be unit-tested in isolation.
 */
export const projectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  description: z.string(),
  stack: z.array(z.string()),
  url: z.string().url(),
  image: z.string().optional(),
  repo: z.string().url().optional(),
  order: z.number().default(0),
  featured: z.boolean().default(false)
})

export const aboutSchema = z.object({
  name: z.string(),
  headline: z.string(),
  bio: z.string(),
  email: z.string(),
  location: z.string().optional(),
  socials: z.array(z.object({ label: z.string(), url: z.string().url() })).default([])
})

export const timelineEntrySchema = z.object({
  title: z.string(),
  organization: z.string(),
  period: z.string(),
  category: z.enum(['experience', 'education']),
  description: z.string().optional(),
  url: z.string().url().optional(),
  order: z.number().default(0)
})

export const technologySchema = z.object({
  name: z.string(),
  icon: z.string(),
  url: z.string().url(),
  order: z.number().default(0)
})

export const agentSchema = z.object({
  name: z.string(),
  icon: z.string(),
  url: z.string().url(),
  order: z.number().default(0)
})

export const hobbySchema = z.object({
  name: z.string(),
  icon: z.string(),
  description: z.string(),
  order: z.number().default(0)
})
