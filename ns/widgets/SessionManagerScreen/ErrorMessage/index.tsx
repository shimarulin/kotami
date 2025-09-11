import { Accessor, createComputed } from 'ags'
import { Gtk } from 'ags/gtk4'

import { createComputedArray, toAccessor } from '@libs/gnim-extensions'
import { useLoginService } from '@services/LoginService'

export interface Props {
  cssClasses?: string[] | Accessor<string[]>
}

export default function ErrorMessage({ cssClasses }: Props) {
  const { unlockInSeconds: unlockInSec, remainingAttempts, isLockedOut, isLogginError } = useLoginService()

  const message = createComputed([
    isLockedOut,
    remainingAttempts,
    unlockInSec,
    isLogginError,
  ], (
    isLockedOutValue,
    remainingAttemptsValue,
    unlockInSecondsValue,
    isLogginErrorValue,
  ) => {
    if (!isLogginErrorValue) {
      return ''
    }
    else if (isLockedOutValue) {
      return `The attempts are over. Wait ${unlockInSecondsValue} seconds`
    }
    else {
      return `Failed to log in. ${remainingAttemptsValue} attempts left`
    }
  })

  const messageCssClasses = createComputed([isLockedOut, isLogginError], (isLockedOutValue, isLogginErrorValue) => {
    if (isLockedOutValue) {
      return ['warning']
    }
    else if (isLogginErrorValue) {
      return ['error']
    }
    else {
      return []
    }
  })

  return (
    <Gtk.Label
      cssClasses={createComputedArray<string>([
        toAccessor(cssClasses || []),
        messageCssClasses,
      ])}
      label={message}
    />
  )
}
