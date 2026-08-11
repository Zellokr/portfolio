/**
 * Security-critical: only `http:`/`https:` URLs are considered safe to
 * open in a new tab from terminal command output. Rejects everything
 * else (`javascript:`, `data:`, malformed input, etc.) without throwing.
 */
export function isAllowedUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}
