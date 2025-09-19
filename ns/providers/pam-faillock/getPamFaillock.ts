import { readFile } from 'ags/file'

export function getPamFaillock(path: string): string | void {
  try {
    const faillock = readFile(path)

    return faillock
  }
  catch (e) {
    logError(e)
  }
}
