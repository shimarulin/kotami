import GLib from 'gi://GLib'

import { Gtk } from 'ags/gtk4'

import { useUserListService } from '@services/UserListService'

export function createCountdownTimer(
  intervalInSeconds: number,
  setRemainingSeconds: (remaining: number, index?: number) => void,
  setFraction: (fraction: number, index?: number) => void,
  resetCallback: (index?: number) => void,
) {
  const tickCallbackIdMap: Record<number, number> = {}

  const createTicker = (index: number, startTimeInSeconds: number) => {
    return (widget: Gtk.Widget) => {
      const currentTimeInSeconds = GLib.get_monotonic_time() / 1000000
      const elapsed = currentTimeInSeconds - startTimeInSeconds
      const remaining = intervalInSeconds - elapsed
      const fraction = remaining / intervalInSeconds
      setRemainingSeconds(Math.ceil(remaining), index)
      setFraction(fraction, index)

      if (remaining <= 0) {
        widget.remove_tick_callback(tickCallbackIdMap[index])
        tickCallbackIdMap[index] = 0
        resetCallback(index)
      }

      return GLib.SOURCE_CONTINUE
    }
  }

  function start(progressBar: Gtk.ProgressBar) {
    const { selectedUserIndex } = useUserListService()
    const userIndex = selectedUserIndex.get()
    const startTimeInSeconds = GLib.get_monotonic_time() / 1000000
    progressBar.set_inverted(true)
    const onTick = createTicker(userIndex, startTimeInSeconds)
    tickCallbackIdMap[userIndex] = progressBar.add_tick_callback(onTick)
  }

  return start
}
