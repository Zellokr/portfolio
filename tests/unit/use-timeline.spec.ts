import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const { queryCollectionMock } = vi.hoisted(() => {
  const timelineFixture = [
    {
      title: 'Frontend Developer Vue.js',
      organization: 'Ezentis Tecnología SLU',
      period: 'Marzo 2022 — Actualidad',
      category: 'experience',
      description: 'Desarrollo Frontend con Vue 3.',
      order: 1
    },
    {
      title: 'Máster en Ciberseguridad e Inteligencia de Datos',
      organization: 'Universidad de La Laguna',
      period: 'Agosto 2020 — Cursando/finalizando',
      category: 'education',
      order: 1
    },
    {
      title: 'Personal investigador / Desarrollador de aplicación web (proyecto UNICRINF)',
      organization: 'Universidad de La Laguna',
      period: 'Julio 2020 — Diciembre 2021',
      category: 'experience',
      order: 2
    }
  ]

  const mock = (_collection: string) => {
    const builder = {
      order: () => builder,
      all: async () => [...timelineFixture].sort((a, b) => a.order - b.order)
    }
    return builder
  }

  return { queryCollectionMock: vi.fn(mock) }
})

mockNuxtImport('queryCollection', () => queryCollectionMock)

describe('useTimeline', () => {
  it('returns timeline entries sorted by order ascending', async () => {
    const { useTimeline } = await import('../../app/composables/useTimeline')

    const entries = await useTimeline()

    expect(entries.map(entry => entry.title)).toEqual([
      'Frontend Developer Vue.js',
      'Máster en Ciberseguridad e Inteligencia de Datos',
      'Personal investigador / Desarrollador de aplicación web (proyecto UNICRINF)'
    ])
  })

  it('includes both experience and education categories', async () => {
    const { useTimeline } = await import('../../app/composables/useTimeline')

    const entries = await useTimeline()
    const categories = new Set(entries.map(entry => entry.category))

    expect(categories).toEqual(new Set(['experience', 'education']))
  })

  it('passes through an entry description when present', async () => {
    const { useTimeline } = await import('../../app/composables/useTimeline')

    const entries = await useTimeline()
    const ezentis = entries.find(entry => entry.title === 'Frontend Developer Vue.js')

    expect(ezentis?.description).toBe('Desarrollo Frontend con Vue 3.')
  })
})
