import { readFile } from 'ags/file'

import { useLogger } from '@services/LoggerService'

import { STATE_FILE } from './constants'
import { LoginStorageRecord } from './types'

export function readLoginStorageState(): LoginStorageRecord | null {
  const { logger } = useLogger()
  try {
    const file = readFile(STATE_FILE)
    return file.length > 0 ? JSON.parse(file) : null
  }
  catch (err) {
    logger.error(err)
    return null
  }
}
