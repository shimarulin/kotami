# System Patterns: Kotami

## Architecture Overview

Kotami follows a modern GObject-based architecture designed for type safety, reactivity, and native GTK integration. The system implements GObject services with decorators, reactive properties, and signal-based communication patterns.

## Core Architectural Patterns

### GObject Layered Architecture
```
Applications (AppBase + Context)
    ↓
Widgets (UI Components + Reactive Bindings)
    ↓
GObject Services (@register, @property, @signal)
    ↓
Providers (Data Access + Abstractions)
    ↓
Libraries (Core Utilities + GTK Integration)
```

### Component Organization
- **Applications**: Entry points extending AppBase with context providers
- **Widgets**: Complex UI components with GObject service integration
- **Components**: Base UI primitives (BaseWindow, BaseButton) with reactive styling
- **Services**: GObject classes with reactive properties and signal emissions
- **Providers**: Data access abstractions with async operations
- **Libraries**: Core utilities with GTK/GObject integration

## Key Design Decisions

### Reactive UI with GNOME JS
- Uses GJS (GNOME JavaScript) for GTK integration
- Implements reactive patterns through the GNIM library
- JSX syntax for declarative UI components

### IPC-Based Communication
- Greetd IPC for secure authentication
- Service-oriented architecture for component communication
- Async/await patterns for non-blocking operations

### Configuration-Driven Behavior
- Centralized configuration management
- Runtime configuration parsing and validation
- Environment-specific settings support

## Design Patterns

### GObject Service Pattern
```typescript
@register()
export class AuthService extends GObject.Object {
  @property(Boolean) isAuthenticated = false
  @property(String) currentUsername = ""

  @signal()
  authenticationSuccess(user: User): void {}

  // Methods with business logic
  async authenticate(username: string, password: string) {
    // Implementation
    this.authenticationSuccess(user)
  }
}
```
GObject services provide reactive state management, signal-based communication, and automatic lifecycle management.

### Reactive Property Pattern
```typescript
// GObject reactive properties
@property(Boolean) isLoading = false
@property(String) errorMessage = ""

// Reactive bindings in components
const loading = service.bind("is-loading")
const error = service.bind("error-message")
```
Properties automatically emit change signals and support reactive bindings.

### Context Provider Pattern
```typescript
// Application-specific contexts
export const GreeterContext = createContext<GreeterServices>()

// Provider components
export function GreeterProvider({ children }) {
  return (
    <GreeterContext.Provider value={services}>
      {children}
    </GreeterContext.Provider>
  )
}
```
Contexts provide type-safe service injection for application components.

### Service Locator Pattern
Services are registered and accessed through a centralized service locator, enabling loose coupling between components.

### Provider Pattern
Data access is abstracted through provider interfaces, allowing different implementations for different environments.

### Factory Pattern
Complex object creation is handled through factory functions, particularly for session and user management.

### Observer Pattern
UI components react to state changes through reactive bindings and signal connections.

## Component Relationships

### Authentication Flow
```
User Selection → Password Input → PAM Validation → Session Creation → Login Success
```

### Session Management
```
Session Discovery → Session Selection → Environment Setup → Process Launch
```

### UI Composition
```
App Entry → Widget Assembly → Component Integration → Service Binding
```

## GObject Implementation Patterns

### Decorator Usage
```typescript
@register()  // Registers class with GObject type system
class MyService extends GObject.Object {

  @property(Boolean)  // Creates reactive boolean property
  isActive = false

  @property(String)   // Creates reactive string property
  status = "idle"

  @signal()           // Defines signal that can be emitted
  stateChanged(newState: string): void {}
}
```

### Lifecycle Management with onCleanup
```typescript
import { onCleanup } from "gnim"

function MyWidget() {
  // GObject signal connections
  const signalId = service.connect("state-changed", callback)
  onCleanup(() => service.disconnect(signalId))

  // Timers and intervals
  const interval = setInterval(update, 1000)
  onCleanup(() => clearInterval(interval))

  // Custom cleanup
  onCleanup(() => {
    // Cleanup logic
  })
}
```

### Reactive Bindings
```typescript
// Service property binding
const isLoading = service.bind("is-loading")
const errorMessage = service.bind("error-message")

// In JSX
return (
  <box>
    <spinner visible={isLoading} />
    <label label={errorMessage} />
  </box>
)
```

### Signal Handling
```typescript
// Connecting to signals
service.connect("authentication-success", (service, user) => {
  console.log("User authenticated:", user.name)
})

// Emitting signals
this.authenticationSuccess(user)
```

## Critical Implementation Paths

### Login Sequence
1. Greetd IPC initialization
2. User list retrieval from system
3. Session list enumeration
4. UI rendering with reactive state
5. Authentication attempt via PAM
6. Session launch on success

### Status Bar Updates
1. System service polling
2. State aggregation
3. UI updates via reactive bindings
4. Event handling for user interactions

### Command Palette Operation
1. Input capture and filtering
2. Application/service discovery
3. Result presentation
4. Execution delegation

## Error Handling Patterns

### Graceful Degradation
- Fallback UI for missing services
- Default values for configuration errors
- User-friendly error messages

### Logging Hierarchy
- Debug level for development
- Info level for normal operation
- Error level for critical issues
- Systemd integration for production logging

## Performance Considerations

### Lazy Loading
- Components loaded on demand
- Service initialization deferred until needed
- Resource cleanup on component destruction

### Memory Management
- Proper disposal of GTK objects
- Reactive binding cleanup
- Timer and event handler management

### Rendering Optimization
- Minimal DOM updates through reactivity
- Efficient list rendering with virtualization
- CSS optimization for smooth animations
