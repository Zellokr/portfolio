import { reactive } from 'vue'
import { appendLine as appendLineToSession, createSession } from '../utils/terminal/session'
import type { TerminalLine, TerminalSession } from '../utils/terminal/types'

/**
 * Factory composable: creates a fresh, locally-owned reactive terminal
 * session. Every call returns an independent `reactive()` object — there
 * is no module-level singleton and no shared event bus. Callers (e.g.
 * `TerminalApp.client.vue`) own the instance they create and consume it
 * through normal Vue reactivity.
 */
export function useTerminalSession() {
  const session = reactive<TerminalSession>(createSession())

  function appendLine(kind: TerminalLine['kind'], text: string[]): TerminalLine {
    return appendLineToSession(session, kind, text)
  }

  return { session, appendLine }
}
