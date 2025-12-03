import GLib from 'gi://GLib'

import { Accessor, createComputed, onCleanup } from 'ags'
import { Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import { createComputedArray, createDisposeManager, toAccessor } from '../../../libs/gnim-extensions'
import { useAuthService } from '../../../services'

import scss from './style.scss'

app.apply_css(scss)

export interface PasswordFieldProps {
  cssClasses?: string[] | Accessor<string[]>
}

export default function PasswordField({ cssClasses }: PasswordFieldProps) {
  const authService = useAuthService()
  const [disposes, dispose] = createDisposeManager()

  // Reactive error state
  const hasError = createComputed(() => authService.errorMessage.length > 0)
  const isAuthenticating = createComputed(() => authService.isAuthenticating)

  const messageCssClasses = createComputed([hasError], (hasErrorValue) => {
    return hasErrorValue ? ['error'] : []
  })

  // Get selected user for authentication
  const getSelectedUser = () => {
    // TODO: Integrate with UserService to get selected user
    // For now, use a mock user
    return { name: 'user' }
  }

  return (
    <Gtk.Overlay>
      <Gtk.PasswordEntry
        $={(passwordEntry) => {
          disposes.push(isAuthenticating.subscribe(() => {
            /**
             * Handle authentication state changes
             */
            if (authService.isAuthenticating) {
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
              if (!authService.isAuthenticated) {
                passwordEntry.grab_focus()
              }
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
          const user = getSelectedUser()
          if (user) {
            authService.authenticate(user.name, text)
          }
        }}
        onNotifyText={() => {
          // Clear error when user starts typing
          authService.clearError()
        }}
        onRealize={(passwordEntry) => {
          passwordEntry.grab_focus()
        }}
      />
      <Gtk.ProgressBar
        $type="overlay"
        cssClasses={['horizontal', 'PasswordFieldProgress']}
        valign={Gtk.Align.END}
        orientation={Gtk.Orientation.HORIZONTAL}
        marginStart={8}
        marginEnd={8}
        marginBottom={3}
        canTarget={false}
        pulseStep={0.15}
        visible={isAuthenticating}
      />
    </Gtk.Overlay>
  )
}
