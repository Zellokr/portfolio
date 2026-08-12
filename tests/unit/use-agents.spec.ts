import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const { queryCollectionMock } = vi.hoisted(() => {
  const agentsFixture = [
    { name: 'Codex', icon: '/tech/codex.svg', url: 'https://openai.com/codex/', order: 2 },
    { name: 'Claude Code', icon: '/tech/claude-code.svg', url: 'https://claude.com/claude-code', order: 1 }
  ]

  const mock = (_collection: string) => {
    const builder = {
      order: () => builder,
      all: async () => [...agentsFixture].sort((a, b) => a.order - b.order)
    }
    return builder
  }

  return { queryCollectionMock: vi.fn(mock) }
})

mockNuxtImport('queryCollection', () => queryCollectionMock)

describe('useAgents', () => {
  it('returns agents sorted by order ascending', async () => {
    const { useAgents } = await import('../../app/composables/useAgents')

    const agents = await useAgents()

    expect(agents.map(agent => agent.name)).toEqual(['Claude Code', 'Codex'])
  })

  it('includes the icon path for each agent', async () => {
    const { useAgents } = await import('../../app/composables/useAgents')

    const agents = await useAgents()

    expect(agents.find(agent => agent.name === 'Claude Code')?.icon).toBe('/tech/claude-code.svg')
  })
})
