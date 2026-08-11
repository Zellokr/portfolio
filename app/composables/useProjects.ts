import type { z } from 'zod'
import type { projectSchema } from '../../content.schema'

export type Project = z.infer<typeof projectSchema>

/**
 * Returns every project in the `projects` collection, sorted by the
 * `order` field ascending. Nuxt Content queries are async, so this is a
 * plain async function rather than a wrapped `useAsyncData` composable —
 * callers decide whether to wrap it with `useAsyncData`/`await` depending
 * on context (page setup vs. arbitrary async code).
 */
export async function useProjects(): Promise<Project[]> {
  return queryCollection('projects').order('order', 'ASC').all() as Promise<Project[]>
}

/**
 * Looks up a single project by slug. Returns `null` (never throws) when no
 * project matches the given slug.
 */
export async function useProject(slug: string): Promise<Project | null> {
  const project = await queryCollection('projects').where('slug', '=', slug).first()
  return (project as Project | null) ?? null
}
