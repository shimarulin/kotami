/**
 * https://man.archlinux.org/man/greetd-ipc.7.en
 */

import Gio from 'gi://Gio'
import GLib from 'gi://GLib'

import { useLogger } from '@services/LoggerService'

Gio._promisify(Gio.InputStream.prototype, 'read_bytes_async', 'read_bytes_finish')

export const GreetdIPC = {
  /**
     * Shorthand for creating a session, posting the password,
     * and starting the session with the given `cmd`
     * which is parsed with [func@GLib.shell_parse_argv].
     */
  async login(username: string, password: string, cmd: string): Promise<void> {
    return this.login_with_env(username, password, cmd, [])
  },

  /**
     * Same as [GreetdIPC.login] but allow for setting additional env
     * in the form of `name=value` pairs.
     */
  async login_with_env(
    username: string,
    password: string,
    cmd: string,
    env: string[],
  ): Promise<void> {
    const { logger } = useLogger()
    let argv: string[] = []
    try {
      const [success, parsed_argv] = GLib.shell_parse_argv(cmd)
      if (success && parsed_argv) {
        argv = parsed_argv
      }
      else {
        throw new Error('Failed to parse command')
      }
    }
    catch (e) {
      logger.error(e)
      throw e
    }

    try {
      const createSessionResponse = await new CreateSession(username).send()
      logger.log(createSessionResponse)
      if (createSessionResponse instanceof AuthMessageResponse && createSessionResponse.auth_message_type === AuthMessageType.SECRET) {
        const authMessageResponse = await new PostAuthMessage(password).send()
        logger.log(authMessageResponse)

        if (authMessageResponse instanceof ErrorResponse) {
          throw new Error(`${authMessageResponse.description}`)
        }
        else if (authMessageResponse instanceof AuthMessageResponse) {
          throw new Error(`${authMessageResponse.auth_message}`)
        }
      }
      const startSessionResponse = await new StartSession(argv, env).send()
      logger.log(startSessionResponse)

      if (startSessionResponse instanceof ErrorResponse) {
        throw new Error(`${startSessionResponse.description}`)
      }
    }
    catch (err) {
      logger.error(err)
      await new CancelSession().send()
      throw err
    }
  },
}

/**
 * Base classes
 */
abstract class Request {
  protected abstract get type_name(): string

  private serialize(): string {
    const data: Record<string, string> = {}
    for (const [key, value] of Object.entries(this)) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
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
      case 'success': return new SuccessResponse()
      case 'error': return new ErrorResponse(response_obj)
      case 'auth_message': return new AuthMessageResponse(response_obj)
      default: throw new Gio.IOErrorEnum({
        code: Gio.IOErrorEnum.NOT_FOUND,
        message: 'unknown response type',
      })
    }
  }
}

abstract class Response {}

/**
 * Requests
 */
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

/**
 * Responses
 */
class SuccessResponse extends Response {
  static readonly TYPE = 'success'

  constructor() {
    super()
  }
}

type ErrorResponseType = 'error' | 'auth_error'
type ErrorResponseRecord = {
  error_type: ErrorResponseType
  description: string
}
class ErrorResponse extends Response {
  static readonly TYPE = 'error'

  error_type: ErrorType
  description: string

  constructor(record: ErrorResponseRecord) {
    super()
    this.error_type = ErrorType.from_string(record.error_type)
    this.description = record.description
  }
}

class ErrorType {
  static AUTH_ERROR = 'auth_error'
  static ERROR = 'error'

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

type AuthMessageResponseType = 'visible' | 'secret' | 'info' | 'error'
type AuthMessageResponseRecord = {
  auth_message_type: AuthMessageResponseType
  auth_message: string
}

class AuthMessageResponse extends Response {
  static readonly TYPE = 'auth_message'

  auth_message_type: AuthMessageType
  auth_message: string

  constructor(record: AuthMessageResponseRecord) {
    super()
    this.auth_message_type = AuthMessageType.from_string(record.auth_message_type)
    this.auth_message = record.auth_message
  }
}

class AuthMessageType {
  static VISIBLE = 'visible'
  static SECRET = 'secret'
  static INFO = 'info'
  static ERROR = 'error'

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
