import type { z } from 'zod'
import type { agentSchema } from '../../content.schema'

export type Agent = z.infer<typeof agentSchema>

/**
 * Returns every entry in the `agents` collection, sorted by the
 * `order` field ascending.
 */
export async function useAgents(): Promise<Agent[]> {
  return queryCollection('agents').order('order', 'ASC').all() as Promise<Agent[]>
}
