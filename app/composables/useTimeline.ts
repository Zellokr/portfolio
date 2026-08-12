import type { z } from 'zod'
import type { timelineEntrySchema } from '../../content.schema'

export type TimelineEntry = z.infer<typeof timelineEntrySchema>

/**
 * Returns every entry in the `timeline` collection, sorted by the `order`
 * field ascending within each category (most recent/current first).
 */
export async function useTimeline(): Promise<TimelineEntry[]> {
  return queryCollection('timeline').order('order', 'ASC').all() as Promise<TimelineEntry[]>
}
