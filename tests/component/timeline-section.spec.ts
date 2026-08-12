import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TimelineSection from '../../app/components/about/TimelineSection.vue'
import type { TimelineEntry } from '../../app/composables/useTimeline'

const entries: TimelineEntry[] = [
  {
    title: 'Frontend Developer Vue.js',
    organization: 'Ezentis Tecnología SLU',
    period: 'Marzo 2022 — Actualidad',
    category: 'experience',
    order: 1
  }
]

describe('TimelineSection.vue', () => {
  it('shows the skeleton while pending', () => {
    const wrapper = mount(TimelineSection, { props: { entries: [], pending: true } })

    expect(wrapper.find('[data-testid="timeline-skeleton"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Frontend Developer Vue.js')
  })

  it('shows the real entries once loaded', () => {
    const wrapper = mount(TimelineSection, { props: { entries, pending: false } })

    expect(wrapper.find('[data-testid="timeline-skeleton"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Frontend Developer Vue.js')
  })
})
