import type { z } from 'zod'
import type { hobbySchema } from '../../content.schema'

export type Hobby = z.infer<typeof hobbySchema>

/**
 * Returns every entry in the `hobbies` collection, sorted by the
 * `order` field ascending.
 */
export async function useHobbies(): Promise<Hobby[]> {
  return queryCollection('hobbies').order('order', 'ASC').all() as Promise<Hobby[]>
}
