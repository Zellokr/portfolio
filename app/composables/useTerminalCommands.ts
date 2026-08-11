import { buildCommands, runCommand } from '../utils/terminal/commands'
import { appendLine } from '../utils/terminal/session'
import { isAllowedUrl } from '../utils/terminal/url'
import type { CommandContext, ProjectRef, TerminalSession } from '../utils/terminal/types'

/**
 * Wires a `CommandContext` (navigate + openUrl) around an existing,
 * locally-owned `TerminalSession` and the given project list, and builds
 * the command registry against it.
 *
 * `window.open` is only ever reached here through `dispatch()`, which is
 * only ever called from `TerminalApp.client.vue` — a `.client.vue`
 * component, whose `<script setup>` never executes during SSR (Nuxt's
 * component scanner marks `*.client.vue` components `mode: 'client'` and
 * renders a placeholder server-side instead of invoking their setup). So
 * this composable never touches `window` in an SSR-reachable code path in
 * practice, even though the reference lives in this file.
 */
export function useTerminalCommands(session: TerminalSession, projects: ProjectRef[]) {
  function navigate(to: string): void {
    session.cwd = to
  }

  function openUrl(url: string): void {
    if (!isAllowedUrl(url)) {
      appendLine(session, 'error', [`open: refusing to open unsupported url: ${url}`])
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const context: CommandContext = { session, projects, navigate, openUrl }
  const commands = buildCommands(projects)

  function dispatch(name: string, args: string[]): void {
    runCommand(commands, context, name, args)
  }

  return { context, commands, dispatch }
}
