import { createComputed } from "gnim"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import app from "ags/gtk4/app"

/**
 * Props for BaseWindow component
 */
export interface BaseWindowProps {
  /** Window name for identification */
  name?: string

  /** Window title */
  title?: string

  /** CSS classes for styling */
  cssClasses?: string[]

  /** Child components */
  children?: JSX.Element | JSX.Element[]

  /** Window anchor position */
  anchor?: number

  /** Window exclusivity */
  exclusivity?: Astal.Exclusivity

  /** Key mode for input handling */
  keymode?: Astal.Keymode

  /** Initial visibility */
  visible?: boolean

  /** Monitor to display on */
  gdkmonitor?: Gdk.Monitor

  /** Application instance */
  application?: typeof app

  /** Additional GTK window properties */
  [key: string]: any
}

/**
 * Base window component providing common window functionality
 * All Kotami windows should extend from this component
 */
export function BaseWindow({
  name = "window",
  title,
  cssClasses = ["window"],
  children,
  anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM,
  exclusivity = Astal.Exclusivity.NORMAL,
  keymode = Astal.Keymode.NONE,
  visible = true,
  gdkmonitor,
  application = app,
  ...props
}: BaseWindowProps) {
  return (
    <Astal.Window
      name={name}
      title={title}
      cssClasses={cssClasses}
      anchor={anchor}
      exclusivity={exclusivity}
      keymode={keymode}
      visible={visible}
      gdkmonitor={gdkmonitor}
      application={application}
      {...props}
    >
      {children}
    </Astal.Window>
  )
}
