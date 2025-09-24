import { createComputed } from 'ags'

import { GreetdIPC } from '@libs/greetd-ipc'
import { usePamFaillockConf } from '@providers/pam-faillock'
import { useLogger } from '@services/LoggerService'
import { writeLoginStorageState } from '@services/LoginStorageService'
import { useSessionListService } from '@services/SessionListService'
import { useUserListService } from '@services/UserListService'

import { createListOfComputedItems } from './createListOfComputedItems'

const pamConfig = usePamFaillockConf()

const { selectedUserIndex, userList } = useUserListService()
const { accessor: isLoggingIn, set: setIsLoggingIn } = createListOfComputedItems<boolean>(userList, selectedUserIndex, false)
const { accessor: isLogginError, set: setIsLoginError } = createListOfComputedItems<boolean>(userList, selectedUserIndex, false)
const { accessor: remainingAttempts, set: setRemainingAttempts } = createListOfComputedItems<number>(userList, selectedUserIndex, pamConfig.deny)
const { accessor: unlockInSeconds, set: setUnlockInSeconds } = createListOfComputedItems<number>(userList, selectedUserIndex, pamConfig.unlock_time)
const { accessor: fraction, set: setFraction } = createListOfComputedItems<number>(userList, selectedUserIndex, 0)
const isLockedOut = createComputed([remainingAttempts], (attempts) => {
  return attempts === 0
})
const isWaiting = createComputed([isLoggingIn, isLockedOut], (isLoggingInValue, isLockedOutValue) => {
  return isLoggingInValue || isLockedOutValue
})

const resetError = (index?: number) => {
  setIsLoginError(false, index)
}
const resetRemainingAttempts = (index?: number) => {
  setRemainingAttempts(pamConfig.deny, index)
  resetError(index)
}
const beforeLogin = (index: number) => {
  setIsLoginError(false, index)
  setIsLoggingIn(true, index)
}
const onLoginFailed = (index: number, attempts: number) => {
  setIsLoginError(true, index)
  setIsLoggingIn(false, index)
  setRemainingAttempts(attempts, index)
}
const login = async (password: string) => {
  const { logger } = useLogger()
  const userIndex = selectedUserIndex.get()
  const currentAttempts = remainingAttempts.get()

  if (currentAttempts > 0) {
    beforeLogin(userIndex)
    const { selectedUser } = useUserListService()
    const { selectedSession } = useSessionListService()

    const username = selectedUser.get().userName
    const command = selectedSession.get().exec

    if (username && command) {
      try {
        await GreetdIPC.login(username, password, command)
        resetRemainingAttempts(userIndex)
        writeLoginStorageState()
      }
      catch (err) {
        onLoginFailed(userIndex, currentAttempts - 1)
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
