import GObject, { register, property, signal } from "gnim/gobject"

/**
 * User information interface
 */
export interface User {
  name: string
  uid: number
  gid: number
  home: string
  shell: string
  realName?: string
  avatar?: string
}

/**
 * Authentication service for managing user login and session
 * Integrates with greetd and PAM for secure authentication
 */
@register()
export class AuthService extends GObject.Object {
  @property(Boolean)
  isAuthenticated = false

  @property(Boolean)
  isAuthenticating = false

  @property(String)
  currentUsername = ""

  // Note: GObject properties don't support null, using class field instead
  currentUser: User | null = null

  @property(String)
  errorMessage = ""

  @signal()
  authenticationStarted(username: string): void {}

  @signal()
  authenticationSuccess(user: User): void {}

  @signal()
  authenticationFailed(error: string): void {}

  @signal()
  loggedOut(): void {}

  /**
   * Start authentication process for a user
   */
  authenticate(username: string, password: string): Promise<boolean> {
    if (this.isAuthenticating) {
      return Promise.resolve(false)
    }

    this.isAuthenticating = true
    this.currentUsername = username
    this.errorMessage = ""
    this.authenticationStarted(username)

    return this.performAuthentication(username, password)
  }

  /**
   * Perform actual authentication (to be implemented with greetd/PAM)
   */
  private async performAuthentication(username: string, password: string): Promise<boolean> {
    try {
      // TODO: Integrate with greetd IPC
      // For now, simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simulate successful authentication
      const user: User = {
        name: username,
        uid: 1000,
        gid: 1000,
        home: `/home/${username}`,
        shell: "/bin/bash",
        realName: username
        // avatar: undefined (will be added when user has avatar)
      }

      this.isAuthenticated = true
      this.isAuthenticating = false
      this.currentUser = user
      this.authenticationSuccess(user)

      return true

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Authentication failed"
      this.isAuthenticated = false
      this.isAuthenticating = false
      this.errorMessage = errorMsg
      this.authenticationFailed(errorMsg)

      return false
    }
  }

  /**
   * Logout current user
   */
  logout() {
    this.isAuthenticated = false
    this.currentUsername = ""
    this.currentUser = null
    this.errorMessage = ""
    this.loggedOut()
  }

  /**
   * Get available users (to be implemented with system integration)
   */
  async getAvailableUsers(): Promise<User[]> {
    // TODO: Integrate with /etc/passwd or user providers
    // For now, return mock users
    return [
      {
        name: "user",
        uid: 1000,
        gid: 1000,
        home: "/home/user",
        shell: "/bin/bash",
        realName: "Default User"
      }
    ]
  }

  /**
   * Clear error message
   */
  clearError() {
    this.errorMessage = ""
  }

  /**
   * Check if user is currently authenticated
   */
  get isLoggedIn(): boolean {
    return this.isAuthenticated
  }
}

// Singleton instance
let authServiceInstance: AuthService | null = null

export const getAuthService = () => {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService()
  }
  return authServiceInstance
}

// Hook-style API for components
export const useAuthService = () => {
  return getAuthService()
}
