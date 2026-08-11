import { describe, expect, it } from 'vitest'
import { parse } from '../../app/utils/terminal/parser'

describe('parse', () => {
  it('splits a command name and its arguments on whitespace', () => {
    expect(parse('cd projects')).toEqual({ name: 'cd', args: ['projects'] })
  })

  it('collects multiple arguments in order', () => {
    expect(parse('open cv extra-arg')).toEqual({ name: 'open', args: ['cv', 'extra-arg'] })
  })

  it('trims surrounding whitespace and collapses repeated spaces between tokens', () => {
    expect(parse('   ls    -la   ')).toEqual({ name: 'ls', args: ['-la'] })
  })

  it('returns an empty name and no args for an empty string', () => {
    expect(parse('')).toEqual({ name: '', args: [] })
  })

  it('returns an empty name and no args for a whitespace-only string', () => {
    expect(parse('    ')).toEqual({ name: '', args: [] })
  })

  it('returns just the name with an empty args array when there are no arguments', () => {
    expect(parse('help')).toEqual({ name: 'help', args: [] })
  })
})
