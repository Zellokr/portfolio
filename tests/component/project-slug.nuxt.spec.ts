import { describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { clearNuxtData } from '#app'

const { queryCollectionMock, routeParams } = vi.hoisted(() => {
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
    }
  ]

  const routeParams: { slug: string } = { slug: 'gameboycss' }

  const mock = (_collection: string) => {
    const builder = {
      where: (_field: string, _operator: string, value: unknown) => ({
        first: async () => projectsFixture.find(project => project.slug === value) ?? null
      })
    }
    return builder
  }

  return { queryCollectionMock: vi.fn(mock), routeParams }
})

mockNuxtImport('queryCollection', () => queryCollectionMock)
mockNuxtImport('useRoute', () => () => ({ params: routeParams }))

describe('pages/projects/[slug].vue', () => {
  it('renders the project detail for a known slug', async () => {
    routeParams.slug = 'gameboycss'
    clearNuxtData()

    const ProjectPage = await import('../../app/pages/projects/[slug].vue')
    const wrapper = await mountSuspended(ProjectPage.default)

    expect(wrapper.text()).toContain('GameboyCSS')
    expect(wrapper.text()).toContain('Aplicación para mostrar una Gameboy hecha con Vue y CSS puro, sin librerías de diseño externas.')
    expect(wrapper.text()).toContain('Vue')
    expect(wrapper.text()).toContain('CSS')
    expect(wrapper.findAll('a[href="https://gameboycsskr.netlify.app"]').length).toBeGreaterThan(0)
  })

  it('throws a 404 error for an unknown slug', async () => {
    routeParams.slug = 'does-not-exist'
    clearNuxtData()

    const ProjectPage = await import('../../app/pages/projects/[slug].vue')

    await expect(mountSuspended(ProjectPage.default)).rejects.toMatchObject({
      statusCode: 404
    })
  })
})
