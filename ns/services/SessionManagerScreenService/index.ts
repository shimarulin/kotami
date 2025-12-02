import GObject, { register, property, signal } from "gnim/gobject"

/**
 * Service for managing SessionManagerScreen state and behavior
 * Handles window visibility and user interactions
 */
@register()
export class SessionManagerScreenService extends GObject.Object {
  @property(Boolean)
  windowVisible = false

  @property(Boolean)
  isLoading = false

  @property(String)
  errorMessage = ""

  @signal()
  windowShown(): void {}

  @signal()
  windowHidden(): void {}

  @signal()
  loadingStarted(): void {}

  @signal()
  loadingFinished(): void {}

  /**
   * Show the session manager window
   */
  showWindow() {
    this.windowVisible = true
    this.windowShown()
  }

  /**
   * Hide the session manager window
   */
  hideWindow() {
    this.windowVisible = false
    this.windowHidden()
  }

  /**
   * Toggle window visibility
   */
  toggleWindow() {
    if (this.windowVisible) {
      this.hideWindow()
    } else {
      this.showWindow()
    }
  }

  /**
   * Start loading state
   */
  startLoading() {
    this.isLoading = true
    this.loadingStarted()
  }

  /**
   * Stop loading state
   */
  stopLoading() {
    this.isLoading = false
    this.loadingFinished()
  }

  /**
   * Set error message
   */
  setError(error: string | null) {
    this.errorMessage = error || ""
  }

  /**
   * Clear error message
   */
  clearError() {
    this.errorMessage = ""
  }

  /**
   * Check if there's an error
   */
  hasError(): boolean {
    return this.errorMessage.length > 0
  }
}

// Singleton instance for backward compatibility
let serviceInstance: SessionManagerScreenService | null = null

export const getSessionManagerScreenService = () => {
  if (!serviceInstance) {
    serviceInstance = new SessionManagerScreenService()
  }
  return serviceInstance
}

// Hook-style API for React components
export const useSessionManagerScreenService = () => {
  return getSessionManagerScreenService()
}
