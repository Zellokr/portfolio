import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'

const { queryCollectionMock } = vi.hoisted(() => {
  const aboutFixture = {
    name: 'Kristian Martinez',
    headline: 'Frontend Engineer',
    bio: 'I build accessible, well-tested web applications.',
    email: 'kristian@example.com',
    socials: [{ label: 'GitHub', url: 'https://github.com/example' }]
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
    const builder = {
      order: () => builder,
      all: async () => (collection === 'projects' ? [...projectsFixture] : []),
      first: async () => (collection === 'about' ? aboutFixture : null)
    }
    return builder
  }

  return { queryCollectionMock: vi.fn(mock) }
})

mockNuxtImport('queryCollection', () => queryCollectionMock)

describe('pages/proyectos.vue', () => {
  it('renders the projects grid from real content data', async () => {
    const ProyectosPage = await import('../../app/pages/proyectos.vue')
    const wrapper = await mountSuspended(ProyectosPage.default)

    // Projects — real migrated content (GameboyCSS)
    expect(wrapper.text()).toContain('GameboyCSS')
    expect(wrapper.findAll('a[href="https://gameboycsskr.netlify.app"][target="_blank"]').length).toBeGreaterThan(0)

    // Footer — socials from useAbout()
    expect(wrapper.findAll('a[href="https://github.com/example"]').length).toBeGreaterThan(0)
  })
})
