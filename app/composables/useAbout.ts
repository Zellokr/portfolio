import type { z } from 'zod'
import type { aboutSchema } from '../../content.schema'

export type About = z.infer<typeof aboutSchema>

/**
 * Returns the single `about` document. Mirrors `useProjects`/`useProject`
 * in shape: a plain async function wrapping `queryCollection`, left to the
 * caller to `await` directly or wrap with `useAsyncData` as needed.
 */
export async function useAbout(): Promise<About | null> {
  const about = await queryCollection('about').first()
  return (about as About | null) ?? null
}
