import app from 'ags/gtk4/app'
import { Astal, Gtk, Gdk } from 'ags/gtk4'
// import { gettext as _ } from 'gettext'
import UserCarousel from '@widgets/SessionManagerScreen/UserCarousel'
import { useSessionListService } from '@services/SessionListService'
// import { writeLoginStorageState } from '@services/LoginStorageService/writeLoginStorageState'
import scss from './style.scss'

app.apply_css(scss)

export default function SessionManagerScreen(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor
  const { sessionList, selectedSessionIndex, setSelectedSessionIndex } = useSessionListService()

  return (
    <Astal.Window
      visible
      name="SessionManagerScreen"
      class="SessionManagerScreen"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT | BOTTOM}
      application={app}
    >
      <Gtk.Box
        cssClasses={['SessionManagerContainer']}
        halign={Gtk.Align.FILL}
        valign={Gtk.Align.FILL}
        hexpand={true}
        vexpand={true}
      >
        <Gtk.Box
          cssClasses={['SessionManagerView']}
          orientation={Gtk.Orientation.VERTICAL}
          halign={Gtk.Align.FILL}
          valign={Gtk.Align.CENTER}
          hexpand={true}
        >
          <UserCarousel />
          <Gtk.Box
            cssClasses={['SessionManagerFields']}
            orientation={Gtk.Orientation.VERTICAL}
            widthRequest={280}
            hexpand={false}
            halign={Gtk.Align.CENTER}
          >
            <Gtk.DropDown
              cssClasses={['SessionManagerField']}
              model={Gtk.StringList.new(sessionList.get().map(s => s.name || ''))}
              selected={selectedSessionIndex}
              onNotifySelectedItem={(s) => {
                setSelectedSessionIndex(s.selected)
              }}
              visible={sessionList.get().length > 1}
            />
            <Gtk.Entry />
            <Gtk.PasswordEntry
              cssClasses={['SessionManagerField', 'UserPasswordEntry']}
              showPeekIcon={true}
              canFocus={true}
              sensitive={true}
              onRealize={(passwordEntry) => {
                passwordEntry.grab_focus()
              }}
            />
          </Gtk.Box>
        </Gtk.Box>
      </Gtk.Box>
    </Astal.Window>
  )
}
