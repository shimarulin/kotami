import { Accessor, createComputed } from 'gnim'

export function createComputedArray<T>(deps: (Accessor<T[]>)[]): Accessor<T[]> {
  return createComputed(deps, (...arrays) => {
    const result: T[] = []
    arrays.forEach((arr) => {
      result.push(...arr)
    })
    return result
  })
}
