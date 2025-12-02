import GObject, { register, property, signal } from "gnim/gobject"
import { User } from "./AuthService"

/**
 * Service for managing system users
 * Provides access to user information and user-related operations
 */
@register()
export class UserService extends GObject.Object {
  // Note: GObject properties don't support null, using class field instead
  currentUser: User | null = null

  @property(Array)
  availableUsers: User[] = []

  @property(Boolean)
  isLoading = false

  @signal()
  usersLoaded(users: User[]): void {}

  @signal()
  userSelected(user: User): void {}

  @signal()
  userAvatarChanged(user: User, avatar: string): void {}

  /**
   * Load available users from system
   */
  async loadUsers(): Promise<User[]> {
    if (this.isLoading) return this.availableUsers

    this.isLoading = true

    try {
      // TODO: Integrate with actual system user providers
      // For now, simulate loading
      await new Promise(resolve => setTimeout(resolve, 500))

      const users: User[] = [
        {
          name: "user",
          uid: 1000,
          gid: 1000,
          home: "/home/user",
          shell: "/bin/bash",
          realName: "Default User"
        },
        {
          name: "admin",
          uid: 1001,
          gid: 1001,
          home: "/home/admin",
          shell: "/bin/bash",
          realName: "Administrator"
        }
      ]

      this.availableUsers = users
      this.usersLoaded(users)

      return users
    } finally {
      this.isLoading = false
    }
  }

  /**
   * Select a user for authentication
   */
  selectUser(user: User) {
    this.currentUser = user
    this.userSelected(user)
  }

  /**
   * Get user by name
   */
  getUserByName(username: string): User | null {
    return this.availableUsers.find(user => user.name === username) || null
  }

  /**
   * Update user avatar
   */
  updateUserAvatar(user: User, avatarPath: string) {
    const updatedUser = { ...user, avatar: avatarPath }
    this.availableUsers = this.availableUsers.map(u =>
      u.name === user.name ? updatedUser : u
    )
    if (this.currentUser?.name === user.name) {
      this.currentUser = updatedUser
    }
    this.userAvatarChanged(updatedUser, avatarPath)
  }

  /**
   * Check if user exists
   */
  userExists(username: string): boolean {
    return this.availableUsers.some(user => user.name === username)
  }

  /**
   * Get default user (first in list)
   */
  getDefaultUser(): User | null {
    return this.availableUsers.length > 0 ? this.availableUsers[0] : null
  }

  /**
   * Clear current user selection
   */
  clearSelection() {
    this.currentUser = null
  }
}

// Singleton instance
let userServiceInstance: UserService | null = null

export const getUserService = () => {
  if (!userServiceInstance) {
    userServiceInstance = new UserService()
  }
  return userServiceInstance
}

// Hook-style API for components
export const useUserService = () => {
  return getUserService()
}
