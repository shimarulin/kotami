import GLib from 'gi://GLib'

import { Gtk } from 'ags/gtk4'

import { useUserListService } from '@services/UserListService'

export function createCountdownTimer(
  intervalInSeconds: number,
  setRemainingSeconds: (remaining: number, key?: string) => void,
  setFraction: (fraction: number, key?: string) => void,
  resetCallback: (key?: string) => void,
) {
  const tickCallbackIdMap: Record<string, number> = {}

  const createTicker = (key: string, startTimeInSeconds: number) => {
    return (widget: Gtk.Widget) => {
      const currentTimeInSeconds = GLib.get_monotonic_time() / 1000000
      const elapsed = currentTimeInSeconds - startTimeInSeconds
      const remaining = intervalInSeconds - elapsed
      const fraction = remaining / intervalInSeconds
      setRemainingSeconds(Math.ceil(remaining), key)
      setFraction(fraction, key)

      if (remaining <= 0) {
        widget.remove_tick_callback(tickCallbackIdMap[key])
        tickCallbackIdMap[key] = 0
        resetCallback(key)
      }

      return GLib.SOURCE_CONTINUE
    }
  }

  function start(progressBar: Gtk.ProgressBar) {
    const { selectedUserName } = useUserListService()
    const userIndex = selectedUserName.get()
    // TODO: Get start time from PAM faillock per user
    const startTimeInSeconds = GLib.get_monotonic_time() / 1000000
    progressBar.set_inverted(true)
    const onTick = createTicker(userIndex, startTimeInSeconds)
    tickCallbackIdMap[userIndex] = progressBar.add_tick_callback(onTick)
  }

  return start
}
