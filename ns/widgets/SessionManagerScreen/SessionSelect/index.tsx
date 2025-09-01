import { Gtk } from 'ags/gtk4'
import { useSessionListService } from '@services/SessionListService'
import { createState } from 'ags'

export default function SessionSelect() {
  const { sessionList, selectedSessionIndex, setSelectedSessionIndex } = useSessionListService()
  const [sessionSelect, setSessionSelect] = createState<Gtk.DropDown | null>(null)

  selectedSessionIndex.subscribe(() => {
    const selected = selectedSessionIndex.get()
    const dropDown = sessionSelect.get()

    if (dropDown && dropDown.selected !== selected) {
      dropDown.selected = selected
    }
  })

  return (
    <Gtk.DropDown
      cssClasses={['SessionManagerField']}
      model={Gtk.StringList.new(sessionList.get().map(s => s.name || ''))}
      visible={sessionList.get().length > 1}
      selected={selectedSessionIndex}
      onNotifySelectedItem={(s) => {
        setSelectedSessionIndex(s.selected)
      }}
      onRealize={(dropDown) => {
        setSessionSelect(dropDown)
      }}
    />
  )
}
