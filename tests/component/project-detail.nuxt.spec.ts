import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'

const { queryCollectionMock, routeSlug } = vi.hoisted(() => {
  const aboutFixture = {
    name: 'Kristian Martinez',
    headline: 'Frontend Engineer',
    bio: 'I build accessible, well-tested web applications.',
    email: 'kristian@example.com',
    socials: []
  }

  const projectsFixture = [
    {
      title: 'GameboyCSS',
      slug: 'gameboycss',
      summary: 'Aplicación para mostrar una Gameboy hecha con Vue y CSS puro.',
      description: 'Aplicación para mostrar una Gameboy hecha con Vue y CSS puro, sin librerías de diseño externas.',
      stack: ['Vue', 'CSS'],
      url: 'https://gameboycsskr.netlify.app',
      image: '/gameboycss.webp',
      order: 1,
      featured: false
    }
  ]

  const mock = (collection: string) => {
    let filterSlug: string | null = null
    const builder = {
      order: () => builder,
      where: (field: string, _op: string, value: string) => {
        if (field === 'slug') filterSlug = value
        return builder
      },
      all: async () => (collection === 'projects' ? [...projectsFixture] : []),
      first: async () => {
        if (collection === 'about') return aboutFixture
        if (collection === 'projects') return projectsFixture.find(project => project.slug === filterSlug) ?? null
        return null
      }
    }
    return builder
  }

  return { queryCollectionMock: vi.fn(mock), routeSlug: { value: 'gameboycss' } }
})

mockNuxtImport('queryCollection', () => queryCollectionMock)
mockNuxtImport('useRoute', () => () => ({ params: { slug: routeSlug.value } }))

describe('pages/proyectos/[slug].vue', () => {
  it('renders the project detail from real content data', async () => {
    routeSlug.value = 'gameboycss'
    const ProjectPage = await import('../../app/pages/proyectos/[slug].vue')
    const wrapper = await mountSuspended(ProjectPage.default)

    expect(wrapper.text()).toContain('GameboyCSS')
    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.findAll('a[href="https://gameboycsskr.netlify.app"][target="_blank"]').length).toBeGreaterThan(0)
    expect(wrapper.find('a[href="/proyectos"]').exists()).toBe(true)
  })
})
