import app from 'ags/gtk4/app'
import { Astal, Gtk, Gdk } from 'ags/gtk4'
import UserCarousel from '@widgets/UserCarousel'

export default function SessionManagerScreen(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor

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
      <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
        <UserCarousel />
        <Gtk.Box orientation={Gtk.Orientation.VERTICAL}>
          <Gtk.PasswordEntry showPeekIcon={true} placeholderText="Password"></Gtk.PasswordEntry>
        </Gtk.Box>
      </Gtk.Box>
    </Astal.Window>
  )
}
