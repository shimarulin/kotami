import app from 'ags/gtk4/app'

import SessionManagerScreen from '@widgets/SessionManagerScreen'

app.start({
  main() {
    // app.get_monitors().map(monitor => SessionManagerScreen(monitor))
    SessionManagerScreen(app.get_monitors()[0])
  },
})
