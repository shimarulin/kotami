import { setConsoleLogDomain } from 'console'

import app from 'ags/gtk4/app'

import { AppLogDomain, APP_LOG_DOMAIN } from '@libs/log'
import SessionManagerScreen from '@widgets/SessionManagerScreen'

app.start({
  main() {
    setConsoleLogDomain(AppLogDomain.by_name(APP_LOG_DOMAIN.GREETER))
    SessionManagerScreen(app.get_monitors()[0])
  },
})
