import { createState, createComputed } from 'ags'
import { type DesktopFileInfo } from '@utils/parseDesktopFiles.v3'
import { createSessionList } from './createSessionList'

const [sessionList, setSessionList] = createState<DesktopFileInfo[]>([])
const [selectedSessionIndex, setSelectedSessionIndex] = createState<number>(0)

const selectedSession = createComputed(get => get(sessionList)[get(selectedSessionIndex)])

const setSelectedSessionIndexByPath = (path: string) => {
  const index = sessionList.get().findIndex(session => session.path === path)
  setSelectedSessionIndex(index >= 0 ? index : 0)
}

const useSessionListService = () => {
  if (sessionList.get().length === 0) {
    setSessionList(createSessionList())
  }

  // TODO: fill from active session
  const activeSessionRecord: string | null = null
  // TODO: fill from cache file
  const selectedSessionRecord: string | null = null

  if (activeSessionRecord) {
    setSelectedSessionIndexByPath(activeSessionRecord)
  }
  else if (selectedSessionRecord) {
    setSelectedSessionIndexByPath(selectedSessionRecord)
  }
  else {
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
