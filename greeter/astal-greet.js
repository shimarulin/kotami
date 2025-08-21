const Astal = await Service.import("astal");
const Greet = await Service.import("greet");
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Gdk = imports.gi.Gdk;

// Конфигурация
const STATE_FILE = "/var/lib/greetd/laststate";
const SESSION_DIRS = [
    "/usr/share/wayland-sessions",
    "/usr/share/xsessions",
    "/usr/local/share/wayland-sessions",
    "/usr/local/share/xsessions"
];
const MAX_LOGIN_ATTEMPTS = 3;

// Функция для сохранения состояния
function saveLoginState(username, session) {
    try {
        const content = `${username}:${session}`;
        Utils.exec(`echo '${content}' | sudo tee ${STATE_FILE}`);
    } catch (e) {
        console.error("Ошибка сохранения состояния:", e);
    }
}

// Функция для загрузки состояния
function loadLoginState() {
    try {
        if (GLib.file_test(STATE_FILE, GLib.FileTest.EXISTS)) {
            const content = Utils.readFile(STATE_FILE)[0]?.trim();
            if (content && content.includes(":")) {
                const [username, session] = content.split(":");
                return { username, session };
            }
        }
    } catch (e) {
        console.error("Ошибка загрузки состояния:", e);
    }
    return { username: "", session: "" };
}

// Главный виджет
function LoginBox() {
    // Загружаем последнее состояние
    const lastState = loadLoginState();
    const selectedUser = Variable(lastState.username || "");
    const selectedSession = Variable(lastState.session || "");

    // Состояние ошибки
    const errorMessage = Variable("");
    const loginAttempts = Variable(0);
    const isLocked = Variable(false);
    const lockTimer = Variable(0);

    // Реактивная переменная для сессий
    const sessions = Variable(Greet.getSessions());

    // Функция обновления списка сессий
    const updateSessions = () => {
        sessions.value = Greet.getSessions();

        // Проверяем, что выбранная сессия всё ещё доступна
        if (!sessions.value.some(s => s.value === selectedSession.value)) {
            if (sessions.value.length > 0) {
                selectedSession.value = sessions.value[0].value;
                Greet.setSession(selectedSession.value);
            } else {
                selectedSession.value = "";
            }
        }
    };

    // Создаём мониторы для директорий сессий
    SESSION_DIRS.forEach(dir => {
        if (GLib.file_test(dir, GLib.FileTest.IS_DIR)) {
            const monitor = Gio.File.new_for_path(dir).monitor(
                Gio.FileMonitorFlags.NONE,
                null
            );

            monitor.connect("changed", (_, file, otherFile, eventType) => {
                // Обновляем при любых изменениях
                if (eventType !== Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
                    Utils.timeout(500, () => updateSessions());
                }
            });
        }
    });

    // Поле ввода пароля
    const passwordEntry = Widget.Entry({
        placeholder_text: "Введите пароль",
        visibility: false,
        sensitive: isLocked.bind().as(v => !v),
        on_accept: (self) => {
            attemptLogin(self.text);
        },
    });

    // Функция попытки входа
    const attemptLogin = (password) => {
        if (isLocked.value) return;

        if (!selectedUser.value) {
            errorMessage.value = "Ошибка: Выберите пользователя";
            return;
        }

        Greet.setUsername(selectedUser.value);
        Greet.setPassword(password);
        saveLoginState(selectedUser.value, selectedSession.value);
        Greet.login();
    };

    // Виджет списка пользователей
    const userList = Widget.Box({
        className: "user-list",
        homogeneous: true,
        spacing: 12,
        children: Greet.getUsers().map(user =>
            Widget.Button({
                className: `user-button ${user.username === lastState.username ? "selected-user" : ""}`,
                sensitive: isLocked.bind().as(v => !v),
                child: Widget.Box({
                    vertical: true,
                    spacing: 6,
                    children: [
                        Widget.Icon({
                            icon: user.icon || "avatar-default-symbolic",
                            size: 64,
                        }),
                        Widget.Label({
                            label: user.username,
                            max_width_chars: 10,
                            truncate: "end",
                        }),
                    ],
                }),
                on_clicked: () => {
                    if (isLocked.value) return;

                    selectedUser.value = user.username;
                    Greet.setUsername(user.username);
                    passwordEntry.grab_focus();
                    errorMessage.value = ""; // Сбрасываем ошибку при смене пользователя

                    // Обновляем выделение
                    userList.children.forEach(btn =>
                        btn.toggleClassName("selected-user", false)
                    );
                    this.toggleClassName("selected-user", true);
                },
            })
        ),
    });

    // Виджет выбора сессии
    const sessionSelector = Widget.Box({
        className: "session-selector",
        spacing: 8,
        children: [
            Widget.Label({
                label: "Сессия:",
                className: "session-label",
            }),
            // Динамический комбобокс, реагирующий на изменения sessions
            Widget.ComboBox({
                className: "session-combobox",
                sensitive: isLocked.bind().as(v => !v),
                setup: (self) => {
                    // Функция обновления списка
                    const updateCombo = () => {
                        const items = sessions.value.map(s => s.name);
                        self.items = items;

                        // Выбираем текущую сессию
                        const currentIndex = sessions.value.findIndex(
                            s => s.value === selectedSession.value
                        );
                        self.selected = currentIndex !== -1 ? currentIndex : 0;
                    };

                    // Обновляем при изменении sessions
                    sessions.connect("changed", updateCombo);

                    // Инициализация
                    updateCombo();
                },
                on_select: (_, id) => {
                    if (isLocked.value) return;
                    if (id !== -1 && sessions.value[id]) {
                        selectedSession.value = sessions.value[id].value;
                        Greet.setSession(selectedSession.value);
                        passwordEntry.grab_focus(); // Фокус на пароль после выбора сессии
                    }
                },
            }),
        ],
    });

    // Кнопка входа
    const loginButton = Widget.Button({
        label: "Войти",
        className: "login-button",
        sensitive: isLocked.bind().as(v => !v),
        onClicked: () => {
            attemptLogin(passwordEntry.text || "");
        },
    });

    // Виджет ошибки
    const errorDisplay = Widget.Box({
        className: "error-box",
        visible: errorMessage.bind().as(v => v !== ""),
        vertical: true,
        children: [
            Widget.Label({
                className: "error-label",
                label: errorMessage.bind(),
            }),
            Widget.Label({
                className: "attempts-label",
                visible: loginAttempts.bind().as(v => v > 0),
                label: loginAttempts.bind().as(v => `Попыток: ${v}/${MAX_LOGIN_ATTEMPTS}`),
            }),
            Widget.Label({
                className: "lock-timer",
                visible: isLocked.bind(),
                label: lockTimer.bind().as(v => `Повторить через: ${v} сек.`),
            }),
        ],
    });

    // Виджет выбранного пользователя
    const selectedUserDisplay = Widget.Box({
        className: "selected-user-box",
        spacing: 12,
        children: [
            Widget.Icon({
                icon: selectedUser.bind().as(u => {
                    const user = Greet.getUsers().find(user => user.username === u);
                    return user?.icon || "avatar-default-symbolic";
                }),
                size: 48,
            }),
            Widget.Label({
                className: "selected-user-label",
                label: selectedUser.bind().as(u => u || "Пользователь не выбран"),
            }),
        ],
    });

    // Обработка событий входа
    Greet.connect("login-failed", () => {
        // Увеличиваем счетчик попыток
        loginAttempts.value++;

        // Устанавливаем сообщение об ошибке
        errorMessage.value = "Ошибка: Неправильный пароль";

        // Сбрасываем пароль
        passwordEntry.text = "";
        passwordEntry.grab_focus();

        // Анимация ошибки
        passwordEntry.toggleClassName("error-input", true);
        Utils.timeout(500, () => passwordEntry.toggleClassName("error-input", false));

        // Проверяем блокировку
        if (loginAttempts.value >= MAX_LOGIN_ATTEMPTS) {
            isLocked.value = true;
            lockTimer.value = 30;

            // Запускаем таймер разблокировки
            const interval = setInterval(() => {
                lockTimer.value--;

                if (lockTimer.value <= 0) {
                    clearInterval(interval);
                    isLocked.value = false;
                    loginAttempts.value = 0;
                    errorMessage.value = "";
                }
            }, 1000);
        }
    });

    Greet.connect("login-success", () => {
        // Сбрасываем состояние ошибки при успешном входе
        errorMessage.value = "";
        loginAttempts.value = 0;
    });

    // Первоначальное обновление сессий
    updateSessions();

    // Автоматически выбираем первого пользователя, если не было сохранённого
    Utils.timeout(100, () => {
        if (!selectedUser.value && Greet.getUsers().length > 0) {
            const firstUser = Greet.getUsers()[0].username;
            selectedUser.value = firstUser;
            Greet.setUsername(firstUser);

            // Найти кнопку пользователя и выделить её
            const userButtons = userList.get_children();
            if (userButtons.length > 0) {
                userButtons[0].toggleClassName("selected-user", true);
            }
        }
    });

    // Главный контейнер
    const mainContainer = Widget.Box({
        vertical: true,
        spacing: 24,
        className: "login-box",
        children: [
            Widget.Label({
                label: "Выберите пользователя",
                className: "user-list-label",
            }),
            userList,
            Widget.Box({
                vertical: true,
                spacing: 16,
                children: [
                    Widget.Label({
                        label: "Выбранный пользователь:",
                        className: "selected-user-title",
                    }),
                    selectedUserDisplay,
                ],
            }),
            sessionSelector,
            passwordEntry,
            errorDisplay,
            loginButton,
        ],
    });

    // Глобальная обработка клавиш
    let keyHandlerId = null;

    return Widget.Box({
        vertical: true,
        setup: (self) => {
            // Устанавливаем обработчик при создании виджета
            self.on("realize", () => {
                const window = self.get_toplevel();
                if (window) {
                    keyHandlerId = window.connect("key-press-event", (_, event) => {
                        const keyval = event.get_keyval()[1];

                        // Обрабатываем Enter (Return) и Numpad Enter
                        if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_KP_Enter) {
                            // Игнорируем, если поле пароля в фокусе (там уже есть обработчик)
                            const focus = self.get_toplevel().get_focus();
                            if (focus === passwordEntry) return false;

                            attemptLogin(passwordEntry.text || "");
                            return true; // Прерываем дальнейшую обработку
                        }

                        // Обработка Esc - очистка пароля
                        if (keyval === Gdk.KEY_Escape) {
                            passwordEntry.text = "";
                            return true;
                        }

                        return false;
                    });
                }
            });

            // Удаляем обработчик при уничтожении виджета
            self.on("destroy", () => {
                if (keyHandlerId) {
                    const window = self.get_toplevel();
                    if (window) {
                        window.disconnect(keyHandlerId);
                    }
                    keyHandlerId = null;
                }
            });

            // Автоматический фокус при старте
            Utils.timeout(300, () => {
                passwordEntry.grab_focus();
            });
        },
        child: mainContainer,
    });
}

// Окно входа
App.addWindow(Widget.Window({
    name: "login",
    anchor: ["top", "left", "right", "bottom"],
    child: Widget.CenterBox({
        center_widget: LoginBox(),
    }),
}));

// Применяем стили
App.applyCss("/etc/greetd/style.css");

// Инициализация
Astal.init();
