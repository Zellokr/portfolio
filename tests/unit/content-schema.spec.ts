import { describe, expect, it } from 'vitest'
import { projectSchema } from '../../content.schema'

describe('projectSchema', () => {
  it('validates real gameboycss project frontmatter', () => {
    // Mirrors content/projects/gameboycss.md frontmatter.
    const gameboycssFrontmatter = {
      title: 'GameboyCSS',
      slug: 'gameboycss',
      summary: 'Aplicación para mostrar una Gameboy hecha con Vue y CSS puro.',
      description: 'Aplicación para mostrar una Gameboy hecha con Vue y CSS puro, sin librerías de diseño externas.',
      stack: ['Vue', 'CSS'],
      url: 'https://gameboycsskr.netlify.app',
      order: 1,
      featured: false
    }

    const result = projectSchema.safeParse(gameboycssFrontmatter)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.slug).toBe('gameboycss')
      expect(result.data.stack).toEqual(['Vue', 'CSS'])
      expect(result.data.url).toBe('https://gameboycsskr.netlify.app')
    }
  })

  it('fails validation when required fields are missing', () => {
    const invalidFrontmatter = {
      title: 'GameboyCSS',
      summary: 'Aplicación para mostrar una Gameboy hecha con Vue y CSS puro.',
      description: 'Aplicación para mostrar una Gameboy hecha con Vue y CSS puro.',
      url: 'https://gameboycsskr.netlify.app'
      // missing: slug, stack
    }

    const result = projectSchema.safeParse(invalidFrontmatter)

    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map(issue => issue.path[0])
      expect(paths).toContain('slug')
      expect(paths).toContain('stack')
    }
  })
})
