import GObject, { register, property, signal } from "gnim/gobject"

/**
 * Desktop session information
 */
export interface Session {
  name: string
  exec: string
  comment?: string
  hidden?: boolean
}

/**
 * Service for managing desktop sessions
 * Provides access to available sessions and session operations
 */
@register()
export class SessionService extends GObject.Object {
  @property(Array)
  availableSessions: Session[] = []

  // Note: GObject properties don't support null, using class field instead
  selectedSession: Session | null = null

  @property(Boolean)
  isLoading = false

  @signal()
  sessionsLoaded(sessions: Session[]): void {}

  @signal()
  sessionSelected(session: Session): void {}

  /**
   * Load available desktop sessions
   */
  async loadSessions(): Promise<Session[]> {
    if (this.isLoading) return this.availableSessions

    this.isLoading = true

    try {
      // TODO: Integrate with actual session providers (XDG, /usr/share/xsessions, etc.)
      // For now, simulate loading common sessions
      await new Promise(resolve => setTimeout(resolve, 300))

      const sessions: Session[] = [
        {
          name: "GNOME",
          exec: "gnome-session",
          comment: "GNOME Desktop Environment"
        },
        {
          name: "KDE Plasma",
          exec: "startkde",
          comment: "KDE Plasma Desktop"
        },
        {
          name: "XFCE",
          exec: "xfce4-session",
          comment: "XFCE Desktop Environment"
        },
        {
          name: "i3",
          exec: "i3",
          comment: "i3 Window Manager"
        },
        {
          name: "Sway",
          exec: "sway",
          comment: "Sway Wayland Compositor"
        }
      ]

      this.availableSessions = sessions
      this.sessionsLoaded(sessions)

      // Auto-select first session if none selected
      if (!this.selectedSession && sessions.length > 0) {
        this.selectSession(sessions[0])
      }

      return sessions
    } finally {
      this.isLoading = false
    }
  }

  /**
   * Select a session for login
   */
  selectSession(session: Session) {
    this.selectedSession = session
    this.sessionSelected(session)
  }

  /**
   * Get session by name
   */
  getSessionByName(name: string): Session | null {
    return this.availableSessions.find(session => session.name === name) || null
  }

  /**
   * Get default session (first non-hidden)
   */
  getDefaultSession(): Session | null {
    return this.availableSessions.find(session => !session.hidden) || null
  }

  /**
   * Get visible sessions (non-hidden)
   */
  getVisibleSessions(): Session[] {
    return this.availableSessions.filter(session => !session.hidden)
  }

  /**
   * Check if session exists
   */
  sessionExists(name: string): boolean {
    return this.availableSessions.some(session => session.name === name)
  }

  /**
   * Launch selected session
   * This would typically be called after successful authentication
   */
  async launchSession(): Promise<boolean> {
    if (!this.selectedSession) {
      throw new Error("No session selected")
    }

    // TODO: Integrate with greetd to launch the session
    console.log(`Launching session: ${this.selectedSession.name}`)

    // For now, just simulate success
    return true
  }

  /**
   * Clear session selection
   */
  clearSelection() {
    this.selectedSession = null
  }
}

// Singleton instance
let sessionServiceInstance: SessionService | null = null

export const getSessionService = () => {
  if (!sessionServiceInstance) {
    sessionServiceInstance = new SessionService()
  }
  return sessionServiceInstance
}

// Hook-style API for components
export const useSessionService = () => {
  return getSessionService()
}
