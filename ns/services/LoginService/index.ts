import { createComputed } from 'ags'
import app from 'ags/gtk4/app'
import { timeout } from 'ags/time'

import { createComputedMap } from '../../libs/gnim-extensions'
import { GreetdIPC } from '../../libs/greetd-ipc'
import { usePamFaillockConf } from '../../providers/pam-faillock'
import { useLogger } from '../../services/LoggerService'
import { writeLoginStorageState } from '../../services/LoginStorageService'
import { useSessionService } from '../../services'
import { useSessionManagerScreenService } from '../../services/SessionManagerScreenService'
import { useUserService } from '../../services'

const pamConfig = usePamFaillockConf()

const userService = useUserService()
const sessionService = useSessionService()

// Create computed values for compatibility with old API
const userList = createComputed(() => userService.availableUsers.map((u: any) => ({
  userName: u.name,
  realName: u.realName || u.name
})))
const selectedUserName = createComputed(() => userService.currentUser?.name || '')
const sessionManagerService = useSessionManagerScreenService()
const keys = createComputed(() => {
  const users = userList()
  return users.map((user: any) => user.userName)
})
const { accessor: isLoggingIn, set: setIsLoggingIn } = createComputedMap<boolean>(keys, selectedUserName, false)
const { accessor: isLogginError, set: setIsLoginError } = createComputedMap<boolean>(keys, selectedUserName, false)
const { accessor: remainingAttempts, set: setRemainingAttempts } = createComputedMap<number>(keys, selectedUserName, pamConfig.deny)
const { accessor: unlockInSeconds, set: setUnlockInSeconds } = createComputedMap<number>(keys, selectedUserName, pamConfig.unlock_time)
const { accessor: fraction, set: setFraction } = createComputedMap<number>(keys, selectedUserName, 0)
const isLockedOut = createComputed(() => {
  const attempts = remainingAttempts()
  return attempts === 0
})
const isWaiting = createComputed(() => {
  const isLoggingInValue = isLoggingIn()
  const isLockedOutValue = isLockedOut()
  return isLoggingInValue || isLockedOutValue
})

const resetError = (index?: string) => {
  setIsLoginError(false, index)
}
const resetRemainingAttempts = (index?: string) => {
  setRemainingAttempts(pamConfig.deny, index)
  resetError(index)
}
const beforeLogin = (index: string) => {
  setIsLoginError(false, index)
  setIsLoggingIn(true, index)
}
const onLoginFailed = (index: string, attempts: number) => {
  setIsLoginError(true, index)
  setIsLoggingIn(false, index)
  setRemainingAttempts(attempts, index)
}
const login = async (password: string) => {
  const { logger } = useLogger()
  const selectedUserNameValue = selectedUserName.get()
  const currentAttempts = remainingAttempts.get()

  if (currentAttempts > 0) {
    beforeLogin(selectedUserNameValue)

    const username = userService.currentUser?.name
    const command = sessionService.selectedSession?.exec

    if (username && command) {
      try {
        await GreetdIPC.login(username, password, command)
        resetRemainingAttempts(selectedUserNameValue)
        writeLoginStorageState()
        timeout(250, () => {
          sessionManagerService.hideWindow()
          timeout(250, () => {
            app.quit(0)
          })
        })
      }
      catch (err) {
        onLoginFailed(selectedUserNameValue, currentAttempts - 1)
        logger.error(err)
      }
    }
  }
}

const useLoginService = () => {
  return {
    isLockedOut,
    isLoggingIn,
    isWaiting,
    isLogginError,
    fraction,
    unlockInSeconds,
    remainingAttempts,
    login,
    setUnlockInSeconds,
    setFraction,
    resetRemainingAttempts,
    resetError,
  }
}

export {
  useLoginService,
}
