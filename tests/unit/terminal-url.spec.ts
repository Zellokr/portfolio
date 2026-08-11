import { describe, expect, it } from 'vitest'
import { isAllowedUrl } from '../../app/utils/terminal/url'

describe('isAllowedUrl', () => {
  it('allows http and https urls', () => {
    expect(isAllowedUrl('https://example.com')).toBe(true)
    expect(isAllowedUrl('http://example.com')).toBe(true)
  })

  it('rejects javascript: and data: schemes', () => {
    expect(isAllowedUrl('javascript:alert(1)')).toBe(false)
    expect(isAllowedUrl('data:text/html,<script>alert(1)</script>')).toBe(false)
  })

  it('rejects a malformed url without throwing', () => {
    expect(() => isAllowedUrl('not a url')).not.toThrow()
    expect(isAllowedUrl('not a url')).toBe(false)
  })
})
