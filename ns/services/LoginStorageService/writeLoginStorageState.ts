import Gio from 'gi://Gio'

import { writeFile } from 'ags/file'

import { useSessionListService } from '@services/SessionListService'
import { useUserListService } from '@services/UserListService'

import { useLoginStorageService } from '.'
import { STATE_FILE } from './constants'
import { type LoginStorageRecord } from './types'

export function writeLoginStorageState() {
  const { selectedUser } = useUserListService()
  const { selectedSession, disposeSessionListService } = useSessionListService()
  const { cachedLoginStorageRecord } = useLoginStorageService()
  const state: LoginStorageRecord = {
    user: selectedUser.get().userName,
    sessions: {
      ...(cachedLoginStorageRecord.get()?.sessions),
      [selectedUser.get().userName]: selectedSession.get().path,
    },
  }

  disposeSessionListService()

  const file = Gio.File.new_for_path(STATE_FILE)
  if (!file.query_exists(null)) {
    try {
      const parentDir = file.get_parent()

      if (parentDir) {
        if (!parentDir.query_exists(null)) {
          parentDir.make_directory_with_parents(null)
        }
      }
    }
    catch (e) {
      if (e instanceof Error) {
        logError(e)
      }
    }
  }

  try {
    writeFile(STATE_FILE, JSON.stringify(state))
  }
  catch (e) {
    if (e instanceof Error) {
      logError(e)
    }
  }
}
