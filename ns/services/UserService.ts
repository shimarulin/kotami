import GObject, { register, property, signal } from "gnim/gobject"
import { getAvailableUsers } from "@providers/users"
import { createImagePainitable } from "@utils/createImagePainitable"
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
      // Get users from system passwd file
      const passwdRecords = getAvailableUsers()

      // Convert PasswdRecord[] to User[] with avatar loading
      const users: User[] = passwdRecords.map(passwdRecord => {
        // Try to find user avatar
        const avatar = createImagePainitable(`/var/lib/AccountsService/icons/${passwdRecord.username}`) ||
                      createImagePainitable(`${passwdRecord.home}/.face`)

        return {
          name: passwdRecord.username,
          uid: passwdRecord.uid,
          gid: passwdRecord.gid,
          home: passwdRecord.home,
          shell: passwdRecord.shell,
          realName: passwdRecord.gecos.fullname || passwdRecord.username,
          avatar: avatar ? `/var/lib/AccountsService/icons/${passwdRecord.username}` ||
                          `${passwdRecord.home}/.face` : undefined
        }
      })

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
    // Auto-load users when service is first created
    userServiceInstance.loadUsers().catch(error => {
      console.error('Failed to load users:', error)
    })
  }
  return userServiceInstance
}

// Hook-style API for components
export const useUserService = () => {
  return getUserService()
}
