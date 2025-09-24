import AstalIO from 'gi://AstalIO'

import { Gtk } from 'ags/gtk4'
import { interval } from 'ags/time'

export function createPulseTimer() {
  let pulseTimer: AstalIO.Time | null = null

  function startPulseTimer(progressBar: Gtk.ProgressBar) {
    progressBar.set_fraction(0)
    progressBar.set_inverted(false)
    pulseTimer = interval(60, () => progressBar.pulse())
  }

  function stopPulseTimer() {
    if (pulseTimer !== null) {
      pulseTimer.cancel()
      pulseTimer = null
    }
  }

  return {
    startPulseTimer,
    stopPulseTimer,
  }
}
