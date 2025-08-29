import Gio from 'gi://Gio'
import GLib from 'gi://GLib'

// Вспомогательная функция для получения сообщения об ошибке
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

// Определяем интерфейсы для типизации
export interface DesktopFileInfo {
  filename: string
  path: string
  type: 'wayland' | 'x11'
  name: string | null
  exec: string | null
  comment: string | null
}

// Целевые каталоги
const directories: string[] = [
  '/usr/share/wayland-sessions',
  '/usr/share/xsessions',
]

// Функция для чтения и парсинга .desktop файлов с поддержкой локализации
export function parseDesktopFiles(): DesktopFileInfo[] {
  const sessions: DesktopFileInfo[] = []

  directories.forEach((dirPath) => {
    const dir = Gio.File.new_for_path(dirPath)
    try {
      // Проверяем существование каталога
      if (!dir.query_exists(null)) {
        log(`Каталог ${dirPath} не существует. Пропускаем.`)
        return
      }

      // Перечисляем файлы в каталоге
      const enumerator = dir.enumerate_children(
        'standard::name,standard::type',
        Gio.FileQueryInfoFlags.NONE,
        null,
      )

      let fileInfo
      while ((fileInfo = enumerator.next_file(null)) !== null) {
        const name = fileInfo.get_name()
        if (name.endsWith('.desktop')) {
          const file = dir.get_child(name)
          const keyFile = new GLib.KeyFile()

          try {
            // Загружаем файл с сохранением переводов
            keyFile.load_from_file(file.get_path()!, GLib.KeyFileFlags.KEEP_TRANSLATIONS)

            // Извлекаем информацию из секции [Desktop Entry]
            const sessionInfo: DesktopFileInfo = {
              filename: name,
              path: file.get_path()!,
              type: dirPath.includes('wayland') ? 'wayland' : 'x11',
              name: null,
              exec: null,
              comment: null,
            }

            // Получаем локализованные значения
            // Используем null для автоматического определения текущей локали
            try {
              sessionInfo.name = keyFile.get_locale_string('Desktop Entry', 'Name', null)
            }
            catch {
              sessionInfo.name = null
            }
            try {
              sessionInfo.exec = keyFile.get_string('Desktop Entry', 'Exec')
            }
            catch {
              sessionInfo.exec = null
            }
            try {
              sessionInfo.comment = keyFile.get_locale_string('Desktop Entry', 'Comment', null)
            }
            catch {
              sessionInfo.comment = null
            }

            sessions.push(sessionInfo)
          }
          catch (e) {
            // Используем вспомогательную функцию для безопасного получения сообщения об ошибке
            log(`Ошибка загрузки файла ${name}: ${getErrorMessage(e)}`)
          }
        }
      }
      enumerator.close(null)
    }
    catch (e) {
      // Используем вспомогательную функцию для безопасного получения сообщения об ошибке
      log(`Ошибка доступа к каталогу ${dirPath}: ${getErrorMessage(e)}`)
    }
  })

  return sessions
}

// // Использование
// const sessions = parseDesktopFiles()
// sessions.forEach((session) => {
//   log(`Найдена сессия: ${session.name} (${session.type})`)
//   log(`  Файл: ${session.filename}`)
//   log(`  Имя: ${session.name}`)
//   log(`  Команда: ${session.exec}`)
//   log(`  Описание: ${session.comment}`)
//   log('---')
// })
