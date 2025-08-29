import { createState } from 'ags'
import { writeLoginStorageState } from './writeLoginStorageState'
import { readLoginStorageState } from './readLoginStorageState'
import { type LoginStorageRecord } from './types'

const [cachedLoginStorageRecord, setCachedLoginStorageRecord] = createState<LoginStorageRecord | null>(null)

const useLoginStorageService = () => {
  if (cachedLoginStorageRecord.get() === null) {
    setCachedLoginStorageRecord(readLoginStorageState())
  }

  return {
    cachedLoginStorageRecord,
    writeLoginStorageState,
  }
}

export {
  useLoginStorageService,
}
