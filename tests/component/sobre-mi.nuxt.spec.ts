import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'

const { queryCollectionMock } = vi.hoisted(() => {
  const aboutFixture = {
    name: 'Kristian Martinez',
    headline: 'Frontend Engineer',
    bio: 'I build accessible, well-tested web applications.',
    email: 'kristian@example.com',
    location: 'Islas Canarias',
    socials: [{ label: 'GitHub', url: 'https://github.com/example' }]
  }

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
      order: 2
    },
    {
      title: 'Vue.js Developer Level I',
      organization: 'Vue School / certificates.dev',
      period: 'Septiembre 2025',
      category: 'education',
      url: 'https://certificates.dev/c/9ff10ca2-c319-4440-bded-5453ecfea5f4',
      order: 1
    }
  ]

  const technologiesFixture = [
    { name: 'Nuxt', icon: '/tech/nuxt.svg', order: 1 },
    { name: 'Vue', icon: '/tech/vue.svg', order: 2 },
    { name: 'TypeScript', icon: '/tech/typescript.svg', order: 3 },
    { name: 'Python', icon: '/tech/python.svg', order: 4 },
    { name: 'Convex', icon: '/tech/convex.svg', order: 5 },
    { name: 'Docker', icon: '/tech/docker.svg', order: 6 }
  ]

  const agentsFixture = [
    { name: 'Claude Code', icon: '/tech/claude-code.svg', order: 1 },
    { name: 'Codex', icon: '/tech/codex.svg', order: 2 },
    { name: 'Pi', icon: '/tech/pi.svg', order: 3 },
    { name: 'OpenCode', icon: '/tech/opencode.svg', order: 4 }
  ]

  const mock = (collection: string) => {
    const builder = {
      order: () => builder,
      all: async () => {
        if (collection === 'timeline') return [...timelineFixture]
        if (collection === 'technologies') return [...technologiesFixture]
        if (collection === 'agents') return [...agentsFixture]
        return []
      },
      first: async () => (collection === 'about' ? aboutFixture : null)
    }
    return builder
  }

  return { queryCollectionMock: vi.fn(mock) }
})

mockNuxtImport('queryCollection', () => queryCollectionMock)

describe('pages/sobre-mi.vue', () => {
  it('renders the bio and timeline from real content data', async () => {
    const AboutPage = await import('../../app/pages/sobre-mi.vue')
    const wrapper = await mountSuspended(AboutPage.default)

    // Bio — from useAbout()
    expect(wrapper.text()).toContain('I build accessible, well-tested web applications.')
    expect(wrapper.text()).toContain('Islas Canarias')

    // Tech stack and AI agents render in separate sections
    const techSection = wrapper.get('#tecnologias')
    const agentSection = wrapper.get('#agentes-ia')

    expect(techSection.text()).toContain('Tecnologías')
    expect(techSection.text()).toContain('Nuxt')
    expect(techSection.text()).toContain('Vue')
    expect(techSection.text()).toContain('TypeScript')
    expect(techSection.text()).toContain('Python')
    expect(techSection.text()).toContain('Convex')
    expect(techSection.text()).toContain('Docker')
    expect(techSection.text()).not.toContain('Claude Code')

    expect(agentSection.text()).toContain('Agentes de IA')
    expect(agentSection.text()).toContain('Claude Code')
    expect(agentSection.text()).toContain('Codex')
    expect(agentSection.text()).toContain('Pi')
    expect(agentSection.text()).toContain('OpenCode')
    expect(agentSection.text()).not.toContain('Nuxt')

    // Timeline — from useTimeline()
    expect(wrapper.text()).toContain('Frontend Developer Vue.js')
    expect(wrapper.text()).toContain('Ezentis Tecnología SLU')
    expect(wrapper.text()).toContain('Máster en Ciberseguridad e Inteligencia de Datos')
    expect(wrapper.text()).toContain('Desarrollo Frontend con Vue 3.')
    expect(wrapper.text()).toContain('Vue.js Developer Level I')
    expect(
      wrapper
        .findAll('a[href="https://certificates.dev/c/9ff10ca2-c319-4440-bded-5453ecfea5f4"][target="_blank"]')
        .length
    ).toBeGreaterThan(0)

    // Footer — socials from useAbout()
    expect(wrapper.findAll('a[href="https://github.com/example"]').length).toBeGreaterThan(0)
  })
})
