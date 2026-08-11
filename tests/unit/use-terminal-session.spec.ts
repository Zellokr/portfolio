import { describe, expect, it } from 'vitest'
import { isReactive } from 'vue'
import { useTerminalSession } from '../../app/composables/useTerminalSession'

describe('useTerminalSession', () => {
  it('creates a reactive session that starts at the root cwd with no lines', () => {
    const { session } = useTerminalSession()

    expect(isReactive(session)).toBe(true)
    expect(session.cwd).toBe('~')
    expect(session.lines).toEqual([])
  })

  it('appendLine pushes a line with an auto-incrementing id and returns it', () => {
    const { session, appendLine } = useTerminalSession()

    const first = appendLine('input', ['ls'])
    const second = appendLine('output', ['cv', 'gameboycss'])

    expect(first.id).toBe(1)
    expect(second.id).toBe(2)
    expect(session.lines).toHaveLength(2)
    expect(session.lines[0]).toEqual(first)
    expect(session.lines[1]).toEqual(second)
  })

  it('creates an independent session per call — no shared/singleton state', () => {
    const instanceA = useTerminalSession()
    const instanceB = useTerminalSession()

    instanceA.appendLine('input', ['ls'])

    expect(instanceA.session.lines).toHaveLength(1)
    expect(instanceB.session.lines).toHaveLength(0)
  })
})
