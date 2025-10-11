import { onCleanup } from 'ags'
import { Astal, Gdk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

export default function StatusBar({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
  let win: Astal.Window
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  onCleanup(() => {
    // Root components (windows) are not automatically destroyed.
    // When the monitor is disconnected from the system, this callback
    // is run from the parent <For> which allows us to destroy the window
    win.destroy()
  })

  return (
    <window
      $={self => (win = self)}
      visible
      namespace="kotami-panel"
      name={`panel-${gdkmonitor.connector}`}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox>
        <box $type="start">
          <label label="menu" />
        </box>
        <box $type="end">
          <label label="clock" />
        </box>
      </centerbox>
    </window>
  )
}
