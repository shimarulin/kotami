# Technical Context: Kotami

## Technology Stack

### Core Runtime
- **GJS (GNOME JavaScript)**: JavaScript runtime for GTK applications
- **GTK 4.0**: Modern GUI toolkit for native Linux applications
- **TypeScript**: Type-safe JavaScript with JSX support
- **GNOME Libraries**: Libadwaita for modern UI components

### Framework & Libraries
- **Astal/AGS**: Desktop shell framework providing Wayland integration
- **GNIM**: Reactive programming library for GTK
- **Greetd IPC**: Secure inter-process communication for login management
- **PAM (Pluggable Authentication Modules)**: System authentication framework

### Development Tools
- **ESLint**: Code linting and style enforcement
- **TypeScript Compiler**: Type checking and compilation
- **Prettier**: Code formatting (via ESLint integration)
- **Git**: Version control with conventional commits

## Development Environment

### Prerequisites
- Linux distribution with Wayland support
- Node.js for development tooling
- GTK4 development libraries
- Astal framework and dependencies

### Build System
- **Custom Build Script**: `./build.sh` handles compilation and bundling
- **Type Generation**: `ags types -u -d .` for GTK type definitions
- **NPM Scripts**: Preinstall and build hooks

### Project Structure
```
ns/                     # Main source directory
├── apps/              # Application entry points
├── components/        # Reusable UI components
├── widgets/           # Complex UI assemblies
├── services/          # Business logic services
├── providers/         # Data access providers
├── libs/              # Shared libraries
└── utils/             # Utility functions
```

## Technical Constraints

### Platform Requirements
- **Wayland Compositor**: Requires niri or compatible Wayland compositor
- **GTK4 Runtime**: Must have GTK 4.0+ installed
- **GJS Runtime**: GNOME JavaScript runtime environment
- **SystemD**: Logging and service management integration

### Authentication Requirements
- **Greetd**: Must be configured as login manager
- **PAM**: Proper PAM configuration for user authentication
- **System Users**: Access to `/etc/passwd` and user management

### Performance Constraints
- **Memory Usage**: Lightweight for system-critical login component
- **Startup Time**: Fast initialization for boot process
- **Responsiveness**: Smooth UI interactions under load

## Dependencies

### Runtime Dependencies
- `astal/*`: Core Astal libraries for system integration
- `gtk4`: GUI framework
- `libadwaita`: Modern GTK components
- `greetd`: Login manager IPC
- `pam`: Authentication modules

### Development Dependencies
- `@eslint/*`: Linting and code quality
- `@stylistic/eslint-plugin`: Code formatting
- `@types/*`: TypeScript type definitions
- `typescript-eslint`: TypeScript-specific linting

## Tool Usage Patterns

### Code Quality
- **ESLint Configuration**: Strict rules in `eslint.config.mts`
- **TypeScript**: Strict mode with JSX support
- **Import Resolution**: TypeScript-based module resolution

### Build Process
- **Type Generation**: Automatic GTK type definitions
- **Compilation**: TypeScript to JavaScript conversion
- **Bundling**: Custom build script for distribution

### Development Workflow
- **Hot Reload**: AGS development server for live updates
- **Debugging**: GJS console logging with custom domains
- **Testing**: Manual testing with development builds

## Integration Points

### System Services
- **Greetd**: Login session management
- **PAM**: User authentication
- **SystemD**: Logging and service supervision
- **D-Bus**: Inter-process communication

### Desktop Environment
- **Niri**: Wayland compositor integration
- **GTK Theme**: Adwaita theming system
- **Accessibility**: GTK accessibility framework

### External Tools
- **App Launchers**: Integration with desktop applications
- **Session Managers**: Support for multiple desktop sessions
- **Configuration Files**: System-wide and user-specific settings
