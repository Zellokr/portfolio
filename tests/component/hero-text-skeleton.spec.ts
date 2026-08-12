import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroTextSkeleton from '../../app/components/hero/HeroTextSkeleton.vue'

describe('HeroTextSkeleton.vue', () => {
  it('renders a placeholder block', () => {
    const wrapper = mount(HeroTextSkeleton)

    expect(wrapper.find('[data-testid="hero-text-skeleton"]').exists()).toBe(true)
  })
})
