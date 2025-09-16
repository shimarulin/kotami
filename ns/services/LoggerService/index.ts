import { FileLogger } from '@libs/log'

let fileLogger: FileLogger | null = null

export function useLogger() {
  if (!fileLogger) {
    fileLogger = new FileLogger()
  }

  return {
    logger: fileLogger,
  }
}
