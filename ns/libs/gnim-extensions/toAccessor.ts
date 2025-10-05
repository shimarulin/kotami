import { Accessor } from 'gnim'

export function toAccessor<T>(value: T | Accessor<T>): Accessor<T> {
  return value instanceof Accessor ? value : new Accessor(() => value)
}
