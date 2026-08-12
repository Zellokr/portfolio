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
      image: '/images/projects/gameboycss.webp',
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

describe('pages/index.vue', () => {
  it('renders the hero section from real content data', async () => {
    const IndexPage = await import('../../app/pages/index.vue')
    const wrapper = await mountSuspended(IndexPage.default)

    // Hero — name from useAbout()
    expect(wrapper.text()).toContain('Kristian Martinez')

    // Hero — CV download button
    expect(wrapper.findAll('a[href="/cv.pdf"][download="Kristian-Martinez-CV.pdf"]').length).toBeGreaterThan(0)

    // Projects are no longer rendered on the home page
    expect(wrapper.find('#proyectos').exists()).toBe(false)

    // NavBar/AppFooter now live in the default layout, not the page — not asserted here.
  })
})
