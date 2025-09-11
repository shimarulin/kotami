import GLib from 'gi://GLib'

import { Accessor, createComputed, onCleanup } from 'ags'
import { Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { createComputedArray, createDisposeManager, toAccessor } from '@libs/gnim-extensions'
import { useLoginService } from '@services/LoginService'

import scss from './style.scss'

app.apply_css(scss)

export interface PasswordFieldProps {
  cssClasses?: string[] | Accessor<string[]>
}

export default function PasswordField({ cssClasses }: PasswordFieldProps) {
  const { isLoggingIn, isLockedOut, isWaiting, isLogginError, fraction, login, startCountdown, startPulseTimer, stopPulseTimer, resetError } = useLoginService()
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

  disposes.push(isLoggingIn.subscribe(() => {
    if (isLoggingIn.get()) {
      startPulseTimer(progressBar)
    }
    else {
      stopPulseTimer()
    }
  }))

  disposes.push(isLockedOut.subscribe(() => {
    if (isLockedOut.get()) {
      startCountdown(progressBar)
    }
  }))

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
        $={(self) => { progressBar = self }}
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
