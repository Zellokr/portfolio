import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectGridSkeleton from '../../app/components/projects/ProjectGridSkeleton.vue'

describe('ProjectGridSkeleton.vue', () => {
  it('renders 4 card placeholders by default', () => {
    const wrapper = mount(ProjectGridSkeleton)

    expect(wrapper.find('[data-testid="project-grid-skeleton"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="project-card-skeleton"]')).toHaveLength(4)
  })

  it('renders the requested count of card placeholders', () => {
    const wrapper = mount(ProjectGridSkeleton, { props: { count: 2 } })

    expect(wrapper.findAll('[data-testid="project-card-skeleton"]')).toHaveLength(2)
  })
})
