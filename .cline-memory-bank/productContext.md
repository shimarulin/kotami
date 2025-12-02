# Product Context: Kotami

## Why Kotami Exists

Traditional Linux desktop environments often lack the polish and integration needed for modern Wayland compositors. Kotami addresses this gap by providing a purpose-built desktop shell that seamlessly integrates with greetd and niri, offering users a cohesive and secure login experience.

## Problems Solved

### Desktop Environment Fragmentation
- **Problem**: Linux desktop environments are often bloated or don't integrate well with modern Wayland compositors
- **Solution**: Kotami provides a lightweight, focused shell specifically designed for Wayland workflows

### Login Management Complexity
- **Problem**: Setting up secure login managers with proper PAM integration can be complex
- **Solution**: Built-in greetd IPC integration with simplified configuration

### UI Consistency Issues
- **Problem**: Inconsistent theming and UI patterns across desktop components
- **Solution**: Unified GTK4/Adwaita design system throughout all components

### Limited Customization
- **Problem**: Desktop shells often lack extensibility for custom workflows
- **Solution**: Modular architecture allowing easy addition of new components and features

## How It Works

### User Journey
1. **System Boot**: Greetd launches Kotami greeter
2. **User Selection**: Carousel interface for user account selection
3. **Authentication**: Secure password entry with PAM integration
4. **Session Selection**: Choose from available desktop sessions
5. **Login**: Authenticate and launch selected session
6. **Desktop Operation**: Status bar and command palette provide ongoing interaction

### Core Components
- **Greeter**: Login interface with user/session management
- **Status Bar**: System information and quick actions
- **Command Palette**: Application launcher and system commands
- **Overlay Windows**: Modal dialogs and system notifications

## User Experience Goals

### Intuitive Interaction
- Familiar GTK/Adwaita patterns for Linux users
- Keyboard-driven workflows for power users
- Touch-friendly interfaces where appropriate

### Performance First
- Lightweight and responsive
- Minimal resource usage
- Fast startup and session switching

### Accessibility
- Screen reader support through GTK accessibility
- High contrast mode compatibility
- Keyboard navigation for all features

### Security Conscious
- Secure authentication flows
- No credentials stored in memory
- Proper PAM integration for enterprise environments

## Target Users

### Primary Users
- Linux enthusiasts using Wayland compositors
- System administrators needing secure login management
- Developers requiring customizable desktop environments

### Secondary Users
- General Linux users seeking alternatives to heavy DEs
- Organizations requiring branded login experiences
- Users migrating from X11 to Wayland environments
