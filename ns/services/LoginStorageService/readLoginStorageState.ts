import { readFile } from 'ags/file'

import { STATE_FILE } from './constants'
import { LoginStorageRecord } from './types'

export function readLoginStorageState(): LoginStorageRecord | null {
  const file = readFile(STATE_FILE)
  return file.length > 0 ? JSON.parse(file) : null
}
