import GObject, { register, property } from "gnim/gobject"
import { createState } from "gnim"

/**
 * Base configuration interface for all Kotami applications
 */
export interface AppConfig {
  /** Unique instance name for the application */
  instanceName: string

  /** CSS styles for the application */
  css?: string

  /** GTK theme override */
  gtkTheme?: string

  /** Request handler for IPC communication */
  requestHandler?: (argv: string[], response: (response: string) => void) => void

  /** Main application render function */
  main: () => JSX.Element | void
}

/**
 * Base class for all Kotami applications providing common functionality
 */
@register()
export class AppBase extends GObject.Object {
  @property(String)
  instanceName = ""

  // Common services that all apps can use
  protected configService = null // Will be injected via context
  protected themeService = null  // Will be injected via context
  protected uiService = null     // Will be injected via context

  // Application configuration - set by subclasses
  protected appConfig: AppConfig = {
    instanceName: "",
    main: () => undefined
  }

  /**
   * Get the complete application configuration
   */
  getConfig(): AppConfig {
    return {
      instanceName: this.instanceName,
      css: this.appConfig.css,
      gtkTheme: this.appConfig.gtkTheme,
      requestHandler: this.appConfig.requestHandler || this.getDefaultRequestHandler(),
      main: () => this.main()
    }
  }

  /**
   * Main application logic - must be implemented by subclasses
   */
  protected main(): JSX.Element | void {
    throw new Error("Subclasses must implement main() method")
  }

  /**
   * Default request handler for basic IPC commands
   */
  private getDefaultRequestHandler() {
    return (argv: string[], response: (response: string) => void) => {
      const [cmd, ...args] = argv

      switch (cmd) {
        case 'ping':
          response('pong')
          break
        case 'status':
          response(`${this.instanceName}: running`)
          break
        case 'version':
          response('Kotami v1.0.0')
          break
        default:
          response(`unknown command: ${cmd}`)
      }
    }
  }

  /**
   * Setup common application lifecycle
   */
  protected setupLifecycle() {
    // Common initialization logic
    console.log(`Initializing ${this.instanceName} application`)
  }

  /**
   * Cleanup application resources
   */
  protected cleanup() {
    // Common cleanup logic
    console.log(`Cleaning up ${this.instanceName} application`)
  }
}
