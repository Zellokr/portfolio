import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import CarSection from '../../app/components/about/CarSection.vue'

const observeSpy = vi.fn()
const disconnectSpy = vi.fn()

class FakeIntersectionObserver {
  observe = observeSpy
  disconnect = disconnectSpy
  unobserve = vi.fn()
  takeRecords = () => []
}

describe('CarSection.vue', () => {
  beforeEach(() => {
    observeSpy.mockClear()
    disconnectSpy.mockClear()
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the skeleton placeholder and starts observing before the section is visible', async () => {
    const wrapper = await mountSuspended(CarSection)

    expect(wrapper.text()).toContain('Mi coche')
    expect(wrapper.find('[data-testid="car-viewer-skeleton"]').exists()).toBe(true)
    expect(observeSpy).toHaveBeenCalledTimes(1)
  })
})
