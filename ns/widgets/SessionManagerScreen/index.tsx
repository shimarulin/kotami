import { createComputed } from 'ags'
import { Astal, Gtk, Gdk } from 'ags/gtk4'
import app from 'ags/gtk4/app'
import { timeout } from 'ags/time'

import { useSessionManagerScreenService } from '@services/SessionManagerScreenService'

import ErrorMessage from './ErrorMessage'
import PasswordField from './PasswordField'
import SessionSelect from './SessionSelect'
import scss from './style.scss'
import UserCarousel from './UserCarousel'

app.apply_css(scss)

export default function SessionManagerScreen(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor
  const { windowVisible, setWindowVisible } = useSessionManagerScreenService()
  const windowCssClasses = createComputed([windowVisible], (windowVisibleValue) => {
    return windowVisibleValue ? ['SessionManagerScreen', 'SessionManagerScreenVisible'] : ['SessionManagerScreen']
  })

  return (
    <Astal.Window
      visible
      name="SessionManagerScreen"
      cssClasses={windowCssClasses}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT | BOTTOM}
      keymode={Astal.Keymode.ON_DEMAND}
      application={app}
      $={() => {
        timeout(250, () => {
          setWindowVisible(true)
        })
      }}
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
            <ErrorMessage cssClasses={['SessionManagerField']} />
          </Gtk.Box>
        </Gtk.Box>
      </Gtk.Box>
    </Astal.Window>
  )
}
