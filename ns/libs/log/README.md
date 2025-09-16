# @libs/log

## How to use

### Setup app

```ts
import { setConsoleLogDomain } from 'console'
import { AppLogDomain, APP_LOG_DOMAIN } from '@libs/log'

setConsoleLogDomain(AppLogDomain.by_name(APP_LOG_DOMAIN.GREETER))
```
