# @libs/log

## How to use

### Setup app

```ts
import { setConsoleLogDomain } from 'console'
import app from 'ags/gtk4/app'
import { AppLogDomain, APP_LOG_DOMAIN } from '@libs/log'

app.start({
  main() {
    setConsoleLogDomain(AppLogDomain.by_name(APP_LOG_DOMAIN.GREETER))

    // application code
  },
})
```
