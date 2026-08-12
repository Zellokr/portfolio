import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CarViewerSkeleton from '../../app/components/about/CarViewerSkeleton.vue'

describe('CarViewerSkeleton.vue', () => {
  it('renders a fixed-height placeholder body', () => {
    const wrapper = mount(CarViewerSkeleton)

    expect(wrapper.find('[data-testid="car-viewer-skeleton"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="skeleton"]').length).toBeGreaterThan(0)
  })
})
