/**
 * Client-side usage budget for the chat widget: a visible, persisted
 * counter so visitors know how many messages they have left. This is a UX
 * guard, not the security boundary — the server enforces its own rate
 * limit independently (see `server/utils/chat.ts`), so clearing this
 * storage doesn't bypass real protection.
 */
export const MESSAGE_LIMIT = 5
export const USAGE_WINDOW_MS = 5 * 60 * 60 * 1000
export const CHAT_USAGE_STORAGE_KEY = 'portfolio-chat-usage'

export interface ChatUsage {
  count: number
  windowStart: number
}

function freshUsage(now: number): ChatUsage {
  return { count: 0, windowStart: now }
}

export function loadChatUsage(storage: Pick<Storage, 'getItem'>, now: number = Date.now()): ChatUsage {
  try {
    const raw = storage.getItem(CHAT_USAGE_STORAGE_KEY)
    if (!raw) return freshUsage(now)

    const parsed = JSON.parse(raw) as Partial<ChatUsage>
    if (typeof parsed.count !== 'number' || typeof parsed.windowStart !== 'number') return freshUsage(now)
    if (now - parsed.windowStart >= USAGE_WINDOW_MS) return freshUsage(now)

    return { count: parsed.count, windowStart: parsed.windowStart }
  } catch {
    return freshUsage(now)
  }
}

export function recordChatMessage(storage: Pick<Storage, 'setItem'>, usage: ChatUsage, now: number = Date.now()): ChatUsage {
  const next = now - usage.windowStart >= USAGE_WINDOW_MS
    ? { count: 1, windowStart: now }
    : { count: usage.count + 1, windowStart: usage.windowStart }

  try {
    storage.setItem(CHAT_USAGE_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage unavailable (e.g. private browsing) — counter still works for this page load.
  }

  return next
}

export function remainingMessages(usage: ChatUsage): number {
  return Math.max(0, MESSAGE_LIMIT - usage.count)
}

export function isLimitReached(usage: ChatUsage, now: number = Date.now()): boolean {
  return usage.count >= MESSAGE_LIMIT && now - usage.windowStart < USAGE_WINDOW_MS
}

export function usageResetAt(usage: ChatUsage): Date {
  return new Date(usage.windowStart + USAGE_WINDOW_MS)
}
