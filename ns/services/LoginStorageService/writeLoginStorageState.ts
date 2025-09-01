import Gio from 'gi://Gio'
import { writeFile } from 'ags/file'
import { useUserListService } from '@services/UserListService'
import { useSessionListService } from '@services/SessionListService'
import { STATE_FILE } from './constants'
import { type LoginStorageRecord } from './types'

export function writeLoginStorageState() {
  const { selectedUser } = useUserListService()
  const { selectedSession } = useSessionListService()
  const state: LoginStorageRecord = {
    user: selectedUser.get().userName,
    sessionPath: selectedSession.get().path,
  }

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
