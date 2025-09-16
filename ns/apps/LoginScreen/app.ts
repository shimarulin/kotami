import { setConsoleLogDomain } from 'console'

import app from 'ags/gtk4/app'

import { AppLogDomain, APP_LOG_DOMAIN } from '@libs/log'
import SessionManagerScreen from '@widgets/SessionManagerScreen'

setConsoleLogDomain(AppLogDomain.by_name(APP_LOG_DOMAIN.GREETER))

app.start({
  main() {
    // app.get_monitors().map(monitor => SessionManagerScreen(monitor))
    SessionManagerScreen(app.get_monitors()[0])
  },
})
