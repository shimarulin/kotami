import { getConsoleLogDomain } from 'console'

import Gio from 'gi://Gio'
import GLib from 'gi://GLib'

import { SYSTEMD_CAT_PRIORITY, SystemdCatPriority } from './constants'
import { getErrorMessage } from './utils/getErrorMessage'

export class SystemdCatLogger {
  identifier: string

  constructor() {
    this.identifier = getConsoleLogDomain()
  }

  private send(message: string, priority: SystemdCatPriority) {
    /**
     * -p, --priority=
     * Specify the default priority level for the logged messages. Pass one of "emerg", "alert", "crit", "err", "warning", "notice", "info", "debug", or a value between 0 and 7 (corresponding to the same named levels). These priority values are the same as defined by syslog(3). Defaults to "info". Note that this simply controls the default, individual lines may be logged with different levels if they are prefixed accordingly. For details, see --level-prefix= below.
     *
     * --stderr-priority=
     * Specifies the default priority level for messages from the process's standard error output (stderr). Usage of this option is the same as the --priority= option, above, and both can be used at once. When both are used, --priority= will specify the default priority for standard output (stdout).
     *
     * If --stderr-priority= is not specified, messages from stderr will still be logged, with the same default priority level as stdout.
     *
     * Also, note that when stdout and stderr use the same default priority, the messages will be strictly ordered, because one channel is used for both. When the default priority differs, two channels are used, and so stdout messages will not be strictly ordered with respect to stderr messages - though they will tend to be approximately ordered.
     *
     * Added in version 241.
     *
     * --level-prefix=
     * Controls whether lines read are parsed for syslog priority level prefixes. If enabled (the default), a line prefixed with a priority prefix such as "<5>" is logged at priority 5 ("notice"), and similarly for the other priority levels. Takes a boolean argument.
     *
     * --namespace=
     * Specifies the journal namespace to which the standard IO should be connected. For details about journal namespaces, see systemd-journald.service(8).
     */
    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 0, () => {
      const proc = Gio.Subprocess.new(
        [
          'systemd-cat', '--identifier=' + this.identifier, '--priority=' + priority.toString(),
        ],
        Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE | Gio.SubprocessFlags.STDIN_PIPE,
      )
      proc.communicate_utf8_async(message, null, (procObj, res) => {
        if (procObj) {
          procObj.communicate_utf8_finish(res)
          log('Sent to journald via systemd-cat')
        }
      })

      return GLib.SOURCE_REMOVE
    })
  }

  log(message: string | object | boolean | number | null) {
    const priority = SYSTEMD_CAT_PRIORITY.info
    if (typeof message === 'string') {
      this.send(message, priority)
    }
    else {
      this.send(JSON.stringify(message), priority)
    }
  }

  warn(message: string | object | boolean | number | null) {
    const priority = SYSTEMD_CAT_PRIORITY.warning
    if (typeof message === 'string') {
      this.send(message, priority)
    }
    else {
      this.send(JSON.stringify(message), priority)
    }
  }

  error(message: string | object | boolean | number | null) {
    const priority = SYSTEMD_CAT_PRIORITY.err
    if (typeof message === 'string') {
      this.send(message, priority)
    }
    else {
      this.send(getErrorMessage(message), priority)
    }
  }
}
