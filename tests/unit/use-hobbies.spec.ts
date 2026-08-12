import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const { queryCollectionMock } = vi.hoisted(() => {
  const hobbiesFixture = [
    { name: 'Fútbol', icon: '⚽', description: 'Deporte rey.', order: 3 },
    { name: 'Videojuegos', icon: '🎮', description: 'Gaming competitivo.', order: 1 }
  ]

  const mock = (_collection: string) => {
    const builder = {
      order: () => builder,
      all: async () => [...hobbiesFixture].sort((a, b) => a.order - b.order)
    }
    return builder
  }

  return { queryCollectionMock: vi.fn(mock) }
})

mockNuxtImport('queryCollection', () => queryCollectionMock)

describe('useHobbies', () => {
  it('returns hobbies sorted by order ascending', async () => {
    const { useHobbies } = await import('../../app/composables/useHobbies')

    const hobbies = await useHobbies()

    expect(hobbies.map(hobby => hobby.name)).toEqual(['Videojuegos', 'Fútbol'])
  })

  it('includes the icon and description for each hobby', async () => {
    const { useHobbies } = await import('../../app/composables/useHobbies')

    const hobbies = await useHobbies()

    const videojuegos = hobbies.find(hobby => hobby.name === 'Videojuegos')
    expect(videojuegos?.icon).toBe('🎮')
    expect(videojuegos?.description).toBe('Gaming competitivo.')
  })
})
