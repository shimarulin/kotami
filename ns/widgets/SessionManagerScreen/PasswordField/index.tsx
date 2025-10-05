import GLib from 'gi://GLib'

import { Accessor, createComputed, onCleanup } from 'ags'
import { Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { createComputedArray, createDisposeManager, toAccessor } from '@libs/gnim-extensions'
import { usePamFaillockConf } from '@providers/pam-faillock'
import { useLoginService } from '@services/LoginService'

import { createCountdownTimer } from './createCountdownTimer'
import { createPulseTimer } from './createPulseTimer'
import scss from './style.scss'

app.apply_css(scss)

export interface PasswordFieldProps {
  cssClasses?: string[] | Accessor<string[]>
}

export default function PasswordField({ cssClasses }: PasswordFieldProps) {
  const pamConfig = usePamFaillockConf()
  const { isLoggingIn, isLockedOut, isWaiting, isLogginError, fraction, login, resetError, setUnlockInSeconds, setFraction, resetRemainingAttempts } = useLoginService()
  const startCountdown = createCountdownTimer(pamConfig.unlock_time, setUnlockInSeconds, setFraction, resetRemainingAttempts)
  const { startPulseTimer, stopPulseTimer } = createPulseTimer()
  const [disposes, dispose] = createDisposeManager()

  const messageCssClasses = createComputed([isLogginError], (isLogginErrorValue) => {
    if (isLogginErrorValue) {
      return ['error']
    }
    else {
      return []
    }
  })

  let progressBar: Gtk.ProgressBar
  const pulseHandler = () => {
    if (isLoggingIn.get()) {
      startPulseTimer(progressBar)
    }
    else {
      stopPulseTimer()
    }
  }
  const countdownHandler = () => {
    if (isLockedOut.get()) {
      startCountdown(progressBar)
    }
  }

  disposes.push(isLoggingIn.subscribe(pulseHandler))
  disposes.push(isLockedOut.subscribe(countdownHandler))

  onCleanup(() => {
    dispose()
  })

  return (
    <Gtk.Overlay>
      <Gtk.PasswordEntry
        $={(passwordEntry) => {
          disposes.push(isWaiting.subscribe(() => {
            /**
             * The following code avoids the warning:
             *
             * (gjs:99251): Gtk-WARNING **: 22:46:54.436: GtkText - did not receive a focus-out event.
             * If you handle this event, you must return
             * GDK_EVENT_PROPAGATE so the default handler
             * gets the event as well
             *
             * when changing only the "sensitive" property:
             *
             * sensitive={isWaiting(val => !val)}
             */
            if (isWaiting.get()) {
              GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, () => {
                passwordEntry.focusable = false
                passwordEntry.editable = false
                passwordEntry.set_state_flags(Gtk.StateFlags.INSENSITIVE, true)
                return GLib.SOURCE_REMOVE
              })
            }
            else {
              passwordEntry.focusable = true
              passwordEntry.editable = true
              passwordEntry.sensitive = true
              passwordEntry.grab_focus()
            }
          }))
        }}
        cssClasses={createComputedArray<string>([
          toAccessor(cssClasses || []),
          toAccessor(['UserPasswordEntry']),
          messageCssClasses,
        ])}
        showPeekIcon={true}
        canFocus={true}
        onActivate={({ text }) => {
          login(text)
        }}
        onNotifyText={() => resetError()}
        onRealize={(passwordEntry) => {
          passwordEntry.grab_focus()
        }}
      />
      <Gtk.ProgressBar
        $type="overlay"
        $={(self) => {
          progressBar = self
          countdownHandler()
        }}
        cssClasses={['horizontal', 'PasswordFieldProgress']}
        valign={Gtk.Align.END}
        orientation={Gtk.Orientation.HORIZONTAL}
        marginStart={8}
        marginEnd={8}
        marginBottom={3}
        canTarget={false}
        pulseStep={0.15}
        fraction={fraction}
        visible={isWaiting}
      />
    </Gtk.Overlay>
  )
}
