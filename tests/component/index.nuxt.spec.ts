import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { clearNuxtData } from '#app'

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
      order: 1,
      featured: false
    },
    {
      title: 'CV',
      slug: 'cv',
      summary: 'Currículum personal hecho con Vue.',
      description: 'Currículum personal hecho con Vue, pensado como una alternativa interactiva a un CV tradicional en PDF.',
      stack: ['Vue'],
      url: 'https://zellokrcv.netlify.app',
      order: 2,
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
  it('renders hero, about, projects and contact sections from real content data', async () => {
    const IndexPage = await import('../../app/pages/index.vue')
    const wrapper = await mountSuspended(IndexPage.default)

    // Hero — name and headline from useAbout()
    expect(wrapper.text()).toContain('Kristian Martinez')
    expect(wrapper.text()).toContain('Frontend Engineer')

    // About — bio from useAbout()
    expect(wrapper.text()).toContain('I build accessible, well-tested web applications.')

    // Projects — real migrated content (GameboyCSS/CV)
    expect(wrapper.text()).toContain('GameboyCSS')
    expect(wrapper.text()).toContain('CV')
    expect(wrapper.findAll('a[href="/projects/gameboycss"]').length).toBeGreaterThan(0)
    expect(wrapper.findAll('a[href="/projects/cv"]').length).toBeGreaterThan(0)

    // Contact — email from useAbout()
    expect(wrapper.text()).toContain('kristian@example.com')
    expect(wrapper.findAll('a[href="https://github.com/example"]').length).toBeGreaterThan(0)

    // Projects render in the order provided by useProjects() (order: 1 before order: 2)
    const projectLinks = wrapper.findAll('a[href^="/projects/"]')
    const hrefs = projectLinks.map(link => link.attributes('href'))
    expect(hrefs.indexOf('/projects/gameboycss')).toBeLessThan(hrefs.indexOf('/projects/cv'))
  })

  it('omits the socials list when useAbout() returns no socials', async () => {
    clearNuxtData(['home-about', 'home-projects'])
    queryCollectionMock.mockImplementationOnce((collection: string) => ({
      order: () => ({ all: async () => [] }),
      all: async () => [],
      first: async () =>
        collection === 'about'
          ? {
              name: 'Kristian Martinez',
              headline: 'Frontend Engineer',
              bio: 'I build accessible, well-tested web applications.',
              email: 'kristian@example.com',
              socials: []
            }
          : null
    }))

    const IndexPage = await import('../../app/pages/index.vue')
    const wrapper = await mountSuspended(IndexPage.default)

    expect(wrapper.find('section[aria-label="Contact"] ul').exists()).toBe(false)
  })
})
