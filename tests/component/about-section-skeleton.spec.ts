import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutSectionSkeleton from '../../app/components/about/AboutSectionSkeleton.vue'

describe('AboutSectionSkeleton.vue', () => {
  it('renders a placeholder block', () => {
    const wrapper = mount(AboutSectionSkeleton)

    expect(wrapper.find('[data-testid="about-section-skeleton"]').exists()).toBe(true)
  })
})
