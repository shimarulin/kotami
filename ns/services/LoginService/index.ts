import { createComputed, createState } from 'ags'

import { GreetdIPC } from '@libs/greetd-ipc'
import { usePamFaillockConf } from '@providers/pam-faillock'
import { useLogger } from '@services/LoggerService'
import { writeLoginStorageState } from '@services/LoginStorageService'
import { useSessionListService } from '@services/SessionListService'
import { useUserListService } from '@services/UserListService'

import { createCountdownTimer } from './createCountdownTimer'
import { createPulseTimer } from './createPulseTimer'

const pamConfig = usePamFaillockConf()

// TODO: Сделать ограничения по каждому пользователю
const [isLoggingIn, setIsLoggingIn] = createState<boolean>(false)
const [isLogginError, setIsLoginError] = createState<boolean>(false)
const [remainingAttempts, setRemainingAttempts] = createState<number>(pamConfig.deny)
const [unlockInSeconds, setUnlockInSeconds] = createState<number>(pamConfig.unlock_time)
const [fraction, setFraction] = createState<number>(0)
const isLockedOut = createComputed([remainingAttempts], (attempts) => {
  return attempts === 0
})
const isWaiting = createComputed([isLoggingIn, isLockedOut], (isLoggingInValue, isLockedOutValue) => {
  return isLoggingInValue || isLockedOutValue
})

const resetError = () => {
  setIsLoginError(false)
}
const resetRemainingAttempts = () => {
  setRemainingAttempts(pamConfig.deny)
  setIsLoginError(false)
}
const login = async (password: string) => {
  const { logger } = useLogger()
  const currentAttempts = remainingAttempts.get()
  const beforeLogin = () => {
    setIsLoginError(false)
    setIsLoggingIn(true)
  }
  const onLoginFailed = () => {
    setIsLoginError(true)
    setIsLoggingIn(false)
    setRemainingAttempts(currentAttempts - 1)
  }

  if (currentAttempts > 0) {
    beforeLogin()
    const { selectedUser } = useUserListService()
    const { selectedSession } = useSessionListService()

    const username = selectedUser.get().userName
    const command = selectedSession.get().exec

    if (username && command) {
      try {
        await GreetdIPC.login(username, password, command)
        writeLoginStorageState()
      }
      catch (err) {
        logger.error(err)
        onLoginFailed()
      }
    }
  }
}

const useLoginService = () => {
  const startCountdown = createCountdownTimer(pamConfig.unlock_time, setUnlockInSeconds, setFraction, resetRemainingAttempts)
  const { startPulseTimer, stopPulseTimer } = createPulseTimer()

  return {
    isLockedOut,
    isLoggingIn,
    isWaiting,
    isLogginError,
    fraction,
    unlockInSeconds,
    remainingAttempts,
    login,
    startCountdown,
    startPulseTimer,
    stopPulseTimer,
    resetError,
  }
}

export {
  useLoginService,
}
