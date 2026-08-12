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

/**
 * Shared `useAsyncData` wrapper around `useAbout()`, keyed as `"about"`.
 * The default layout and any page that also needs `about` data (for its
 * own SEO meta or content) should call this instead of writing their own
 * `useAsyncData("about", ...)` — sharing this exact composable, rather
 * than duplicating an equivalent-but-distinct handler closure per call
 * site, is what lets Nuxt dedupe the fetch without an
 * "incompatible options" dev warning.
 */
export function useSiteAbout() {
  return useAsyncData('about', () => useAbout())
}
