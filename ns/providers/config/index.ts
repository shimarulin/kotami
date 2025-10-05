const LOG_FILE_PATH = '/var/log/kotami-greeter/kotami-greeter.log'

export function getConfig() {
  return {
    log_file_path: LOG_FILE_PATH,
  }
}
