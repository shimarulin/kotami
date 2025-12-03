## Brief overview
This set of guidelines establishes modern AGS/GNIM patterns for the Kotami project, ensuring consistent use of reactive programming APIs and GObject integration patterns.

## Reactive programming patterns
- Use modern createComputed producer syntax instead of deprecated array-based dependencies
- Prefer `createComputed(() => expression)` over `createComputed([deps], (values) => expression)`
- Example: `createComputed(() => userService.availableUsers.length > 1)` ✅
- Avoid: `createComputed([], () => userService.availableUsers.length > 1)` ❌

## GObject service integration
- Use GObject services with @register, @property, @signal decorators for reactive state management
- Implement singleton pattern for service instances using getService() functions
- Connect to GObject signals for reactive UI updates
- Example: `userService.connect('user-selected', callback)` ✅

## State management
- Use createState() for local component state
- Prefer GObject properties over local state for shared/cross-component state
- Implement reactive computed properties for derived state
- Example: `const isVisible = createComputed(() => service.property)` ✅

## Component lifecycle
- Use GObject automatic lifecycle management over manual dispose patterns
- Prefer reactive subscriptions over manual event cleanup
- Implement proper cleanup in onCleanup() hooks when needed
- Example: GObject services handle their own cleanup automatically ✅

## API design patterns
- Use hook-style APIs for service access (`useService()`)
- Implement both singleton and hook patterns for service consumption
- Provide TypeScript interfaces for all service contracts
- Example: `export const useAuthService = () => getAuthService()` ✅
