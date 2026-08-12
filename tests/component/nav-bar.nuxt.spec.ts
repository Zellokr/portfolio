import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import NavBar from '../../app/components/layout/NavBar.vue'
import type { About } from '../../app/composables/useAbout'

const about: About = {
  name: 'Kristian Martínez',
  headline: 'Frontend Engineer',
  bio: 'Ingeniero informático.',
  email: 'kristian@example.com',
  socials: [{ label: 'GitHub', url: 'https://github.com/example' }]
}

describe('NavBar.vue', () => {
  it('keeps the mobile menu closed by default', async () => {
    const wrapper = await mountSuspended(NavBar, { props: { about } })

    expect(wrapper.find('[data-testid="nav-mobile-menu"]').exists()).toBe(false)
    expect(wrapper.get('[data-testid="nav-menu-toggle"]').attributes('aria-expanded')).toBe('false')
  })

  it('opens the mobile menu with the nav links and socials on toggle click', async () => {
    const wrapper = await mountSuspended(NavBar, { props: { about } })

    await wrapper.get('[data-testid="nav-menu-toggle"]').trigger('click')

    const menu = wrapper.get('[data-testid="nav-mobile-menu"]')
    expect(menu.text()).toContain('Inicio')
    expect(menu.text()).toContain('Proyectos')
    expect(menu.text()).toContain('Sobre mí')
    expect(menu.findAll('a[href="https://github.com/example"]').length).toBeGreaterThan(0)
    expect(wrapper.get('[data-testid="nav-menu-toggle"]').attributes('aria-expanded')).toBe('true')
  })

  it('closes the mobile menu when a link inside it is clicked', async () => {
    const wrapper = await mountSuspended(NavBar, { props: { about } })

    await wrapper.get('[data-testid="nav-menu-toggle"]').trigger('click')
    expect(wrapper.find('[data-testid="nav-mobile-menu"]').exists()).toBe(true)

    await wrapper.get('[data-testid="nav-mobile-menu"] a[href="/proyectos"]').trigger('click')

    expect(wrapper.find('[data-testid="nav-mobile-menu"]').exists()).toBe(false)
  })
})
