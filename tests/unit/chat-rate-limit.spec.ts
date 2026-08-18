import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const ORIGINAL_ENV = { ...process.env }

async function importFreshChatUtils() {
  vi.resetModules()
  return import('../../server/utils/chat')
}

describe('isRateLimitedPersistent', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.doUnmock('@upstash/redis')
    process.env = { ...ORIGINAL_ENV }
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
    vi.doUnmock('@upstash/redis')
  })

  it('falls back to the in-memory limiter when Redis env vars are missing', async () => {
    const { isRateLimitedPersistent, RATE_LIMIT_MAX_REQUESTS } = await importFreshChatUtils()

    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      expect(await isRateLimitedPersistent('1.2.3.4', 1000)).toBe(false)
    }
    expect(await isRateLimitedPersistent('1.2.3.4', 1000)).toBe(true)
  })

  it('tracks fallback callers independently by id', async () => {
    const { isRateLimitedPersistent, RATE_LIMIT_MAX_REQUESTS } = await importFreshChatUtils()

    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      await isRateLimitedPersistent('1.2.3.4', 1000)
    }
    expect(await isRateLimitedPersistent('5.6.7.8', 1000)).toBe(false)
  })

  it('uses Redis INCR/EXPIRE when Upstash env vars are configured', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token'

    const incr = vi.fn().mockResolvedValue(1)
    const expire = vi.fn().mockResolvedValue(1)
    vi.doMock('@upstash/redis', () => ({
      Redis: vi.fn(function RedisMock(this: { incr: typeof incr, expire: typeof expire }) {
        this.incr = incr
        this.expire = expire
      })
    }))

    const { isRateLimitedPersistent, RATE_LIMIT_WINDOW_MS } = await importFreshChatUtils()
    const blocked = await isRateLimitedPersistent('1.2.3.4')

    expect(blocked).toBe(false)
    expect(incr).toHaveBeenCalledWith('chat-rate-limit:1.2.3.4')
    expect(expire).toHaveBeenCalledWith('chat-rate-limit:1.2.3.4', Math.ceil(RATE_LIMIT_WINDOW_MS / 1000))
  })

  it('blocks once Redis reports the count past the limit, without resetting the window', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'test-token'

    const incr = vi.fn().mockResolvedValue(6)
    const expire = vi.fn().mockResolvedValue(1)
    vi.doMock('@upstash/redis', () => ({
      Redis: vi.fn(function RedisMock(this: { incr: typeof incr, expire: typeof expire }) {
        this.incr = incr
        this.expire = expire
      })
    }))

    const { isRateLimitedPersistent } = await importFreshChatUtils()
    const blocked = await isRateLimitedPersistent('1.2.3.4')

    expect(blocked).toBe(true)
    expect(expire).not.toHaveBeenCalled()
  })
})
