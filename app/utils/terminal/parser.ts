/**
 * Tokenizes a raw terminal input line into a command name and its
 * arguments. Pure function, no Nuxt/Vue dependency.
 */
export function parse(input: string): { name: string; args: string[] } {
  const trimmed = input.trim()

  if (!trimmed) {
    return { name: '', args: [] }
  }

  const [name, ...args] = trimmed.split(/\s+/)

  return { name: name ?? '', args }
}
