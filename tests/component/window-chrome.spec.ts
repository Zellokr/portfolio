import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import WindowChrome from '../../app/components/WindowChrome.vue'

describe('WindowChrome', () => {
  it('renders the title and the default slot content', () => {
    const wrapper = mount(WindowChrome, {
      props: { title: 'terminal' },
      slots: { default: '<p>body content</p>' }
    })

    expect(wrapper.text()).toContain('terminal')
    expect(wrapper.html()).toContain('body content')
  })

  it('renders close, minimize and maximize buttons by default and emits on click', async () => {
    const wrapper = mount(WindowChrome, { props: { title: 'window' } })

    const close = wrapper.get('[data-testid="window-chrome-close"]')
    const minimize = wrapper.get('[data-testid="window-chrome-minimize"]')
    const maximize = wrapper.get('[data-testid="window-chrome-maximize"]')

    await close.trigger('click')
    await minimize.trigger('click')
    await maximize.trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('minimize')).toHaveLength(1)
    expect(wrapper.emitted('maximize')).toHaveLength(1)
  })

  it('hides the close button when closable is false', () => {
    const wrapper = mount(WindowChrome, { props: { title: 'window', closable: false } })

    expect(wrapper.find('[data-testid="window-chrome-close"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="window-chrome-minimize"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="window-chrome-maximize"]').exists()).toBe(true)
  })

  it('renders the titlebar-extra slot when provided', () => {
    const wrapper = mount(WindowChrome, {
      props: { title: 'window' },
      slots: { 'titlebar-extra': '<span>extra</span>' }
    })

    expect(wrapper.html()).toContain('extra')
  })
})
