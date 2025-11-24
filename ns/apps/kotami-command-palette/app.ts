import { Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import CommandPalette from './views/CommandPalette'

let commandPalette: Gtk.Window

app.start({
  /**
   * https://aylur.github.io/ags/guide/app-cli.html#instance-identifier
   *
   * Use in cli:
   * ags request show applications -i command-palette
   */
  instanceName: 'command-palette',
  requestHandler(argv: string[], response: (response: string) => void) {
    const [
      cmd, arg, ...rest
    ] = argv
    console.log('\ncommand-palette:')
    console.log(cmd)
    console.log(arg)
    console.log(rest)
    if (cmd === 'show') {
      commandPalette.present()
      return response('command-palette: visible')
    }
    else if (cmd === 'hide') {
      commandPalette.hide()
      return response('command-palette: hidden')
    }
    response('unknown command')
  },
  main() {
    commandPalette = CommandPalette() as Gtk.Window
  },
})
