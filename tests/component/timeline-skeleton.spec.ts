import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TimelineSkeleton from '../../app/components/about/TimelineSkeleton.vue'

describe('TimelineSkeleton.vue', () => {
  it('renders a two-column placeholder layout', () => {
    const wrapper = mount(TimelineSkeleton)

    expect(wrapper.find('[data-testid="timeline-skeleton"]').exists()).toBe(true)
    expect(wrapper.findAll('li')).toHaveLength(6)
  })
})
