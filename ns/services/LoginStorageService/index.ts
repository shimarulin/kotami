import { createState } from 'ags'

import { readLoginStorageState } from './readLoginStorageState'
import { type LoginStorageRecord } from './types'
import { writeLoginStorageState } from './writeLoginStorageState'

const [cachedLoginStorageRecord, setCachedLoginStorageRecord] = createState<LoginStorageRecord | null>(null)

const useLoginStorageService = () => {
  if (cachedLoginStorageRecord.get() === null) {
    setCachedLoginStorageRecord(readLoginStorageState())
  }

  return {
    cachedLoginStorageRecord,
  }
}

export {
  useLoginStorageService,
  writeLoginStorageState,
}
