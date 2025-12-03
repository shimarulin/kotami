import { Accessor, onCleanup, createComputed } from 'ags'
import { Gtk } from 'ags/gtk4'

import { createComputedArray, toAccessor } from '../../../libs/gnim-extensions'
import { useSessionService } from '../../../services'

export interface SessionSelectProps {
  cssClasses?: string[] | Accessor<string[]>
}

export default function SessionSelect({ cssClasses }: SessionSelectProps) {
  const sessionService = useSessionService()

  // Reactive model for dropdown
  const dropdownModel = createComputed(() =>
    Gtk.StringList.new(sessionService.availableSessions.map(s => s.name || ''))
  )

  // Reactive visibility
  const isVisible = createComputed(() => sessionService.availableSessions.length > 1)

  // Reactive selected index
  const selectedIndex = createComputed(() => {
    if (!sessionService.selectedSession) return 0
    const index = sessionService.availableSessions.findIndex(s => s.name === sessionService.selectedSession?.name)
    return index >= 0 ? index : 0
  })

  return (
    <Gtk.DropDown
      cssClasses={createComputedArray<string>([toAccessor(cssClasses || [])])}
      model={dropdownModel()}
      visible={isVisible()}
      selected={selectedIndex()}
      onNotifySelectedItem={(dropdown) => {
        const selectedIdx = dropdown.selected
        if (sessionService.availableSessions[selectedIdx]) {
          sessionService.selectSession(sessionService.availableSessions[selectedIdx])
        }
      }}
    />
  )
}
