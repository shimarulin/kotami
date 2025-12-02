import { setConsoleLogDomain } from 'console'

import app from 'ags/gtk4/app'

import { AppLogDomain, APP_LOG_DOMAIN } from '@libs/log'
import { getAuthService, getUserService, getSessionService } from '../../services'
import SessionManagerScreen from '@widgets/SessionManagerScreen'

/**
 * Initialize greeter services
 * This sets up the global service instances for the greeter application
 */
function initializeGreeterServices() {
  // Initialize services - they will be singleton instances
  const authService = getAuthService()
  const userService = getUserService()
  const sessionService = getSessionService()

  // Setup service initialization
  console.log("Initializing greeter services...")

  // TODO: Initialize greetd connection
  // TODO: Load system users and sessions

  return {
    authService,
    userService,
    sessionService
  }
}

// Initialize services globally
const greeterServices = initializeGreeterServices()

// Start the application
app.start({
  instanceName: 'greeter',
  main() {
    setConsoleLogDomain(AppLogDomain.by_name(APP_LOG_DOMAIN.GREETER))

    // Create the main session manager screen
    SessionManagerScreen(app.get_monitors()[0])
  },
})
