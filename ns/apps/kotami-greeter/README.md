# Kotami Greeter

A GTK-based [greetd](https://git.sr.ht/~kennylevinsen/greetd) greeter written in TypeScript using [AGS](https://github.com/aylur/ags) tools.

## Features

- Perform all login steps within the same screen
- Remembers and automatically selects the last authenticated user
- Remembers and automatically selects the last used session for each authenticated user
- Respects PAM faillock config (failed authentication attempts counter and unlock time)
