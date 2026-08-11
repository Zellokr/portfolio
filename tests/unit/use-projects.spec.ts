import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const { queryCollectionMock } = vi.hoisted(() => {
  const projectsFixture = [
    {
      title: 'CV',
      slug: 'cv',
      summary: 'Currículum personal hecho con Vue.',
      description: 'Currículum personal hecho con Vue.',
      stack: ['Vue'],
      url: 'https://zellokrcv.netlify.app',
      order: 2,
      featured: false
    },
    {
      title: 'GameboyCSS',
      slug: 'gameboycss',
      summary: 'Aplicación para mostrar una Gameboy hecha con Vue y CSS puro.',
      description: 'Aplicación para mostrar una Gameboy hecha con Vue y CSS puro.',
      stack: ['Vue', 'CSS'],
      url: 'https://gameboycsskr.netlify.app',
      order: 1,
      featured: false
    }
  ]

  const mock = (_collection: string) => {
    const builder: {
      order: () => typeof builder
      where: (field: string, operator: string, value: unknown) => typeof builder
      all: () => Promise<typeof projectsFixture>
      first: () => Promise<(typeof projectsFixture)[number] | null>
      whereField?: string
      whereValue?: unknown
    } = {
      order: () => builder,
      where: (field, _operator, value) => {
        builder.whereField = field
        builder.whereValue = value
        return builder
      },
      all: async () => [...projectsFixture].sort((a, b) => a.order - b.order),
      first: async () => {
        if (builder.whereField === 'slug') {
          return projectsFixture.find(project => project.slug === builder.whereValue) ?? null
        }
        return null
      }
    }
    return builder
  }

  return { queryCollectionMock: vi.fn(mock) }
})

mockNuxtImport('queryCollection', () => queryCollectionMock)

describe('useProjects', () => {
  it('returns projects sorted by order ascending', async () => {
    const { useProjects } = await import('../../app/composables/useProjects')

    const projects = await useProjects()

    expect(projects.map(project => project.slug)).toEqual(['gameboycss', 'cv'])
  })
})

describe('useProject', () => {
  it('returns null when the slug does not exist', async () => {
    const { useProject } = await import('../../app/composables/useProjects')

    const project = await useProject('does-not-exist')

    expect(project).toBeNull()
  })

  it('returns the matching project when the slug exists', async () => {
    const { useProject } = await import('../../app/composables/useProjects')

    const project = await useProject('cv')

    expect(project).not.toBeNull()
    expect(project?.title).toBe('CV')
  })
})
