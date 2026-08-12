import { describe, expect, it } from 'vitest'
import {
  MESSAGE_LIMIT,
  USAGE_WINDOW_MS,
  isLimitReached,
  loadChatUsage,
  recordChatMessage,
  remainingMessages,
  usageResetAt
} from '../../app/utils/chatUsage'
import type { ChatUsage } from '../../app/utils/chatUsage'

function fakeStorage(initial: Record<string, string> = {}) {
  const data = { ...initial }
  return {
    getItem: (key: string) => data[key] ?? null,
    setItem: (key: string, value: string) => {
      data[key] = value
    },
    raw: data
  }
}

describe('loadChatUsage', () => {
  it('starts fresh when nothing is stored', () => {
    const storage = fakeStorage()
    const usage = loadChatUsage(storage, 1000)
    expect(usage).toEqual({ count: 0, windowStart: 1000 })
  })

  it('restores a stored usage still inside the window', () => {
    const storage = fakeStorage({ 'portfolio-chat-usage': JSON.stringify({ count: 3, windowStart: 1000 }) })
    const usage = loadChatUsage(storage, 1000 + USAGE_WINDOW_MS - 1)
    expect(usage).toEqual({ count: 3, windowStart: 1000 })
  })

  it('resets once the stored window has expired', () => {
    const storage = fakeStorage({ 'portfolio-chat-usage': JSON.stringify({ count: 5, windowStart: 1000 }) })
    const usage = loadChatUsage(storage, 1000 + USAGE_WINDOW_MS + 1)
    expect(usage).toEqual({ count: 0, windowStart: 1000 + USAGE_WINDOW_MS + 1 })
  })

  it('resets on malformed stored data', () => {
    const storage = fakeStorage({ 'portfolio-chat-usage': 'not json' })
    expect(loadChatUsage(storage, 1000)).toEqual({ count: 0, windowStart: 1000 })
  })
})

describe('recordChatMessage', () => {
  it('increments the count within the same window and persists it', () => {
    const storage = fakeStorage()
    const usage: ChatUsage = { count: 1, windowStart: 1000 }

    const next = recordChatMessage(storage, usage, 2000)

    expect(next).toEqual({ count: 2, windowStart: 1000 })
    expect(JSON.parse(storage.raw['portfolio-chat-usage'])).toEqual(next)
  })

  it('starts a new window when the previous one expired', () => {
    const storage = fakeStorage()
    const usage: ChatUsage = { count: 5, windowStart: 1000 }

    const next = recordChatMessage(storage, usage, 1000 + USAGE_WINDOW_MS + 1)

    expect(next).toEqual({ count: 1, windowStart: 1000 + USAGE_WINDOW_MS + 1 })
  })
})

describe('remainingMessages / isLimitReached / usageResetAt', () => {
  it('reports remaining messages under the limit', () => {
    expect(remainingMessages({ count: 2, windowStart: 0 })).toBe(MESSAGE_LIMIT - 2)
  })

  it('never reports negative remaining messages', () => {
    expect(remainingMessages({ count: MESSAGE_LIMIT + 3, windowStart: 0 })).toBe(0)
  })

  it('is not reached below the limit', () => {
    expect(isLimitReached({ count: MESSAGE_LIMIT - 1, windowStart: 0 }, 100)).toBe(false)
  })

  it('is reached at the limit within the window', () => {
    expect(isLimitReached({ count: MESSAGE_LIMIT, windowStart: 0 }, 100)).toBe(true)
  })

  it('is not reached once the window has passed, even at the limit', () => {
    expect(isLimitReached({ count: MESSAGE_LIMIT, windowStart: 0 }, USAGE_WINDOW_MS + 1)).toBe(false)
  })

  it('computes the reset time as windowStart + USAGE_WINDOW_MS', () => {
    expect(usageResetAt({ count: MESSAGE_LIMIT, windowStart: 1000 })).toEqual(new Date(1000 + USAGE_WINDOW_MS))
  })
})
