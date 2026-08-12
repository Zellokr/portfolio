import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TechStackSection from '../../app/components/about/TechStackSection.vue'
import type { Technology } from '../../app/composables/useTechnologies'

const technologies: Technology[] = [
  { name: 'Nuxt', icon: '/tech/nuxt.svg', url: 'https://nuxt.com', order: 1 }
]

describe('TechStackSection.vue', () => {
  it('shows the skeleton while pending', () => {
    const wrapper = mount(TechStackSection, { props: { technologies: [], pending: true } })

    expect(wrapper.find('[data-testid="tech-grid-skeleton"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Nuxt')
  })

  it('shows the real technologies once loaded', () => {
    const wrapper = mount(TechStackSection, { props: { technologies, pending: false } })

    expect(wrapper.find('[data-testid="tech-grid-skeleton"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Nuxt')
  })
})
