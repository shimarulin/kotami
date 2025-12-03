import Gio from 'gi://Gio'

import { writeFile } from 'ags/file'

import { useLogger } from '@services/LoggerService'
import { useSessionService, useUserService } from '@services/index'

import { useLoginStorageService } from '.'
import { STATE_FILE } from './constants'
import { type LoginStorageRecord } from './types'

export function writeLoginStorageState() {
  const { logger } = useLogger()
  const userService = useUserService()
  const sessionService = useSessionService()
  const { cachedLoginStorageRecord } = useLoginStorageService()

  if (!userService.currentUser || !sessionService.selectedSession) {
    logger.warn('No user or session selected for login storage')
    return
  }

  const state: LoginStorageRecord = {
    user: userService.currentUser.name,
    sessions: {
      ...(cachedLoginStorageRecord.get()?.sessions),
      [userService.currentUser.name]: sessionService.selectedSession.exec, // Use exec as session identifier
    },
  }

  const file = Gio.File.new_for_path(STATE_FILE)
  if (!file.query_exists(null)) {
    try {
      const parentDir = file.get_parent()

      if (parentDir && !parentDir.query_exists(null)) {
        parentDir.make_directory_with_parents(null)
      }

      const outputStream = file.create(Gio.FileCreateFlags.NONE, null)
      outputStream.close(null)
    }
    catch (e) {
      logger.error(e)
    }
  }

  try {
    writeFile(STATE_FILE, JSON.stringify(state))
  }
  catch (e) {
    logger.error(e)
  }
}
