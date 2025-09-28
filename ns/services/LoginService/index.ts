import { createComputed } from 'ags'
import app from 'ags/gtk4/app'
import { timeout } from 'ags/time'

import { createComputedMap } from '@libs/gnim-extensions'
import { GreetdIPC } from '@libs/greetd-ipc'
import { usePamFaillockConf } from '@providers/pam-faillock'
import { useLogger } from '@services/LoggerService'
import { writeLoginStorageState } from '@services/LoginStorageService'
import { useSessionListService } from '@services/SessionListService'
import { useSessionManagerScreenService } from '@services/SessionManagerScreenService'
import { useUserListService } from '@services/UserListService'

const pamConfig = usePamFaillockConf()

const { userList, selectedUserName } = useUserListService()
const { setWindowVisible } = useSessionManagerScreenService()
const keys = createComputed([userList], (users) => {
  return users.map(user => user.userName)
})
const { accessor: isLoggingIn, set: setIsLoggingIn } = createComputedMap<boolean>(keys, selectedUserName, false)
const { accessor: isLogginError, set: setIsLoginError } = createComputedMap<boolean>(keys, selectedUserName, false)
const { accessor: remainingAttempts, set: setRemainingAttempts } = createComputedMap<number>(keys, selectedUserName, pamConfig.deny)
const { accessor: unlockInSeconds, set: setUnlockInSeconds } = createComputedMap<number>(keys, selectedUserName, pamConfig.unlock_time)
const { accessor: fraction, set: setFraction } = createComputedMap<number>(keys, selectedUserName, 0)
const isLockedOut = createComputed([remainingAttempts], (attempts) => {
  return attempts === 0
})
const isWaiting = createComputed([isLoggingIn, isLockedOut], (isLoggingInValue, isLockedOutValue) => {
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
    const { selectedUser } = useUserListService()
    const { selectedSession } = useSessionListService()

    const username = selectedUser.get().userName
    const command = selectedSession.get().exec

    if (username && command) {
      try {
        await GreetdIPC.login(username, password, command)
        resetRemainingAttempts(selectedUserNameValue)
        writeLoginStorageState()
        timeout(250, () => {
          setWindowVisible(false)
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
