import { describe, expect, it } from 'vitest'
import { agentSchema, hobbySchema, projectSchema, technologySchema } from '../../content.schema'

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
      image: '/gameboycss.webp',
      order: 1,
      featured: false
    }

    const result = projectSchema.safeParse(gameboycssFrontmatter)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.slug).toBe('gameboycss')
      expect(result.data.stack).toEqual(['Vue', 'CSS'])
      expect(result.data.url).toBe('https://gameboycsskr.netlify.app')
      expect(result.data.image).toBe('/gameboycss.webp')
    }
  })

  it('accepts frontmatter without an image (falls back to initials in the UI)', () => {
    const frontmatterWithoutImage = {
      title: 'GameboyCSS',
      slug: 'gameboycss',
      summary: 'Aplicación para mostrar una Gameboy hecha con Vue y CSS puro.',
      description: 'Aplicación para mostrar una Gameboy hecha con Vue y CSS puro.',
      stack: ['Vue', 'CSS'],
      url: 'https://gameboycsskr.netlify.app',
      order: 1,
      featured: false
    }

    const result = projectSchema.safeParse(frontmatterWithoutImage)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.image).toBeUndefined()
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

describe('technologySchema', () => {
  it('validates real technology frontmatter', () => {
    // Mirrors content/technologies/nuxt.md frontmatter.
    const nuxtFrontmatter = {
      name: 'Nuxt',
      icon: '/tech/nuxt.svg',
      url: 'https://nuxt.com',
      order: 1
    }

    const result = technologySchema.safeParse(nuxtFrontmatter)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Nuxt')
      expect(result.data.icon).toBe('/tech/nuxt.svg')
    }
  })

  it('fails validation when required fields are missing', () => {
    const result = technologySchema.safeParse({ name: 'Nuxt' })

    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map(issue => issue.path[0])
      expect(paths).toContain('icon')
    }
  })
})

describe('agentSchema', () => {
  it('validates real agent frontmatter', () => {
    // Mirrors content/agents/claude-code.md frontmatter.
    const claudeCodeFrontmatter = {
      name: 'Claude Code',
      icon: '/tech/claude-code.svg',
      url: 'https://claude.com/claude-code',
      order: 1
    }

    const result = agentSchema.safeParse(claudeCodeFrontmatter)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Claude Code')
      expect(result.data.icon).toBe('/tech/claude-code.svg')
    }
  })

  it('fails validation when required fields are missing', () => {
    const result = agentSchema.safeParse({ name: 'Claude Code' })

    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map(issue => issue.path[0])
      expect(paths).toContain('icon')
    }
  })
})

describe('hobbySchema', () => {
  it('validates real hobby frontmatter', () => {
    // Mirrors content/hobbies/videojuegos.md frontmatter.
    const videojuegosFrontmatter = {
      name: 'Videojuegos',
      icon: '🎮',
      description: 'Pasión por el gaming competitivo, la estrategia y el análisis de mecánicas interactivas.',
      order: 1
    }

    const result = hobbySchema.safeParse(videojuegosFrontmatter)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Videojuegos')
      expect(result.data.icon).toBe('🎮')
    }
  })

  it('fails validation when required fields are missing', () => {
    const result = hobbySchema.safeParse({ name: 'Videojuegos' })

    expect(result.success).toBe(false)
    if (!result.success) {
      const paths = result.error.issues.map(issue => issue.path[0])
      expect(paths).toContain('icon')
      expect(paths).toContain('description')
    }
  })
})
