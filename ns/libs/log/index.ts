import Gio from 'gi://Gio'

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return String(error)
}

// Путь к файлу
const LOG_FILE_PATH = '/tmp/greetd_log'

const file = Gio.File.new_for_path(LOG_FILE_PATH)

// // Проверка существования файла
// if (!file.query_exists(null)) {
//   try {
//     // Получаем родительский каталог
//     const parentDir = file.get_parent()

//     // Рекурсивно создаем родительские каталоги (если их нет)
//     if (parentDir && !parentDir.query_exists(null)) {
//       parentDir.make_directory_with_parents(null)
//     }

//     // Создаем файл (пустой)
//     const outputStream = file.create(Gio.FileCreateFlags.NONE, null)
//     outputStream.close(null)

//     log('Файл и каталоги созданы: ' + LOG_FILE_PATH)
//   }
//   catch (e) {
//     logError(e)
//   }
// }
// else {
//   log('Файл уже существует: ' + LOG_FILE_PATH)
// }
// Открываем файл для добавления (создаем, если не существует)
const stream = file.append_to(Gio.FileCreateFlags.NONE, null)

// Создаем поток для записи данных
const dos = new Gio.DataOutputStream({
  base_stream: stream,
  close_base_stream: true,
})

// Закрываем поток
// dos.close(null)

export const toLog = (msg: string) => {
// Записываем содержимое в файл
  dos.put_string(`${msg}\n`, null)
}
