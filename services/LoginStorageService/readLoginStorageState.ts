import { readFile } from 'ags/file'
import { LoginStorageRecord } from './types'
import { STATE_FILE } from './constants'

export function readLoginStorageState(): LoginStorageRecord | null {
  const file = readFile(STATE_FILE)
  return file.length > 0 ? JSON.parse(file) : null
}
