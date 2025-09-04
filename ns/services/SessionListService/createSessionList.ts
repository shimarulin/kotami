import { DesktopFileInfo, getAvailableSessions } from '@providers/sessions'

export const createSessionList = (): DesktopFileInfo[] => {
  const sessionList = getAvailableSessions()
  const nameCount = sessionList
    .reduce((acc, item) => {
      if (item.name) {
        acc[item.name] = (acc[item.name] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>,
    )

  return sessionList
    .filter(item => item.name && nameCount[item.name] === 1)
    .sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : -1)
}
