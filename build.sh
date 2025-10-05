#!/bin/bash

# Основной каталог с приложениями
apps_dir="./ns/apps"

# Каталог для вывода
output_dir="./output"

# Проверка существования основного каталога
if [ ! -d "$apps_dir" ]; then
    echo "Ошибка: Каталог $apps_dir не существует!" >&2
    exit 1
fi

# Создание каталога для результатов (если не существует)
mkdir -p "$output_dir"

# Поиск подкаталогов и обработка каждого
find "$apps_dir" -mindepth 1 -maxdepth 1 -type d -print0 | while IFS= read -r -d '' dir; do
    # Получение имени подкаталога без пути
    subdir=$(basename "$dir")

    # Формирование путей для входных файлов
    input_dir="./ns/apps/$subdir"
    input_file_ts="$input_dir/app.ts"
    input_file_tsx="$input_dir/app.tsx"
    output_path="./output/$subdir"

    # Определение, какой файл использовать
    if [ -f "$input_file_ts" ]; then
        input_file="$input_file_ts"
    elif [ -f "$input_file_tsx" ]; then
        input_file="$input_file_tsx"
    else
        echo "Предупреждение: Не найден app.ts или app.tsx в $input_dir, пропускаем $subdir" >&2
        continue
    fi

    # Выполнение команды bundle
    echo "Обработка: $subdir (файл: $(basename "$input_file"))"
    ags bundle "$input_file" "$output_path"

    # Проверка успешности выполнения команды
    if [ $? -eq 0 ]; then
        echo "Успешно: $subdir"
    else
        echo "Ошибка: Не удалось обработать $subdir" >&2
    fi
done
