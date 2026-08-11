import { describe, expect, it, vi } from 'vitest'
import { buildCommands, runCommand } from '../../app/utils/terminal/commands'
import { createSession } from '../../app/utils/terminal/session'
import type { CommandContext, ProjectRef } from '../../app/utils/terminal/types'

const projects: ProjectRef[] = [
  {
    slug: 'gameboycss',
    title: 'GameboyCSS',
    summary: 'Aplicación para mostrar una Gameboy hecha con Vue y CSS puro.',
    url: 'https://gameboycsskr.netlify.app'
  },
  {
    slug: 'cv',
    title: 'CV',
    summary: 'Currículum personal hecho con Vue.',
    url: 'https://zellokrcv.netlify.app'
  }
]

function makeContext(): CommandContext {
  const session = createSession()
  const navigate = vi.fn((to: string) => {
    session.cwd = to
  })
  const openUrl = vi.fn()
  return { session, projects, navigate, openUrl }
}

describe('buildCommands', () => {
  it('registers help, ls, cd, open and clear', () => {
    const commands = buildCommands(projects)
    const names = commands.map(cmd => cmd.name)

    expect(names).toEqual(expect.arrayContaining(['help', 'ls', 'cd', 'open', 'clear']))
  })

  it('help lists every registered command name and description, generated from the registry', () => {
    const commands = buildCommands(projects)
    const ctx = makeContext()

    commands.find(cmd => cmd.name === 'help')!.run(ctx, [])

    expect(ctx.session.lines).toHaveLength(1)
    const [line] = ctx.session.lines
    expect(line.kind).toBe('output')
    for (const cmd of commands) {
      expect(line.text.some(row => row.includes(cmd.name) && row.includes(cmd.describe))).toBe(true)
    }
  })

  it('ls lists project slugs and titles from the projects array passed in, not hardcoded', () => {
    const commands = buildCommands(projects)
    const ctx = makeContext()

    commands.find(cmd => cmd.name === 'ls')!.run(ctx, [])

    expect(ctx.session.lines).toHaveLength(1)
    const [line] = ctx.session.lines
    expect(line.text.some(row => row.includes('gameboycss') && row.includes('GameboyCSS'))).toBe(true)
    expect(line.text.some(row => row.includes('cv') && row.includes('CV'))).toBe(true)
  })

  it('ls reflects a different projects array without any code change', () => {
    const otherProjects: ProjectRef[] = [
      { slug: 'solo', title: 'Solo Project', summary: 'x', url: 'https://example.com' }
    ]
    const commands = buildCommands(otherProjects)
    const ctx: CommandContext = { session: createSession(), projects: otherProjects, navigate: vi.fn(), openUrl: vi.fn() }

    commands.find(cmd => cmd.name === 'ls')!.run(ctx, [])

    const [line] = ctx.session.lines
    expect(line.text.some(row => row.includes('solo'))).toBe(true)
    expect(line.text.some(row => row.includes('gameboycss'))).toBe(false)
  })

  it('cd <slug> sets cwd when the slug matches a known project', () => {
    const commands = buildCommands(projects)
    const ctx = makeContext()

    commands.find(cmd => cmd.name === 'cd')!.run(ctx, ['cv'])

    expect(ctx.navigate).toHaveBeenCalledWith(expect.stringContaining('cv'))
    expect(ctx.session.cwd).toContain('cv')
  })

  it('cd <unknown-slug> appends an error line, does not throw, and does not change cwd', () => {
    const commands = buildCommands(projects)
    const ctx = makeContext()
    const cwdBefore = ctx.session.cwd

    expect(() => commands.find(cmd => cmd.name === 'cd')!.run(ctx, ['does-not-exist'])).not.toThrow()

    expect(ctx.session.cwd).toBe(cwdBefore)
    expect(ctx.session.lines).toHaveLength(1)
    expect(ctx.session.lines[0].kind).toBe('error')
  })

  it('cd .. returns to the root cwd', () => {
    const commands = buildCommands(projects)
    const ctx = makeContext()
    commands.find(cmd => cmd.name === 'cd')!.run(ctx, ['cv'])

    commands.find(cmd => cmd.name === 'cd')!.run(ctx, ['..'])

    expect(ctx.session.cwd).toBe('~')
  })

  it('cd with no args also returns to the root cwd', () => {
    const commands = buildCommands(projects)
    const ctx = makeContext()
    commands.find(cmd => cmd.name === 'cd')!.run(ctx, ['cv'])

    commands.find(cmd => cmd.name === 'cd')!.run(ctx, [])

    expect(ctx.session.cwd).toBe('~')
  })

  it('open <slug> resolves the given project and calls openUrl with its url', () => {
    const commands = buildCommands(projects)
    const ctx = makeContext()

    commands.find(cmd => cmd.name === 'open')!.run(ctx, ['gameboycss'])

    expect(ctx.openUrl).toHaveBeenCalledWith('https://gameboycsskr.netlify.app')
  })

  it('open with no slug resolves the current project from cwd', () => {
    const commands = buildCommands(projects)
    const ctx = makeContext()
    commands.find(cmd => cmd.name === 'cd')!.run(ctx, ['cv'])

    commands.find(cmd => cmd.name === 'open')!.run(ctx, [])

    expect(ctx.openUrl).toHaveBeenCalledWith('https://zellokrcv.netlify.app')
  })

  it('open with no slug and no current project appends an error line and does not throw', () => {
    const commands = buildCommands(projects)
    const ctx = makeContext()

    expect(() => commands.find(cmd => cmd.name === 'open')!.run(ctx, [])).not.toThrow()

    expect(ctx.openUrl).not.toHaveBeenCalled()
    expect(ctx.session.lines).toHaveLength(1)
    expect(ctx.session.lines[0].kind).toBe('error')
  })

  it('clear empties the session lines', () => {
    const commands = buildCommands(projects)
    const ctx = makeContext()
    commands.find(cmd => cmd.name === 'ls')!.run(ctx, [])
    expect(ctx.session.lines.length).toBeGreaterThan(0)

    commands.find(cmd => cmd.name === 'clear')!.run(ctx, [])

    expect(ctx.session.lines).toEqual([])
  })
})

describe('runCommand', () => {
  it('dispatches to the matching command by name', () => {
    const commands = buildCommands(projects)
    const ctx = makeContext()

    runCommand(commands, ctx, 'ls', [])

    expect(ctx.session.lines).toHaveLength(1)
    expect(ctx.session.lines[0].kind).toBe('output')
  })

  it('appends "command not found: <name>" for an unregistered command and does not throw', () => {
    const commands = buildCommands(projects)
    const ctx = makeContext()

    expect(() => runCommand(commands, ctx, 'sudo', ['rm'])).not.toThrow()

    expect(ctx.session.lines).toHaveLength(1)
    expect(ctx.session.lines[0].kind).toBe('error')
    expect(ctx.session.lines[0].text[0]).toBe('command not found: sudo')
  })
})
