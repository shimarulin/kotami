import { readFile } from 'ags/file'

import { parseConfig } from '@libs/conf'

export interface PAMConfig {
  deny: number
  unlock_time: number
  dir?: string
}

export function getPamFaillockConf(): PAMConfig {
  // Default values
  const config: PAMConfig = {
    deny: 3,
    unlock_time: 600,
  }

  try {
    const parsed_config = parseConfig(readFile('/etc/security/faillock.conf'))

    if (typeof parsed_config.deny === 'number') {
      config.deny = parsed_config.deny
    }
    if (typeof parsed_config.unlock_time === 'number') {
      config.unlock_time = parsed_config.unlock_time
    }
    if (typeof parsed_config.dir === 'string') {
      config.dir = parsed_config.dir
    }
  }
  catch (e) {
    logError(e)
  }

  return config
}
