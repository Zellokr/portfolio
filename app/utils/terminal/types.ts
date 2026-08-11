/**
 * Pure TypeScript contracts for the terminal mode. No Nuxt/Vue imports here
 * on purpose — these types (and the pure functions built on top of them)
 * must be usable and testable without any framework/runtime context.
 */

export interface TerminalLine {
  id: number
  kind: 'input' | 'output' | 'error'
  text: string[]
  cwd: string
}

export interface TerminalSession {
  cwd: string
  lines: TerminalLine[]
  nextId: number
}

export interface ProjectRef {
  slug: string
  title: string
  summary: string
  url: string
}

export interface CommandContext {
  session: TerminalSession
  projects: ProjectRef[]
  navigate: (to: string) => void
  openUrl: (url: string) => void
}

export interface Command {
  name: string
  aliases?: string[]
  describe: string
  usage?: string
  run: (ctx: CommandContext, args: string[]) => void
}
