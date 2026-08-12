import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const { queryCollectionMock } = vi.hoisted(() => {
  const technologiesFixture = [
    { name: 'Vue', icon: '/tech/vue.svg', order: 2 },
    { name: 'Nuxt', icon: '/tech/nuxt.svg', order: 1 }
  ]

  const mock = (_collection: string) => {
    const builder = {
      order: () => builder,
      all: async () => [...technologiesFixture].sort((a, b) => a.order - b.order)
    }
    return builder
  }

  return { queryCollectionMock: vi.fn(mock) }
})

mockNuxtImport('queryCollection', () => queryCollectionMock)

describe('useTechnologies', () => {
  it('returns technologies sorted by order ascending', async () => {
    const { useTechnologies } = await import('../../app/composables/useTechnologies')

    const technologies = await useTechnologies()

    expect(technologies.map(tech => tech.name)).toEqual(['Nuxt', 'Vue'])
  })

  it('includes the icon path for each technology', async () => {
    const { useTechnologies } = await import('../../app/composables/useTechnologies')

    const technologies = await useTechnologies()

    expect(technologies.find(tech => tech.name === 'Nuxt')?.icon).toBe('/tech/nuxt.svg')
  })
})
