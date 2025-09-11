import GLib from 'gi://GLib'

import { Gtk } from 'ags/gtk4'

export function createCountdownTimer(
  intervalInSeconds: number,
  setRemainingSeconds: (remaining: number) => void,
  setFraction: (fraction: number) => void,
  resetCallback: () => void,
) {
  let startTimeInSeconds = 0
  let tickCallbackId = 0

  function onTick(widget: Gtk.Widget) {
    const currentTimeInSeconds = GLib.get_monotonic_time() / 1000000
    const elapsed = currentTimeInSeconds - startTimeInSeconds
    const remaining = intervalInSeconds - elapsed
    const fraction = remaining / intervalInSeconds
    setRemainingSeconds(Math.ceil(remaining))
    setFraction(fraction)

    if (remaining <= 0) {
      widget.remove_tick_callback(tickCallbackId)
      tickCallbackId = 0
      resetCallback()
    }

    return GLib.SOURCE_CONTINUE
  }

  function start(progressBar: Gtk.ProgressBar) {
    startTimeInSeconds = GLib.get_monotonic_time() / 1000000
    progressBar.set_inverted(true)
    tickCallbackId = progressBar.add_tick_callback(onTick)
  }

  return start
}
