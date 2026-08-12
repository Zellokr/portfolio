import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HobbiesSection from '../../app/components/about/HobbiesSection.vue'
import type { Hobby } from '../../app/composables/useHobbies'

const hobbies: Hobby[] = [
  { name: 'Videojuegos', icon: '🎮', description: 'Gaming competitivo.', order: 1 }
]

describe('HobbiesSection.vue', () => {
  it('shows the skeleton while pending', () => {
    const wrapper = mount(HobbiesSection, { props: { hobbies: [], pending: true } })

    expect(wrapper.find('[data-testid="hobby-grid-skeleton"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Videojuegos')
  })

  it('shows the real hobbies once loaded', () => {
    const wrapper = mount(HobbiesSection, { props: { hobbies, pending: false } })

    expect(wrapper.find('[data-testid="hobby-grid-skeleton"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Videojuegos')
    expect(wrapper.text()).toContain('Gaming competitivo.')
  })
})
