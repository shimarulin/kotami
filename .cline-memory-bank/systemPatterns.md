# System Patterns: Kotami

## Architecture Overview

Kotami follows a modular, component-based architecture designed for extensibility and maintainability. The system is organized into distinct layers with clear separation of concerns.

## Core Architectural Patterns

### Layered Architecture
```
Apps (Entry Points)
    ↓
Widgets (UI Components)
    ↓
Services (Business Logic)
    ↓
Providers (Data Access)
    ↓
Libraries (Core Utilities)
```

### Component Organization
- **Apps**: Entry points and application-specific logic
- **Widgets**: Reusable UI components with complex interactions
- **Components**: Basic UI building blocks
- **Services**: Business logic and state management
- **Providers**: Data access and external integrations
- **Libraries**: Shared utilities and core functionality

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
