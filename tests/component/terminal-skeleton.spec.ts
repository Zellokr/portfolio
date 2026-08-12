import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TerminalSkeleton from '../../app/components/terminal/TerminalSkeleton.vue'

describe('TerminalSkeleton.vue', () => {
  it('renders a terminal-styled placeholder body', () => {
    const wrapper = mount(TerminalSkeleton)

    expect(wrapper.find('[data-testid="terminal-skeleton"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="skeleton"]').length).toBeGreaterThan(0)
  })
})
