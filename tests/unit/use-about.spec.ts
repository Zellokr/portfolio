import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const { queryCollectionMock } = vi.hoisted(() => {
  const aboutFixture = {
    name: '[TODO: nombre completo]',
    headline: '[TODO: titular corto]',
    bio: '[TODO: bio corta]',
    email: '[TODO: email de contacto]',
    socials: []
  }

  const mock = (_collection: string) => {
    const builder = {
      first: async () => aboutFixture
    }
    return builder
  }

  return { queryCollectionMock: vi.fn(mock) }
})

mockNuxtImport('queryCollection', () => queryCollectionMock)

describe('useAbout', () => {
  it('returns the about document', async () => {
    const { useAbout } = await import('../../app/composables/useAbout')

    const about = await useAbout()

    expect(about?.name).toBe('[TODO: nombre completo]')
    expect(queryCollectionMock).toHaveBeenCalledWith('about')
  })
})
