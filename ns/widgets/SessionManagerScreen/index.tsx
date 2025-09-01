import app from 'ags/gtk4/app'
import { Astal, Gtk, Gdk } from 'ags/gtk4'
// import { gettext as _ } from 'gettext'
import UserCarousel from '@widgets/SessionManagerScreen/UserCarousel'
import { writeLoginStorageState } from '@services/LoginStorageService/writeLoginStorageState'
import scss from './style.scss'
import SessionSelect from './SessionSelect'

app.apply_css(scss)

export default function SessionManagerScreen(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor

  return (
    <Astal.Window
      visible
      name="SessionManagerScreen"
      class="SessionManagerScreen"
      gdkmonitor={gdkmonitor}
      // exclusivity={Astal.Exclusivity.IGNORE}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT | BOTTOM}
      keymode={Astal.Keymode.ON_DEMAND}
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
            <SessionSelect />
            <Gtk.PasswordEntry
              cssClasses={['SessionManagerField', 'UserPasswordEntry']}
              showPeekIcon={true}
              canFocus={true}
              sensitive={true}
              onRealize={(passwordEntry) => {
                passwordEntry.grab_focus()
              }}
              onActivate={writeLoginStorageState}
            />
          </Gtk.Box>
        </Gtk.Box>
      </Gtk.Box>
    </Astal.Window>
  )
}
