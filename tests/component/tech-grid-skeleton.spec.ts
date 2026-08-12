import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TechGridSkeleton from '../../app/components/about/TechGridSkeleton.vue'

describe('TechGridSkeleton.vue', () => {
  it('renders 8 tile placeholders by default', () => {
    const wrapper = mount(TechGridSkeleton)

    expect(wrapper.find('[data-testid="tech-grid-skeleton"]').exists()).toBe(true)
    expect(wrapper.element.children).toHaveLength(8)
  })

  it('renders the requested count of tile placeholders', () => {
    const wrapper = mount(TechGridSkeleton, { props: { count: 3 } })

    expect(wrapper.element.children).toHaveLength(3)
  })
})
