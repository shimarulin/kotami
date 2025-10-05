import { Accessor, onCleanup } from 'ags'
import { Gtk } from 'ags/gtk4'

import { createComputedArray, toAccessor } from '@libs/gnim-extensions'
import { useSessionListService } from '@services/SessionListService'

export interface SessionSelectProps {
  cssClasses?: string[] | Accessor<string[]>
}

export default function SessionSelect({ cssClasses }: SessionSelectProps) {
  const { sessionList, selectedSessionIndex, setSelectedSessionIndex, disposeSessionListService } = useSessionListService()

  onCleanup(() => {
    disposeSessionListService()
  })

  return (
    <Gtk.DropDown
      cssClasses={createComputedArray<string>([toAccessor(cssClasses || [])])}
      model={Gtk.StringList.new(sessionList.get().map(s => s.name || ''))}
      visible={sessionList.get().length > 1}
      selected={selectedSessionIndex}
      onNotifySelectedItem={(s) => {
        setSelectedSessionIndex(s.selected)
      }}
    />
  )
}
