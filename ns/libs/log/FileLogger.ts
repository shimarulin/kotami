import { getConsoleLogDomain } from 'console'

import Gio from 'gi://Gio'
import GLib from 'gi://GLib'

import { getConfig } from '@providers/config'

import { SYSTEMD_CAT_PRIORITY, SystemdCatPriority } from './constants'
import { getErrorMessage } from './utils/getErrorMessage'
import { getKeyByValue } from './utils/getKeyByValue'

const { log_file_path } = getConfig()

export class FileLogger {
  identifier: string
  file: Gio.File

  constructor() {
    this.identifier = getConsoleLogDomain()
    this.file = Gio.File.new_for_path(log_file_path)

    if (!this.file.query_exists(null)) {
      try {
        const parentDir = this.file.get_parent()

        if (parentDir && !parentDir.query_exists(null)) {
          parentDir.make_directory_with_parents(null)
        }

        const outputStream = this.file.create(Gio.FileCreateFlags.NONE, null)
        outputStream.close(null)
      }
      catch (e) {
        logError(e)
      }
    }
  }

  private send(message: string, priority: SystemdCatPriority) {
    const timestamp = new Date().toISOString()
    const logLevel = (getKeyByValue(SYSTEMD_CAT_PRIORITY, priority) || 'notice').toUpperCase()
    const logRecord = `${timestamp} ${this.identifier} ${logLevel}: ${message}`

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 0, () => {
      const fileStream = this.file.append_to(Gio.FileCreateFlags.NONE, null)
      const dataStream = new Gio.DataOutputStream({
        base_stream: fileStream,
        close_base_stream: true,
      })
      dataStream.put_string(`${logRecord}\n`, null)
      dataStream.close(null)
      fileStream.close(null)
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

  error(message: unknown | string | object | boolean | number | null) {
    const priority = SYSTEMD_CAT_PRIORITY.err
    if (typeof message === 'string') {
      this.send(message, priority)
    }
    else {
      this.send(getErrorMessage(message), priority)
    }
  }
}
