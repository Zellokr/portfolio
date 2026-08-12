import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Skeleton from '../../app/components/ui/Skeleton.vue'

describe('Skeleton.vue', () => {
  it('renders a pulsing placeholder block', () => {
    const wrapper = mount(Skeleton)

    expect(wrapper.find('[data-testid="skeleton"]').exists()).toBe(true)
    expect(wrapper.classes()).toContain('animate-pulse')
  })

  it('merges passthrough classes for sizing', () => {
    const wrapper = mount(Skeleton, { attrs: { class: 'h-4 w-32' } })

    expect(wrapper.classes()).toContain('h-4')
    expect(wrapper.classes()).toContain('w-32')
    expect(wrapper.classes()).toContain('animate-pulse')
  })
})
