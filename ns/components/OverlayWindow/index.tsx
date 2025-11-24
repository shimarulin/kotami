import Graphene from 'gi://Graphene'

import { Accessor } from 'ags'
import GObject from 'ags/gobject'
import { Astal, Gdk, Gtk } from 'ags/gtk4'
import app from 'ags/gtk4/app'
import { FCProps } from 'gnim'

import { createComputedArray, toAccessor } from '@libs/gnim-extensions'

import scss from './style.scss'

export type WindowFullscreenProps = FCProps<
  Astal.Window,
  {
    children: Array<GObject.Object> | GObject.Object
    name: string
    cssClasses?: string[] | Accessor<string[]>
    layer?: Astal.Layer
  }
>

app.apply_css(scss)

export default function OverlayWindow({ children, name, cssClasses, layer }: WindowFullscreenProps) {
  const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor
  let window: Astal.Window
  let contentbox: Gtk.Box

  function closeOnPressEscapeKey(_e: Gtk.EventControllerKey, keyval: number) {
    if (keyval === Gdk.KEY_Escape) {
      window.hide()
      return
    }
  }

  function closeOnClickOutsideContent(_e: Gtk.GestureClick, _: number, x: number, y: number) {
    const [, rect] = contentbox.compute_bounds(window)
    const position = new Graphene.Point({ x, y })

    if (!rect.contains_point(position)) {
      window.hide()
      return true
    }
  }

  return (
    <Astal.Window
      name={name}
      application={app}
      $={ref => (window = ref)}
      layer={layer || Astal.Layer.OVERLAY} // Astal.Layer.OVERLAY
      // exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT | BOTTOM}
      keymode={Astal.Keymode.ON_DEMAND}
      cssClasses={createComputedArray<string>([
        toAccessor(cssClasses || []),
        toAccessor(['OverlayWindow']),
      ])}
    >
      <Gtk.EventControllerKey onKeyPressed={closeOnPressEscapeKey} />
      <Gtk.GestureClick onReleased={closeOnClickOutsideContent} />
      <Gtk.Box
        $={ref => (contentbox = ref)}
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
      >
        {children}
      </Gtk.Box>
    </Astal.Window>
  )
}
