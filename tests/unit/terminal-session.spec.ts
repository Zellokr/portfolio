import { describe, expect, it } from 'vitest'
import { appendLine, createSession } from '../../app/utils/terminal/session'

describe('createSession', () => {
  it('starts at the root cwd with no lines and nextId at 1', () => {
    const session = createSession()

    expect(session).toEqual({ cwd: '~', lines: [], nextId: 1 })
  })
})

describe('appendLine', () => {
  it('appends a line stamped with the current cwd and an auto-incrementing id', () => {
    const session = createSession()
    session.cwd = '~/projects/cv'

    const first = appendLine(session, 'output', ['hello'])
    const second = appendLine(session, 'error', ['oops'])

    expect(first).toEqual({ id: 1, kind: 'output', text: ['hello'], cwd: '~/projects/cv' })
    expect(second).toEqual({ id: 2, kind: 'error', text: ['oops'], cwd: '~/projects/cv' })
    expect(session.lines).toEqual([first, second])
    expect(session.nextId).toBe(3)
  })
})
