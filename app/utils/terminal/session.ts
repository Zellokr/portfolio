import type { TerminalLine, TerminalSession } from './types'

/**
 * Pure state helpers for a terminal session. No Vue import here — the
 * `useTerminalSession` composable wraps `createSession()` output with
 * `reactive()`. Kept pure so both the composable and the command registry
 * (`commands.ts`) share a single source of truth for how lines are
 * appended and ids are assigned, without either depending on Vue.
 */
export function createSession(cwd = '~'): TerminalSession {
  return { cwd, lines: [], nextId: 1 }
}

export function appendLine(session: TerminalSession, kind: TerminalLine['kind'], text: string[]): TerminalLine {
  const line: TerminalLine = { id: session.nextId, kind, text, cwd: session.cwd }
  session.lines.push(line)
  session.nextId += 1
  return line
}
