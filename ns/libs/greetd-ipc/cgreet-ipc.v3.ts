import Gio from 'gi://Gio'
import GLib from 'gi://GLib'

// Промсифицируем метод read_bytes_async для InputStream
Gio._promisify(Gio.InputStream.prototype, 'read_bytes_async', 'read_bytes_finish')

const _namespace = {
  AstalGreetTS: {
    /**
     * Shorthand for creating a session, posting the password,
     * and starting the session with the given `cmd`
     * which is parsed with [func@GLib.shell_parse_argv].
     */
    async login(username: string, password: string, cmd: string): Promise<void> {
      return this.login_with_env(username, password, cmd, [])
    },

    /**
     * Same as [func@AstalGreet.login] but allow for setting additional env
     * in the form of `name=value` pairs.
     */
    async login_with_env(
      username: string,
      password: string,
      cmd: string,
      env: string[],
    ): Promise<void> {
      let argv: string[] = []
      try {
        // Правильный вызов GLib.shell_parse_argv
        const [success, parsed_argv] = GLib.shell_parse_argv(cmd)
        if (success && parsed_argv) {
          argv = parsed_argv
        }
        else {
          throw new Error('Failed to parse command')
        }
      }
      catch (e) {
        // Создание GLib.Error с правильными параметрами
        throw new GLib.Error({
          domain: GLib.LOG_DOMAIN,
          code: 1, // Используем произвольный код ошибки
          message: `Failed to parse command: ${e instanceof Error ? e.message : String(e)}`,
        })
      }

      try {
        await new CreateSession(username).send()
        await new PostAuthMessage(password).send()
        await new StartSession(argv, env).send()
      }
      catch (err) {
        await new CancelSession().send()
        throw err
      }
    },
  },
}

abstract class Request {
  protected abstract get type_name(): string

  private serialize(): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {}
    // Копируем только собственные свойства, исключая унаследованные
    for (const [key, value] of Object.entries(this)) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.hasOwnProperty(key)) {
        data[key] = value
      }
    }
    data.type = this.type_name
    return JSON.stringify(data)
  }

  private bytes_to_int(bytes: GLib.Bytes): number {
    const data = bytes.get_data()
    let value = 0
    if (data) {
      for (let i = 0; i < data.length; i++) {
        value = (value << 8) | data[i]
      }
    }
    return value
  }

  async send(): Promise<Response> {
    const sock = GLib.getenv('GREETD_SOCK')
    if (!sock) {
      throw new Gio.IOErrorEnum({
        code: Gio.IOErrorEnum.NOT_FOUND,
        message: 'greetd socket not found',
      })
    }

    const client = new Gio.SocketClient()
    const addr = new Gio.UnixSocketAddress({ path: sock })
    const conn = client.connect(addr, null)
    const payload = this.serialize()
    const ostream = new Gio.DataOutputStream({
      base_stream: conn.output_stream,
      byte_order: Gio.DataStreamByteOrder.HOST_ENDIAN,
    })

    ostream.put_int32(payload.length, null)
    ostream.put_string(payload, null)
    ostream.close(null)

    const istream = conn.input_stream
    const response_head = await istream.read_bytes_async(4, GLib.PRIORITY_DEFAULT, null)
    const response_length = this.bytes_to_int(response_head)
    const response_body = await istream.read_bytes_async(response_length, GLib.PRIORITY_DEFAULT, null)

    conn.close(null)

    const response_data = response_body.get_data()
    if (!response_data) {
      throw new Gio.IOErrorEnum({
        code: Gio.IOErrorEnum.INVALID_DATA,
        message: 'Empty response from server',
      })
    }

    const response_str = new TextDecoder().decode(response_data)
    const response_obj = JSON.parse(response_str)

    switch (response_obj.type) {
      case 'success': return new Success(response_obj)
      case 'error': return new ErrorResponse(response_obj)
      case 'auth_message': return new AuthMessage(response_obj)
      default: throw new Gio.IOErrorEnum({
        code: Gio.IOErrorEnum.NOT_FOUND,
        message: 'unknown response type',
      })
    }
  }
}

class CreateSession extends Request {
  protected get type_name(): string { return 'create_session' }
  username: string

  constructor(username: string) {
    super()
    this.username = username
  }
}

class PostAuthMessage extends Request {
  protected get type_name(): string { return 'post_auth_message_response' }
  response: string

  constructor(response: string) {
    super()
    this.response = response
  }
}

class StartSession extends Request {
  protected get type_name(): string { return 'start_session' }
  cmd: string[]
  env: string[]

  constructor(cmd: string[], env: string[] = []) {
    super()
    this.cmd = cmd
    this.env = env
  }
}

class CancelSession extends Request {
  protected get type_name(): string { return 'cancel_session' }
}

abstract class Response {}

class Success extends Response {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  constructor(obj: any) {
    super()
  }
}

// Переименовали класс, чтобы избежать конфликта с встроенным Error
class ErrorResponse extends Response {
  static readonly TYPE = 'error'

  error_type: ErrorType
  description: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(obj: any) {
    super()
    this.error_type = ErrorType.from_string(obj.error_type)
    this.description = obj.description
  }
}

// Заменили enum на класс со статическими методами
class ErrorType {
  static AUTH_ERROR = 'AUTH_ERROR'
  static ERROR = 'ERROR'

  static from_string(str: string): string {
    switch (str) {
      case 'auth_error': return ErrorType.AUTH_ERROR
      case 'error': return ErrorType.ERROR
      default: throw new Gio.IOErrorEnum({
        code: Gio.IOErrorEnum.FAILED,
        message: `unknown error_type: ${str}`,
      })
    }
  }
}

class AuthMessage extends Response {
  static readonly TYPE = 'auth_message'

  message_type: AuthMessageType
  message: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(obj: any) {
    super()
    this.message_type = AuthMessageType.from_string(obj.auth_message_type)
    this.message = obj.auth_message
  }
}

// Заменили enum на класс со статическими методами
class AuthMessageType {
  static VISIBLE = 'VISIBLE'
  static SECRET = 'SECRET'
  static INFO = 'INFO'
  static ERROR = 'ERROR'

  static from_string(str: string): string {
    switch (str) {
      case 'visible': return AuthMessageType.VISIBLE
      case 'secret': return AuthMessageType.SECRET
      case 'info': return AuthMessageType.INFO
      case 'error': return AuthMessageType.ERROR
      default: throw new Gio.IOErrorEnum({
        code: Gio.IOErrorEnum.FAILED,
        message: `unknown message_type: ${str}`,
      })
    }
  }
}

export default _namespace
