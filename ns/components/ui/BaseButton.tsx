import { createComputed } from "gnim"
import { Gtk } from "ags/gtk4"

/**
 * Props for BaseButton component
 */
export interface BaseButtonProps {
  /** Button label text */
  children?: string | JSX.Element | JSX.Element[]

  /** Button label (alternative to children) */
  label?: string

  /** CSS classes for styling */
  cssClasses?: string[]

  /** Click handler */
  onClicked?: () => void

  /** Button sensitivity (enabled/disabled) */
  sensitive?: boolean

  /** Loading state */
  loading?: boolean

  /** Button variant for styling */
  variant?: "primary" | "secondary" | "danger" | "ghost"

  /** Button size */
  size?: "small" | "medium" | "large"

  /** Additional GTK button properties */
  [key: string]: any
}

/**
 * Base button component providing common button functionality
 * All Kotami buttons should extend from this component
 */
export function BaseButton({
  children,
  label,
  cssClasses = ["button"],
  onClicked,
  sensitive = true,
  loading = false,
  variant = "primary",
  size = "medium",
  ...props
}: BaseButtonProps) {
  // Compute CSS classes (for reactive usage, these would be Accessors)
  const buttonCssClasses = ["button", `button-${variant}`, `button-${size}`]
  if (loading) buttonCssClasses.push("loading")

  // Determine button content
  const buttonContent = children || label

  return (
    <Gtk.Button
      cssClasses={buttonCssClasses}
      onClicked={onClicked}
      sensitive={sensitive && !loading}
      {...props}
    >
      {loading ? (
        <Gtk.Spinner />
      ) : (
        buttonContent && (
          typeof buttonContent === "string" ? (
            <Gtk.Label label={buttonContent} />
          ) : (
            buttonContent
          )
        )
      )}
    </Gtk.Button>
  )
}
