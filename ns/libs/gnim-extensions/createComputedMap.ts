import { Accessor, createComputed, createState } from 'ags'

function createObjectFromKeyList<T, K extends string>(keys: K[], value: T): Record<K, T> {
  return keys.reduce((acc, key) => {
    acc[key] = value
    return acc
  }, {} as Record<K, T>)
}

export const createComputedMap = <T>(keyListAccessor: Accessor<string[]>, keyAccessor: Accessor<string>, initValue: T) => {
  const [stateMap, setStateMap] = createState<Record<string, T>>(createObjectFromKeyList(keyListAccessor.get(), initValue))
  const accessor = createComputed([keyAccessor, stateMap], (keyValue, stateMapValues) => {
    return stateMapValues[keyValue]
  })
  const set = (value: T, key?: string) => {
    const valuesMap = { ...stateMap.get() }
    if (key) {
      valuesMap[key] = value
    }
    else {
      valuesMap[keyAccessor.get()] = value
    }
    setStateMap(valuesMap)
  }
  const createSetterByIndex = (key: string) => {
    return (value: T) => set(value, key)
  }

  return {
    accessor,
    set,
    createSetterByIndex,
    stateList: stateMap,
  }
}
