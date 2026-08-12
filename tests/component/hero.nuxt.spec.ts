import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import HeroSection from '../../app/components/hero/HeroSection.vue'
import type { About } from '../../app/composables/useAbout'
import type { ProjectRef } from '../../app/utils/terminal/types'

const about: About = {
  name: 'Kristian Martínez',
  headline: 'Frontend Engineer',
  bio: 'Ingeniero informático.',
  email: 'kristian@example.com',
  socials: []
}

const projects: ProjectRef[] = [
  { slug: 'gameboycss', title: 'GameboyCSS', summary: 'Una Gameboy en CSS.', url: 'https://gameboycsskr.netlify.app' }
]

describe('HeroSection.vue', () => {
  it('shows the terminal by default and switches to chat on toggle', async () => {
    const wrapper = await mountSuspended(HeroSection, { props: { about, projects } })

    expect(wrapper.find('[data-testid="terminal-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="chat-input"]').exists()).toBe(false)

    const buttons = wrapper.findAll('button')
    const chatToggle = buttons.find(button => button.text() === 'Chat IA')
    await chatToggle?.trigger('click')

    expect(wrapper.find('[data-testid="terminal-input"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="chat-input"]').exists()).toBe(true)
  })
})
