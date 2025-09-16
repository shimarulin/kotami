export const APP_LOG_DOMAIN = {
  GREETER: 'greeter',
  SHELL: 'shell',
} as const
export type AppLogDomainName = typeof APP_LOG_DOMAIN[keyof typeof APP_LOG_DOMAIN]

export const SYSTEMD_CAT_PRIORITY = {
  emerg: 0,
  alert: 1,
  crit: 2,
  err: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
} as const
export type SystemdCatPriority = typeof SYSTEMD_CAT_PRIORITY[keyof typeof SYSTEMD_CAT_PRIORITY]

export class AppLogDomain {
  static domain = 'kotami'

  static by_name(name: AppLogDomainName): string {
    return `${name}.${this.domain}`
  }
}
