import { readFile } from 'ags/file'

import { getErrorMessage, toLog } from '@libs/log'

import { STATE_FILE } from './constants'
import { LoginStorageRecord } from './types'

export function readLoginStorageState(): LoginStorageRecord | null {
  try {
    const file = readFile(STATE_FILE)
    return file.length > 0 ? JSON.parse(file) : null
  }
  catch (err) {
    toLog(getErrorMessage(err))
    return null
  }
}
