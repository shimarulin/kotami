export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  else if (typeof error === 'object') {
    return JSON.stringify(error)
  }
  return String(error)
}
