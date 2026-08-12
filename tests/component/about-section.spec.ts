import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutSection from '../../app/components/about/AboutSection.vue'
import type { About } from '../../app/composables/useAbout'

const about: About = {
  name: 'Kristian Martínez',
  headline: 'Frontend Engineer',
  bio: 'Ingeniero informático.',
  email: 'kristian@example.com',
  socials: []
}

describe('AboutSection.vue', () => {
  it('shows the skeleton while pending', () => {
    const wrapper = mount(AboutSection, { props: { about: null, pending: true } })

    expect(wrapper.find('[data-testid="about-section-skeleton"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Kristian Martínez')
  })

  it('shows the real bio once loaded', () => {
    const wrapper = mount(AboutSection, { props: { about, pending: false } })

    expect(wrapper.find('[data-testid="about-section-skeleton"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Kristian Martínez')
    expect(wrapper.text()).toContain('Frontend Engineer')
  })
})
