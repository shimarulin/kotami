import { Accessor, createComputed, createState, State } from 'ags'

export const createListOfComputedItems = <T>(listAccessor: Accessor<unknown[]>, indexAccessor: Accessor<number>, initValue: T) => {
  const stateList: State<T>[] = listAccessor.get().map(() => createState<T>(initValue))
  const accessor = createComputed([indexAccessor, ...stateList.map(([accessor]) => accessor)], (selectedIndexValue, ...stateListValues) => {
    return stateListValues[selectedIndexValue]
  })
  const set = (value: T, index?: number) => {
    if (index) {
      stateList[index][1](value)
    }
    else {
      stateList[indexAccessor.get()][1](value)
    }
  }
  const createSetterByIndex = (index: number) => {
    return (value: T) => set(value, index)
  }

  return {
    accessor,
    set,
    createSetterByIndex,
    setterByIndex: (index: number, value: T) => {
      stateList[index][1](value)
    },
    stateList,
  }
}
