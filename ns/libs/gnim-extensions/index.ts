import { Accessor, createComputed } from 'gnim'

export function toAccessor<T>(value: T | Accessor<T>): Accessor<T> {
  return value instanceof Accessor ? value : new Accessor(() => value)
}

export function createComputedArray<T>(deps: (Accessor<T[]>)[]): Accessor<T[]> {
  return createComputed(deps, (...arrays) => {
    const result: T[] = []
    arrays.forEach((arr) => {
      result.push(...arr)
    })
    return result
  })
}

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
