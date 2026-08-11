import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { VueWrapper } from '@vue/test-utils'
import TerminalApp from '../../app/components/terminal/TerminalApp.client.vue'
import type { ProjectRef } from '../../app/utils/terminal/types'

const projects: ProjectRef[] = [
  {
    slug: 'gameboycss',
    title: 'GameboyCSS',
    summary: 'Aplicación para mostrar una Gameboy hecha con Vue y CSS puro.',
    url: 'https://gameboycsskr.netlify.app'
  },
  {
    slug: 'cv',
    title: 'CV',
    summary: 'Currículum personal hecho con Vue.',
    url: 'https://zellokrcv.netlify.app'
  }
]

async function typeAndSubmit(wrapper: VueWrapper, command: string): Promise<void> {
  const input = wrapper.get('[data-testid="terminal-input"]')
  await input.setValue(command)
  await input.trigger('keydown.enter')
}

describe('TerminalApp.client.vue', () => {
  it('runs "ls" and shows the real (mocked) project list in output', async () => {
    const wrapper = await mountSuspended(TerminalApp, { props: { projects } })

    await typeAndSubmit(wrapper, 'ls')

    expect(wrapper.text()).toContain('gameboycss')
    expect(wrapper.text()).toContain('GameboyCSS')
    expect(wrapper.text()).toContain('cv')
    expect(wrapper.text()).toContain('CV')
  })

  it('shows an error line for an unknown command and does not throw or crash', async () => {
    const wrapper = await mountSuspended(TerminalApp, { props: { projects } })

    await expect(typeAndSubmit(wrapper, 'sudo rm -rf /')).resolves.not.toThrow()

    expect(wrapper.text()).toContain('command not found: sudo')
  })

  it('runs "help" and shows every command description', async () => {
    const wrapper = await mountSuspended(TerminalApp, { props: { projects } })

    await typeAndSubmit(wrapper, 'help')

    expect(wrapper.text()).toContain('List available projects')
    expect(wrapper.text()).toContain('List available commands')
    expect(wrapper.text()).toContain('Clear the terminal output')
  })
})
