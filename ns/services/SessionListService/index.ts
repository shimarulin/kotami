import { Accessor, createState } from 'ags'

import { createDisposeManager } from '../../libs/gnim-extensions'
import { type DesktopFileInfo } from '../../providers/sessions'
import { useLoginStorageService } from '../../services/LoginStorageService'
import { LoginStorageRecord } from '../../services/LoginStorageService/types'
import { useUserService } from '../../services'

import { createSessionList } from './createSessionList'

const [sessionList, setSessionList] = createState<DesktopFileInfo[]>([])
const [selectedSessionIndex, setSelectedSessionIndex] = createState<number>(-1)

const selectedSession = selectedSessionIndex(index => sessionList.get()[index])

const setSelectedSessionIndexByPath = (path: string) => {
  const index = sessionList.get().findIndex(session => session.path === path)

  setSelectedSessionIndex(index >= 0 ? index : 0)
}

const getCashedSessionByUser = (cachedLoginStorageRecord: Accessor<LoginStorageRecord | null>,
  userName: string,
) => {
  const sessions = cachedLoginStorageRecord.get()?.sessions
  return sessions && sessions[userName]
}

const useSessionListService = () => {
  const [disposes, disposeSessionListService] = createDisposeManager()
  const { cachedLoginStorageRecord } = useLoginStorageService()
  const userService = useUserService()

  if (sessionList.get().length === 0) {
    setSessionList(createSessionList())
  }

  // TODO: fill from active session
  const activeSessionRecord: string | undefined = undefined
  const selectedSessionRecord: string | undefined = userService.currentUser?.name
    ? getCashedSessionByUser(cachedLoginStorageRecord, userService.currentUser.name)
    : undefined

  if (activeSessionRecord && selectedSessionIndex.get() < 0) {
    setSelectedSessionIndexByPath(activeSessionRecord)
  }
  else if (selectedSessionRecord && selectedSessionIndex.get() < 0) {
    setSelectedSessionIndexByPath(selectedSessionRecord)
  }
  else if (selectedSessionIndex.get() < 0) {
    setSelectedSessionIndex(0)
  }

  // Listen to user changes from GObject service
  const userChangedHandler = userService.connect('user-selected', () => {
    const user = userService.currentUser
    if (user) {
      const loginCache = cachedLoginStorageRecord.get()
      const cachedSessionPath = loginCache && loginCache.sessions[user.name]

      if (cachedSessionPath) {
        setSelectedSessionIndexByPath(cachedSessionPath)
      }
      else {
        setSelectedSessionIndex(0)
      }
    }
  })

  disposes.push(() => userService.disconnect(userChangedHandler))

  return {
    sessionList,
    selectedSession,
    selectedSessionIndex,
    setSelectedSessionIndex,
    disposeSessionListService,
  }
}

export {
  useSessionListService,
}
