# Project Brief: Kotami

## Overview
Kotami is a modern Wayland desktop shell and greeter system built using the Astal/AGS framework. It provides a complete desktop environment experience with login management, status bar, command palette, and overlay windowing capabilities.

## Core Requirements
- **Login Management**: Secure user authentication and session initiation via greetd IPC
- **Desktop Shell**: Full Wayland compositor integration with niri
- **UI Components**: Status bar, command palette, and overlay windows
- **Session Management**: User session selection and management
- **GTK Integration**: Native GTK4/Adwaita UI components

## Project Goals
1. Provide a polished, modern desktop shell experience
2. Ensure secure authentication through PAM integration
3. Deliver responsive and accessible user interfaces
4. Maintain compatibility with Wayland standards
5. Support extensibility through modular architecture

## Success Criteria
- Successful user login and session management
- Smooth desktop shell operation
- Consistent GTK/Adwaita theming
- Reliable performance with Wayland compositors
- Extensible component architecture

## Constraints
- Must integrate with greetd login manager
- Requires GTK4 and Astal framework dependencies
- Targets Linux systems with Wayland support
- Built with TypeScript and GJS runtime

## Stakeholders
- End users requiring a desktop environment
- System administrators managing login security
- Developers extending the shell functionality
