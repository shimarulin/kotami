export function createDisposeManager(): [Array<() => void>, () => void] {
  const disposes: Array<() => void> = []
  const disposesExecutor = () => {
    const errors: Error[] = []

    while (disposes.length) {
      const dispose = disposes.pop()!
      try {
        dispose()
      }
      catch (error) {
        errors.push(error instanceof Error ? error : new Error(String(error)))
      }
    }

    if (errors.length > 0) {
      throw new AggregateError(
        errors,
        `During disposal, ${errors.length} error(s) occurred`,
      )
    }
  }

  return [disposes, disposesExecutor]
}
