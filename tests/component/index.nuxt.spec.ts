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
  it('renders hero and footer sections from real content data', async () => {
    const IndexPage = await import('../../app/pages/index.vue')
    const wrapper = await mountSuspended(IndexPage.default)

    // Hero — name and headline from useAbout()
    expect(wrapper.text()).toContain('Kristian Martinez')
    expect(wrapper.text()).toContain('Frontend Engineer')

    // Hero — CV download button
    expect(wrapper.findAll('a[href="/cv.pdf"][download="Kristian-Martinez-CV.pdf"]').length).toBeGreaterThan(0)

    // Hero — CTA now links to the dedicated projects page
    expect(wrapper.findAll('a[href="/proyectos"]').length).toBeGreaterThan(0)

    // Projects are no longer rendered on the home page
    expect(wrapper.find('#proyectos').exists()).toBe(false)

    // Footer — socials from useAbout()
    expect(wrapper.findAll('a[href="https://github.com/example"]').length).toBeGreaterThan(0)
  })
})
