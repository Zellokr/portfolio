import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AgentStackSection from '../../app/components/about/AgentStackSection.vue'
import type { Agent } from '../../app/composables/useAgents'

const agents: Agent[] = [
  { name: 'Claude Code', icon: '/tech/claude-code.svg', url: 'https://claude.com/claude-code', order: 1 }
]

describe('AgentStackSection.vue', () => {
  it('shows the skeleton while pending', () => {
    const wrapper = mount(AgentStackSection, { props: { agents: [], pending: true } })

    expect(wrapper.find('[data-testid="tech-grid-skeleton"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Claude Code')
  })

  it('shows the real agents once loaded', () => {
    const wrapper = mount(AgentStackSection, { props: { agents, pending: false } })

    expect(wrapper.find('[data-testid="tech-grid-skeleton"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Claude Code')
  })
})
