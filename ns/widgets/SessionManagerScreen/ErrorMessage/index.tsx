import { Accessor, createComputed } from 'ags'
import { Gtk } from 'ags/gtk4'

import { createComputedArray, toAccessor } from '../../../libs/gnim-extensions'
import { useAuthService } from '../../../services'

export interface Props {
  cssClasses?: string[] | Accessor<string[]>
}

export default function ErrorMessage({ cssClasses }: Props) {
  const authService = useAuthService()

  // Reactive error message
  const errorMessage = createComputed(() => authService.errorMessage)

  // Reactive CSS classes based on error state
  const messageCssClasses = createComputed(() => {
    const message = errorMessage()
    return message.length > 0 ? ['error'] : []
  })

  return (
    <Gtk.Label
      cssClasses={createComputedArray<string>([
        toAccessor(cssClasses || []),
        messageCssClasses,
      ])}
      label={errorMessage}
    />
  )
}
