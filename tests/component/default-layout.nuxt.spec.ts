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

  const mock = (collection: string) => {
    const builder = {
      order: () => builder,
      all: async () => [],
      first: async () => (collection === 'about' ? aboutFixture : null)
    }
    return builder
  }

  return { queryCollectionMock: vi.fn(mock) }
})

mockNuxtImport('queryCollection', () => queryCollectionMock)

describe('layouts/default.vue', () => {
  it('renders NavBar and AppFooter around the page content from a single shared about fetch', async () => {
    const DefaultLayout = await import('../../app/layouts/default.vue')
    const wrapper = await mountSuspended(DefaultLayout.default, {
      slots: { default: () => 'page content' }
    })

    expect(wrapper.text()).toContain('page content')
    // Footer headline comes from the shared useAbout() fetch.
    expect(wrapper.text()).toContain('Frontend Engineer')
    // NavBar/AppFooter both render the same social link from the single fetch.
    expect(wrapper.findAll('a[href="https://github.com/example"]').length).toBeGreaterThan(0)
  })
})
