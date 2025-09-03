import { Accessor, createState } from 'ags'
import { useLoginStorageService } from '@services/LoginStorageService'
import { type DesktopFileInfo } from '@utils/parseDesktopFiles.v3'
import { createSessionList } from './createSessionList'
import { useUserListService } from '@services/UserListService'
import { UserListItem } from '@services/UserListService/types'
import { LoginStorageRecord } from '@services/LoginStorageService/types'
import { createDisposeManager } from '@libs/gnim-extensions'

const [sessionList, setSessionList] = createState<DesktopFileInfo[]>([])
const [selectedSessionIndex, setSelectedSessionIndex] = createState<number>(-1)

const selectedSession = selectedSessionIndex(index => sessionList.get()[index])

const setSelectedSessionIndexByPath = (path: string) => {
  const index = sessionList.get().findIndex(session => session.path === path)

  setSelectedSessionIndex(index >= 0 ? index : 0)
}

const getCashedSessionByUser = (cachedLoginStorageRecord: Accessor<LoginStorageRecord | null>,
  selectedUser: Accessor<UserListItem>,
) => {
  const sessions = cachedLoginStorageRecord.get()?.sessions
  const userName = selectedUser.get().userName
  return sessions && sessions[userName]
}

const useSessionListService = () => {
  const [disposes, disposeSessionListService] = createDisposeManager()
  const { cachedLoginStorageRecord } = useLoginStorageService()
  const { selectedUser } = useUserListService()
  if (sessionList.get().length === 0) {
    setSessionList(createSessionList())
  }

  // TODO: fill from active session
  const activeSessionRecord: string | undefined = undefined
  const selectedSessionRecord: string | undefined = getCashedSessionByUser(cachedLoginStorageRecord, selectedUser)

  if (activeSessionRecord && selectedSessionIndex.get() < 0) {
    setSelectedSessionIndexByPath(activeSessionRecord)
  }
  else if (selectedSessionRecord && selectedSessionIndex.get() < 0) {
    setSelectedSessionIndexByPath(selectedSessionRecord)
  }
  else if (selectedSessionIndex.get() < 0) {
    setSelectedSessionIndex(0)
  }

  disposes.push(selectedUser.subscribe(() => {
    const user = selectedUser.get()
    const loginCache = cachedLoginStorageRecord.get()
    const cachedSessionPath = loginCache && loginCache.sessions[user.userName]

    if (cachedSessionPath) {
      setSelectedSessionIndexByPath(cachedSessionPath)
    }
    else {
      setSelectedSessionIndex(0)
    }
  }))

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
