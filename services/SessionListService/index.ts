import { createState } from 'ags'
import { useLoginStorageService } from '@services/LoginStorageService'
import { type DesktopFileInfo } from '@utils/parseDesktopFiles.v3'
import { createSessionList } from './createSessionList'

const [sessionList, setSessionList] = createState<DesktopFileInfo[]>([])
const [selectedSessionIndex, setSelectedSessionIndex] = createState<number>(-1)

const selectedSession = selectedSessionIndex(index => sessionList.get()[index])

const setSelectedSessionIndexByPath = (path: string) => {
  const index = sessionList.get().findIndex(session => session.path === path)

  setSelectedSessionIndex(index >= 0 ? index : 0)
}

const useSessionListService = () => {
  const { cachedLoginStorageRecord } = useLoginStorageService()
  if (sessionList.get().length === 0) {
    setSessionList(createSessionList())
  }

  // TODO: fill from active session
  const activeSessionRecord: string | undefined = undefined
  // TODO: fill from cache file
  const selectedSessionRecord: string | undefined = cachedLoginStorageRecord.get()?.sessionPath

  if (activeSessionRecord && selectedSessionIndex.get() < 0) {
    setSelectedSessionIndexByPath(activeSessionRecord)
  }
  else if (selectedSessionRecord && selectedSessionIndex.get() < 0) {
    setSelectedSessionIndexByPath(selectedSessionRecord)
  }
  else if (selectedSessionIndex.get() < 0) {
    setSelectedSessionIndex(0)
  }

  return {
    sessionList,
    selectedSession,
    selectedSessionIndex,
    setSelectedSessionIndex,
  }
}

export {
  useSessionListService,
}
