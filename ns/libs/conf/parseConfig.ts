export function parseConfig(text: string) {
  const config: Record<string, string | number | boolean> = {}
  const lines = text.split('\n')

  for (let line of lines) {
    // Skip comments and empty lines
    line = line.trim()
    if (line.startsWith('#') || line === '') continue

    // Handle boolean flags (e.g. `even_deny_root`)
    if (line.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      config[line] = true
      continue
    }

    // Process key-value pairs (e.g. `deny = 3`)
    const match = line.match(/^(\w+)\s*=\s*(.+)$/)
    if (match) {
      const key = match[1]
      let value: string | number = match[2].trim()

      // Convert numeric values from strings to numbers
      if (value.match(/^\d+$/)) {
        value = parseInt(value)
      }
      config[key] = value
    }
  }
  return config
}
