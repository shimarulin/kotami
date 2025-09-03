import { Gtk } from 'ags/gtk4'
import { useSessionListService } from '@services/SessionListService'
import { Accessor } from 'ags'
import { createComputedArray, toAccessor } from '@libs/gnim-extensions'

export interface SessionSelectProps {
  cssClasses?: string[] | Accessor<string[]>
}

export default function SessionSelect({ cssClasses }: SessionSelectProps) {
  const { sessionList, selectedSessionIndex, setSelectedSessionIndex } = useSessionListService()

  return (
    <Gtk.DropDown
      cssClasses={createComputedArray<string>([
        toAccessor(cssClasses || []),
      ])}
      model={Gtk.StringList.new(sessionList.get().map(s => s.name || ''))}
      visible={sessionList.get().length > 1}
      selected={selectedSessionIndex}
      onNotifySelectedItem={(s) => {
        setSelectedSessionIndex(s.selected)
      }}
    />
  )
}
