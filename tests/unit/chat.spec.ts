import { describe, expect, it } from 'vitest'
import {
  DEFAULT_GLOBAL_DAILY_MAX,
  MAX_MESSAGE_LENGTH,
  MAX_MESSAGES,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_MS,
  buildSystemPrompt,
  globalDailyMax,
  isRateLimited,
  isRateLimitedPersistent,
  isTrustedOrigin,
  refundGlobalDailyBudget,
  refundRateLimit,
  reserveGlobalDailyBudget,
  validateMessages
} from '../../server/utils/chat'
import type { About, Agent, Hobby, Project, Technology, TimelineEntry } from '../../server/utils/chat'

describe('validateMessages', () => {
  it('accepts a well-formed conversation ending in a user message', () => {
    const result = validateMessages({
      messages: [
        { role: 'user', content: 'Hola' },
        { role: 'assistant', content: 'Hola, ¿en qué te ayudo?' },
        { role: 'user', content: '¿Con qué stack trabajas?' }
      ]
    })

    expect(result).toEqual([
      { role: 'user', content: 'Hola' },
      { role: 'assistant', content: 'Hola, ¿en qué te ayudo?' },
      { role: 'user', content: '¿Con qué stack trabajas?' }
    ])
  })

  it('rejects a missing or non-array messages field', () => {
    expect(validateMessages({})).toBeNull()
    expect(validateMessages({ messages: 'hola' })).toBeNull()
    expect(validateMessages(null)).toBeNull()
  })

  it('rejects an empty messages array', () => {
    expect(validateMessages({ messages: [] })).toBeNull()
  })

  it('rejects more than MAX_MESSAGES entries', () => {
    const messages = Array.from({ length: MAX_MESSAGES + 1 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: 'x'
    }))
    expect(validateMessages({ messages })).toBeNull()
  })

  it('rejects a message longer than MAX_MESSAGE_LENGTH', () => {
    const result = validateMessages({
      messages: [{ role: 'user', content: 'a'.repeat(MAX_MESSAGE_LENGTH + 1) }]
    })
    expect(result).toBeNull()
  })

  it('rejects an invalid role', () => {
    const result = validateMessages({
      messages: [{ role: 'system', content: 'hola' }]
    })
    expect(result).toBeNull()
  })

  it('rejects a conversation that does not end with a user message', () => {
    const result = validateMessages({
      messages: [
        { role: 'user', content: 'Hola' },
        { role: 'assistant', content: 'Hola' }
      ]
    })
    expect(result).toBeNull()
  })
})

describe('isRateLimited', () => {
  it('allows requests under the limit', () => {
    const log = new Map<string, number[]>()
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      expect(isRateLimited(log, '1.2.3.4', 1000)).toBe(false)
    }
  })

  it('blocks once a caller exceeds the limit within the window', () => {
    const log = new Map<string, number[]>()
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      isRateLimited(log, '1.2.3.4', 1000)
    }
    expect(isRateLimited(log, '1.2.3.4', 1000)).toBe(true)
  })

  it('tracks callers independently', () => {
    const log = new Map<string, number[]>()
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      isRateLimited(log, '1.2.3.4', 1000)
    }
    expect(isRateLimited(log, '5.6.7.8', 1000)).toBe(false)
  })

  it('forgets requests once they age out of the window', () => {
    const log = new Map<string, number[]>()
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      isRateLimited(log, '1.2.3.4', 1000)
    }
    expect(isRateLimited(log, '1.2.3.4', 1000 + RATE_LIMIT_WINDOW_MS + 1)).toBe(false)
  })
})

describe('globalDailyMax', () => {
  it('defaults when the env var is unset or invalid', () => {
    delete process.env.CHAT_GLOBAL_DAILY_MAX
    expect(globalDailyMax()).toBe(DEFAULT_GLOBAL_DAILY_MAX)

    process.env.CHAT_GLOBAL_DAILY_MAX = 'nonsense'
    expect(globalDailyMax()).toBe(DEFAULT_GLOBAL_DAILY_MAX)

    process.env.CHAT_GLOBAL_DAILY_MAX = '42'
    expect(globalDailyMax()).toBe(42)

    delete process.env.CHAT_GLOBAL_DAILY_MAX
  })
})

describe('reserveGlobalDailyBudget (in-memory fallback)', () => {
  it('allows requests up to the cap, then blocks', async () => {
    process.env.CHAT_GLOBAL_DAILY_MAX = '2'
    const now = Date.UTC(2030, 0, 1) // unique day => fresh bucket

    expect(await reserveGlobalDailyBudget(now)).toBe(true)
    expect(await reserveGlobalDailyBudget(now)).toBe(true)
    expect(await reserveGlobalDailyBudget(now)).toBe(false)

    delete process.env.CHAT_GLOBAL_DAILY_MAX
  })

  it('refund frees a reserved unit', async () => {
    process.env.CHAT_GLOBAL_DAILY_MAX = '1'
    const now = Date.UTC(2030, 0, 2) // a different unique day

    expect(await reserveGlobalDailyBudget(now)).toBe(true)
    expect(await reserveGlobalDailyBudget(now)).toBe(false)

    await refundGlobalDailyBudget(now)
    expect(await reserveGlobalDailyBudget(now)).toBe(true)

    delete process.env.CHAT_GLOBAL_DAILY_MAX
  })
})

describe('refundRateLimit (in-memory fallback)', () => {
  it('gives back consumed slots so a refunded caller is under the limit again', async () => {
    const id = 'refund-test-ip'
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      expect(await isRateLimitedPersistent(id, 2000)).toBe(false)
    }
    expect(await isRateLimitedPersistent(id, 2000)).toBe(true)

    // Refund the over-limit request plus one served slot.
    await refundRateLimit(id)
    await refundRateLimit(id)

    expect(await isRateLimitedPersistent(id, 2000)).toBe(false)
  })
})

describe('isTrustedOrigin', () => {
  it('accepts a matching Origin header', () => {
    expect(isTrustedOrigin('https://krismart.dev', undefined, 'krismart.dev')).toBe(true)
  })

  it('falls back to Referer when Origin is missing', () => {
    expect(isTrustedOrigin(undefined, 'https://krismart.dev/sobre-mi', 'krismart.dev')).toBe(true)
  })

  it('prefers Origin over Referer when both are present', () => {
    expect(isTrustedOrigin('https://evil.example', 'https://krismart.dev/', 'krismart.dev')).toBe(false)
  })

  it('rejects a mismatched host', () => {
    expect(isTrustedOrigin('https://evil.example', undefined, 'krismart.dev')).toBe(false)
  })

  it('rejects requests with neither header', () => {
    expect(isTrustedOrigin(undefined, undefined, 'krismart.dev')).toBe(false)
  })

  it('rejects a malformed header value instead of throwing', () => {
    expect(isTrustedOrigin('not-a-url', undefined, 'krismart.dev')).toBe(false)
  })

  it('matches host including port', () => {
    expect(isTrustedOrigin('http://localhost:3000', undefined, 'localhost:3000')).toBe(true)
    expect(isTrustedOrigin('http://localhost:3000', undefined, 'localhost:4000')).toBe(false)
  })
})

describe('buildSystemPrompt', () => {
  const about: About = {
    name: 'Kristian Martínez',
    headline: 'Frontend Engineer',
    bio: 'Ingeniero informático.',
    email: 'kristian@example.com',
    location: 'Islas Canarias',
    socials: []
  }

  const projects: Project[] = [
    {
      title: 'GameboyCSS',
      slug: 'gameboycss',
      summary: 'Una Gameboy hecha con CSS.',
      description: 'Una Gameboy hecha con CSS.',
      stack: ['Vue', 'CSS'],
      url: 'https://gameboycsskr.netlify.app',
      order: 1,
      featured: false
    }
  ]

  const timeline: TimelineEntry[] = [
    {
      title: 'Frontend Developer',
      organization: 'Ezentis',
      period: 'Marzo 2022 — Actualidad',
      category: 'experience',
      order: 1
    },
    {
      title: 'Grado en Ingeniería Informática',
      organization: 'Universidad de La Laguna',
      period: '2014 — 2020',
      category: 'education',
      order: 1
    }
  ]

  const technologies: Technology[] = [
    { name: 'Nuxt', icon: '/tech/nuxt.svg', url: 'https://nuxt.com', order: 1 },
    { name: 'Vue', icon: '/tech/vue.svg', url: 'https://vuejs.org', order: 2 }
  ]

  const agents: Agent[] = [
    { name: 'Claude Code', icon: '/tech/claude-code.svg', url: 'https://claude.com/claude-code', order: 1 }
  ]

  const hobbies: Hobby[] = [
    { name: 'Videojuegos', icon: '🎮', description: 'Pasión por el gaming competitivo.', order: 1 }
  ]

  it('includes real bio, project, experience, technology, agent and hobby data', () => {
    const prompt = buildSystemPrompt(about, projects, timeline, technologies, agents, hobbies)

    expect(prompt).toContain('Kristian Martínez')
    expect(prompt).toContain('Ingeniero informático.')
    expect(prompt).toContain('GameboyCSS')
    expect(prompt).toContain('Frontend Developer')
    expect(prompt).toContain('Grado en Ingeniería Informática')
    expect(prompt).toContain('Nuxt, Vue')
    expect(prompt).toContain('Agentes de IA que uso para programar')
    expect(prompt).toContain('Claude Code')
    expect(prompt).toContain('Aficiones')
    expect(prompt).toContain('Videojuegos')
  })

  it('does not mix agents into the technology list', () => {
    const prompt = buildSystemPrompt(about, projects, timeline, technologies, agents, hobbies)
    const technologySection = prompt.split('## Tecnologías que uso')[1]?.split('## Agentes de IA')[0] ?? ''

    expect(technologySection).not.toContain('Claude Code')
  })

  it('falls back gracefully when about is null and there is no data', () => {
    const prompt = buildSystemPrompt(null, [], [], [], [])

    expect(prompt).toContain('Kristian Martínez')
    expect(prompt).toContain('Sin datos.')
  })

  it('includes rules to stay on topic and refuse offensive or sexual content', () => {
    const prompt = buildSystemPrompt(about, projects, timeline, technologies, agents, hobbies)

    expect(prompt).toContain('Solo hablas de')
    expect(prompt.toLowerCase()).toContain('ofensivo')
  })
})
