// GObject-based services
export { SessionManagerScreenService, getSessionManagerScreenService, useSessionManagerScreenService } from "./SessionManagerScreenService"
export { AuthService, getAuthService, useAuthService, type User } from "./AuthService"
export { UserService, getUserService, useUserService } from "./UserService"
export { SessionService, getSessionService, useSessionService, type Session } from "./SessionService"

// Legacy services (to be migrated)
// export * from "./legacy-services"
