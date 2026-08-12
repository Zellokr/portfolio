import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ProjectGrid from '../../app/components/projects/ProjectGrid.vue'
import type { Project } from '../../app/composables/useProjects'

const projects: Project[] = [
  {
    slug: 'gameboycss',
    title: 'GameboyCSS',
    summary: 'Una Gameboy en CSS.',
    description: 'Una Gameboy en CSS puro.',
    stack: ['Vue', 'CSS'],
    url: 'https://gameboycsskr.netlify.app',
    order: 1,
    featured: false
  }
]

describe('ProjectGrid.vue', () => {
  it('shows the skeleton while pending', async () => {
    const wrapper = await mountSuspended(ProjectGrid, { props: { projects: [], pending: true } })

    expect(wrapper.find('[data-testid="project-grid-skeleton"]').exists()).toBe(true)
    expect(wrapper.find('article.group').exists()).toBe(false)
  })

  it('shows the real cards once loaded', async () => {
    const wrapper = await mountSuspended(ProjectGrid, { props: { projects, pending: false } })

    expect(wrapper.find('[data-testid="project-grid-skeleton"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('GameboyCSS')
    expect(wrapper.find('a[href="/proyectos/gameboycss"]').exists()).toBe(true)
  })
})
