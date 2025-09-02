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
