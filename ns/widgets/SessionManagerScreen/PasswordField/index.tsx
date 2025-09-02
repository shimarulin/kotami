import { Gtk } from 'ags/gtk4'
// import { gettext as _ } from 'gettext'
import { writeLoginStorageState } from '@services/LoginStorageService/writeLoginStorageState'
import { Accessor } from 'ags'
import { createComputedArray, toAccessor } from '@libs/gnim-extensions'

export interface PasswordFieldProps {
  cssClasses?: string[] | Accessor<string[]>
}

export default function PasswordField({ cssClasses }: PasswordFieldProps) {
  return (
    <Gtk.PasswordEntry
      cssClasses={createComputedArray<string>([
        toAccessor(cssClasses || []),
        toAccessor(['UserPasswordEntry']),
      ])}
      showPeekIcon={true}
      canFocus={true}
      sensitive={true}
      onRealize={(passwordEntry) => {
        passwordEntry.grab_focus()
      }}
      onActivate={writeLoginStorageState}
    />
  )
}
