import { createBinding, For, This } from 'ags'
import app from 'ags/gtk4/app'

import StatusBarWindow from './components/StatusBarWindow'
// import style from './style.scss'

app.start({
  /**
   * https://aylur.github.io/ags/guide/app-cli.html#instance-identifier
   *
   * Use in cli:
   * ags request show quick-settings -i status-bar
   */
  instanceName: 'status-bar',
  // css: style,
  // It's usually best to go with the default Adwaita theme
  // and built off of it, instead of allowing the system theme
  // to potentially mess something up when it is changed.
  // Note: `* { all:unset }` in css is not recommended.
  // gtkTheme: "Adwaita",
  requestHandler(argv: string[], response: (response: string) => void) {
    const [
      cmd, arg, ...rest
    ] = argv
    console.log('\nstatus-bar:')
    console.log(cmd)
    console.log(arg)
    console.log(rest)
    if (cmd == 'show') {
      return response('ok')
    }
    response('unknown command')
  },
  main() {
    const monitors = createBinding(app, 'monitors')

    return (
      <For each={monitors}>
        {monitor => (
          <This this={app}>
            <StatusBarWindow gdkmonitor={monitor} />
          </This>
        )}
      </For>
    )
  },
})
