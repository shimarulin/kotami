import { createComputed, createState } from 'ags'

import { createCountdownTimer } from './createCountdownTimer'
import { createPulseTimer } from './createPulseTimer'

const MAX_LOGIN_ATTEMPTS = 3
const LOCKED_TIMEOUT_IN_SEC = 30

const [isLoggingIn, setIsLoggingIn] = createState<boolean>(false)
const [isLogginError, setIsLoginError] = createState<boolean>(false)
const [remainingAttempts, setRemainingAttempts] = createState<number>(MAX_LOGIN_ATTEMPTS)
const [unlockInSeconds, setUnlockInSeconds] = createState<number>(LOCKED_TIMEOUT_IN_SEC)
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
  setRemainingAttempts(MAX_LOGIN_ATTEMPTS)
  setIsLoginError(false)
}
const login = (password: string) => {
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

    // try greet
    print(password)
    // and login failed event
    setTimeout(() => {
      onLoginFailed()
    }, 2000)
  }
}

const useLoginService = () => {
  const startCountdown = createCountdownTimer(LOCKED_TIMEOUT_IN_SEC, setUnlockInSeconds, setFraction, resetRemainingAttempts)
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
