import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HobbyGridSkeleton from '../../app/components/about/HobbyGridSkeleton.vue'

describe('HobbyGridSkeleton.vue', () => {
  it('renders 4 tile placeholders by default', () => {
    const wrapper = mount(HobbyGridSkeleton)

    expect(wrapper.find('[data-testid="hobby-grid-skeleton"]').exists()).toBe(true)
    expect(wrapper.element.children).toHaveLength(4)
  })

  it('renders the requested count of tile placeholders', () => {
    const wrapper = mount(HobbyGridSkeleton, { props: { count: 2 } })

    expect(wrapper.element.children).toHaveLength(2)
  })
})
