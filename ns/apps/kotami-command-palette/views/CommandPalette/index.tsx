import { Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'

import OverlayWindow from '@components/OverlayWindow'

import scss from './style.scss'

app.apply_css(scss)

export default function CommandPalette() {
  return (
    <OverlayWindow
      name="command-palette"
    >
      <Gtk.Box
        name="command-palette__content"
        cssClasses={['CommandPaletteContent']}
        valign={Gtk.Align.START}
        halign={Gtk.Align.START}
        orientation={Gtk.Orientation.VERTICAL}
        widthRequest={600}
        heightRequest={550}
      >
        <Gtk.Entry />
      </Gtk.Box>
    </OverlayWindow>
  )
}
