import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TechGrid from '../../app/components/about/TechGrid.vue'

const technologies = [
  { name: 'Nuxt', icon: '/tech/nuxt.svg', url: 'https://nuxt.com' }
]

describe('TechGrid.vue', () => {
  it('links each tile to the official tool URL', () => {
    const wrapper = mount(TechGrid, { props: { technologies } })

    const link = wrapper.get('a[href="https://nuxt.com"]')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
    expect(link.text()).toContain('Nuxt')
  })
})
