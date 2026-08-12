import { afterEach, describe, expect, it, vi } from 'vitest'
import { useTerminalSession } from '../../app/composables/useTerminalSession'
import { useTerminalCommands } from '../../app/composables/useTerminalCommands'
import type { ProjectRef } from '../../app/utils/terminal/types'

const projects: ProjectRef[] = [
  { slug: 'gameboycss', title: 'GameboyCSS', summary: 'x', url: 'https://gameboycsskr.netlify.app' },
  { slug: 'cv', title: 'CV', summary: 'x', url: 'https://zellokrcv.netlify.app' }
]

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useTerminalCommands', () => {
  it('dispatches ls and appends an output line built from the real project list', () => {
    const { session } = useTerminalSession()
    const { dispatch } = useTerminalCommands(session, projects)

    dispatch('ls', [])

    expect(session.lines).toHaveLength(1)
    expect(session.lines[0].text.some(row => row.includes('gameboycss'))).toBe(true)
  })

  it('navigate wired from cd updates session.cwd', () => {
    const { session } = useTerminalSession()
    const { dispatch } = useTerminalCommands(session, projects)

    dispatch('cd', ['cv'])

    expect(session.cwd).toContain('cv')
  })

  it('openUrl opens allowed http/https urls via window.open', () => {
    const openSpy = vi.fn()
    vi.stubGlobal('window', { open: openSpy })
    const { session } = useTerminalSession()
    const { dispatch } = useTerminalCommands(session, projects)

    dispatch('pnpm', ['run', 'cv'])

    expect(openSpy).toHaveBeenCalledWith('https://zellokrcv.netlify.app', '_blank', 'noopener,noreferrer')
  })

  it('openUrl rejects a non-http(s) scheme without calling window.open and without throwing', () => {
    const openSpy = vi.fn()
    vi.stubGlobal('window', { open: openSpy })
    const { session } = useTerminalSession()
    const maliciousProjects: ProjectRef[] = [
      { slug: 'evil', title: 'Evil', summary: 'x', url: 'javascript:alert(1)' }
    ]
    const { dispatch } = useTerminalCommands(session, maliciousProjects)

    expect(() => dispatch('pnpm', ['run', 'evil'])).not.toThrow()

    expect(openSpy).not.toHaveBeenCalled()
    expect(session.lines.some(line => line.kind === 'error')).toBe(true)
  })

  it('dispatches an unknown command to an error line without throwing', () => {
    const { session } = useTerminalSession()
    const { dispatch } = useTerminalCommands(session, projects)

    expect(() => dispatch('sudo', [])).not.toThrow()

    expect(session.lines[0].kind).toBe('error')
  })
})
