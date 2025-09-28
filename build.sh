#!/usr/bin/env bash

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

    # Формирование путей для входного и выходного файлов
    input_file="./ns/apps/$subdir/app.ts"
    output_path="./output/$subdir"

    # Проверка существования исходного файла
    if [ ! -f "$input_file" ]; then
        echo "Предупреждение: Файл $input_file не существует, пропускаем $subdir" >&2
        continue
    fi

    # Выполнение команды bundle
    echo "Обработка: $subdir"
    ags bundle "$input_file" "$output_path"
done
