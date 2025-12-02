import { createContext } from "gnim"
import { AuthService, UserService, SessionService } from "../../../services"

/**
 * PAM authentication result
 */
export interface PAMResult {
  success: boolean
  message?: string
}

/**
 * Greeter context interface - services available to greeter components
 */
export interface GreeterContextType {
  authService: AuthService
  userService: UserService
  sessionService: SessionService
  // TODO: Add when implemented
  // pamService: PAMService
}

/**
 * Context for greeter application components
 * Provides access to authentication and user management services
 */
export const GreeterContext = createContext<GreeterContextType>(null as any)

// Hook for using greeter context in components
export function useGreeter() {
  const context = GreeterContext.use()
  if (!context) {
    throw new Error("useGreeter must be used within GreeterProvider")
  }
  return context
}
