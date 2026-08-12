import type { z } from 'zod'
import type { technologySchema } from '../../content.schema'

export type Technology = z.infer<typeof technologySchema>

/**
 * Returns every entry in the `technologies` collection, sorted by the
 * `order` field ascending.
 */
export async function useTechnologies(): Promise<Technology[]> {
  return queryCollection('technologies').order('order', 'ASC').all() as Promise<Technology[]>
}
