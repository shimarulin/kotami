import { Astal, Gtk, Gdk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import UserCarousel from '@widgets/SessionManagerScreen/UserCarousel'

import PasswordField from './PasswordField'
import SessionSelect from './SessionSelect'
import scss from './style.scss'

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
            <SessionSelect cssClasses={['SessionManagerField']} />
            <PasswordField cssClasses={['SessionManagerField']} />
          </Gtk.Box>
        </Gtk.Box>
      </Gtk.Box>
    </Astal.Window>
  )
}
