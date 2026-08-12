import { appendLine } from './session'
import type { Command, CommandContext, ProjectRef } from './types'
import { WELCOME_LINES } from './welcome'

const PROJECT_PATH_PREFIX = '~/projects/'

function projectPath(slug: string): string {
  return `${PROJECT_PATH_PREFIX}${slug}`
}

function currentProjectSlug(cwd: string): string | undefined {
  return cwd.startsWith(PROJECT_PATH_PREFIX) ? cwd.slice(PROJECT_PATH_PREFIX.length) : undefined
}

/**
 * Builds the terminal command registry. Pure factory: it closes over the
 * `projects` list it receives so `ls`/`cd`/`pnpm run` are always driven by
 * the real project data instead of a hardcoded list, and `help` is generated
 * from the registry array itself so its output can never drift from the
 * actual set of registered commands.
 */
export function buildCommands(projects: ProjectRef[]): Command[] {
  const commands: Command[] = []

  const helpCommand: Command = {
    name: 'help',
    describe: 'List available commands',
    run: (ctx: CommandContext) => {
      const lines = commands.map((cmd) => {
        const usage = cmd.usage ? ` ${cmd.usage}` : ''
        return `${cmd.name}${usage} — ${cmd.describe}`
      })
      appendLine(ctx.session, 'output', lines)
    }
  }

  const lsCommand: Command = {
    name: 'ls',
    describe: 'List available projects',
    run: (ctx: CommandContext) => {
      if (projects.length === 0) {
        appendLine(ctx.session, 'output', ['No projects found.'])
        return
      }
      const lines = projects.map(project => project.slug)
      appendLine(ctx.session, 'output', lines)
    }
  }

  const cdCommand: Command = {
    name: 'cd',
    usage: '<slug>',
    describe: 'Change into a project directory ("cd .." or "cd" to go back)',
    run: (ctx: CommandContext, args: string[]) => {
      const target = args[0]

      if (!target || target === '..') {
        ctx.navigate('~')
        return
      }

      const project = projects.find(candidate => candidate.slug === target)
      if (!project) {
        appendLine(ctx.session, 'error', [`cd: no such project: ${target}`])
        return
      }

      ctx.navigate(projectPath(project.slug))
    }
  }

  const pnpmCommand: Command = {
    name: 'pnpm',
    usage: 'run [slug]',
    describe: 'Open a project url in a new tab',
    run: (ctx: CommandContext, args: string[]) => {
      if (args[0] !== 'run') {
        appendLine(ctx.session, 'error', ['pnpm: unknown script, did you mean "pnpm run"?'])
        return
      }

      const slug = args[1] ?? currentProjectSlug(ctx.session.cwd)
      const project = slug ? projects.find(candidate => candidate.slug === slug) : undefined

      if (!project) {
        appendLine(ctx.session, 'error', ['pnpm run: no project to open'])
        return
      }

      ctx.openUrl(project.url)
    }
  }

  const clearCommand: Command = {
    name: 'clear',
    describe: 'Clear the terminal output',
    run: (ctx: CommandContext) => {
      ctx.session.lines.length = 0
      appendLine(ctx.session, 'output', WELCOME_LINES)
    }
  }

  commands.push(helpCommand, lsCommand, cdCommand, pnpmCommand, clearCommand)

  return commands
}

/**
 * Looks up a command by name (or alias) and runs it. Falls back to an
 * error output line for unknown commands — never throws.
 */
export function runCommand(commands: Command[], ctx: CommandContext, name: string, args: string[]): void {
  const command = commands.find(candidate => candidate.name === name || candidate.aliases?.includes(name))

  if (!command) {
    appendLine(ctx.session, 'error', [`command not found: ${name}`])
    return
  }

  command.run(ctx, args)
}
