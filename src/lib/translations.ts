export const translations = {
  en: {
    // Welcome Page
    welcome: {
      title: "uptask",
      subtitle: "a calm and welcoming task manager.\nfor the real work.",
      getStarted: "get started",
      viewOnGithub: "view on github",
      builtWith: "built with React, TypeScript, and Supabase",
      keepBuilding: "keep building ✨",
      features: {
        simpleTracking: {
          title: "simple task tracking",
          description:
            "create, complete, and manage tasks with descriptions and due dates. no unnecessary complexity.",
        },
        projectOrganization: {
          title: "project organization",
          description:
            "organize tasks into projects with custom icons. keep everything structured and easy to find.",
        },
        realTimeSync: {
          title: "real-time sync",
          description:
            "changes sync automatically across all your devices. powered by Supabase real-time updates.",
        },
        privateByDefault: {
          title: "private by default",
          description:
            "row-level security ensures your data stays yours. built with privacy in mind from day one.",
        },
        githubAuth: {
          title: "github authentication",
          description:
            "secure sign-in with your GitHub account. no passwords to remember or manage.",
        },
        beautifulDesign: {
          title: "beautiful design",
          description:
            "modern, responsive UI with dark mode and customizable accent colors. built with shadcn/ui.",
        },
      },
    },

    // Auth
    auth: {
      welcomeTitle: "Welcome to uptask",
      signInDescription: "Sign in with your GitHub account to continue",
      signInWithGithub: "Sign in with GitHub",
      connecting: "Connecting...",
      termsNotice:
        "By signing in, you agree to our Terms of Service and Privacy Policy.",
    },

    // Dashboard
    dashboard: {
      title: "Dashboard",
      loading: "Loading...",
    },

    // Widgets
    widgets: {
      greeting: {
        hello: "hello",
        greetings: [
          "let's get things done ✨",
          "ready to conquer today?",
          "time to make progress",
          "keep building, keep growing",
          "another day, another win",
          "you've got this",
          "let's build something great",
          "stay focused, stay calm",
          "progress over perfection",
          "one task at a time",
          "small steps, big results",
          "stay consistent",
          "make it happen",
          "focus on what matters",
          "keep the momentum going",
          "be productive, stay calm",
          "clarity leads to action",
          "simple. focused. effective.",
          "turn plans into reality",
          "stay organized, stay ahead",
        ],
      },
      taskStats: {
        title: "Task Overview",
        description: "Your task statistics",
        completed: "Completed",
        toDo: "To Do",
        completionRate: "Completion Rate",
      },
      overdue: {
        title: "Overdue Tasks",
        needAttention: "need attention",
        allCaughtUp: "All caught up!",
        noOverdueTasks: "No overdue tasks!",
        allProjects: "All Projects",
        due: "Due",
        task: "task",
        tasks: "tasks",
      },
      dateWeather: {
        title: "Today",
        enableWeather: "Enable Weather",
        allowLocation: "Allow location access for weather",
        locationDenied: "Location access denied",
      },
    },

    // Menu Bar
    menuBar: {
      userInfo: "User Info",
      settings: "Settings",
      logout: "Logout",
      selected: "Selected",
      moveToProject: "Move to Project",
      deleteSelected: "Delete Selected",
      clearSelection: "Clear Selection",
      search: "Search",
    },

    // Search
    search: {
      title: "Search",
      description: "Search for tasks and projects",
      placeholder: "Type to search...",
      projects: "Projects",
      tasks: "Tasks",
      noResults: "No results found",
      startTyping: "Start typing to search...",
      in: "in",
    },

    // User Dialog
    userDialog: {
      title: "User Information",
      account: "Account",
      description: "Your account details",
      name: "Name",
      email: "Email",
      memberSince: "Member since",
      notProvided: "Not provided",
      unknown: "Unknown",
    },

    // Settings Dialog
    settings: {
      title: "Settings",
      description: "Customize your application preferences",
      appearance: "Appearance",
      appearanceDescription: "Choose how the app looks to you",
      accentColor: "Accent Color",
      accentColorDescription: "Customize the primary color of your app",
      language: "Language",
      languageDescription: "Choose your preferred language",
      themes: {
        light: "Light",
        dark: "Dark",
        system: "System",
        lightMode: "Light mode",
        darkMode: "Dark mode",
        followSystem: "Follow system theme",
        lightActive: "Light mode is active",
        darkActive: "Dark mode is active",
        systemActive:
          "Theme will automatically match your operating system preferences",
      },
      colors: {
        default: "Default",
        purple: "Purple",
        green: "Green",
        red: "Red",
        gold: "Gold",
        blue: "Blue",
        graphite: "Graphite",
        pink: "Pink",
      },
      languages: {
        en: "English",
        ru: "Русский",
      },
    },

    // Task List
    taskList: {
      noActiveTasks: "No active tasks",
      clickToAdd: "Click the Add button to create your first task",
      completed: "Completed",
      add: "Add",
      newTask: "New Task",
      title: "Title",
      titlePlaceholder: "Task title",
      description: "Description (optional)",
      descriptionPlaceholder: "Add description",
      dueDate: "Due Date (optional)",
      pickDate: "Pick a date",
      addTask: "Add Task",
      cancel: "Cancel",
    },

    // Task Item
    taskItem: {
      edit: "Edit",
      editTask: "Edit Task",
      delete: "Delete",
      select: "Select",
      deselect: "Deselect",
      moveToProject: "Move to Project",
      overdue: "Overdue",
      dueToday: "Due today",
      due: "Due",
      markComplete: "Mark complete",
      markIncomplete: "Mark incomplete",
      save: "Save",
    },

    // Projects
    projects: {
      title: "Projects",
      add: "Add Project",
      newProject: "New Project",
      name: "Name",
      namePlaceholder: "Project name",
      icon: "Icon",
      rename: "Rename",
      edit: "Edit Project",
      save: "Save",
      delete: "Delete",
      deleteProject: "Delete Project",
      deleteQuestion: "What would you like to do with the tasks in",
      keepTasksInInbox: "Keep Tasks in Inbox",
      deleteTasks: "Delete Tasks",
    },

    // Widget Settings
    widgetSettings: {
      title: "Widget Visibility",
      resetToDefault: "Reset to Default",
      greeting: "Greeting",
      stats: "Task Stats",
      dateWeather: "Date & Weather",
      overdue: "Overdue Tasks",
    },

    // Mobile
    mobile: {
      dashboard: "Dashboard",
      search: "Search",
      selection: "Selection",
      settings: "Settings",
      user: "User",
      menu: "Menu",
    },

    // Common
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      close: "Close",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      ok: "OK",
    },
  },

  ru: {
    // Welcome Page
    welcome: {
      title: "uptask",
      subtitle: "спокойный и удобный менеджер задач.\nдля настоящей работы.",
      getStarted: "начать",
      viewOnGithub: "посмотреть на github",
      builtWith: "создано с помощью React, TypeScript и Supabase",
      keepBuilding: "продолжайте создавать ✨",
      features: {
        simpleTracking: {
          title: "простое отслеживание задач",
          description:
            "создавайте, выполняйте и управляйте задачами с описаниями и сроками. никакой лишней сложности.",
        },
        projectOrganization: {
          title: "организация проектов",
          description:
            "организуйте задачи в проекты с пользовательскими иконками. держите всё структурированным и легко находимым.",
        },
        realTimeSync: {
          title: "синхронизация в реальном времени",
          description:
            "изменения синхронизируются автоматически на всех ваших устройствах. работает на Supabase real-time.",
        },
        privateByDefault: {
          title: "приватность по умолчанию",
          description:
            "безопасность на уровне строк гарантирует, что ваши данные остаются вашими. создано с заботой о приватности.",
        },
        githubAuth: {
          title: "аутентификация через github",
          description:
            "безопасный вход через ваш аккаунт GitHub. не нужно запоминать пароли.",
        },
        beautifulDesign: {
          title: "красивый дизайн",
          description:
            "современный адаптивный интерфейс с тёмной темой и настраиваемыми цветами. создано с shadcn/ui.",
        },
      },
    },

    // Auth
    auth: {
      welcomeTitle: "Добро пожаловать в uptask",
      signInDescription: "Войдите через ваш аккаунт GitHub для продолжения",
      signInWithGithub: "Войти через GitHub",
      connecting: "Подключение...",
      termsNotice:
        "Входя в систему, вы соглашаетесь с нашими Условиями использования и Политикой конфиденциальности.",
    },

    // Dashboard
    dashboard: {
      title: "Панель управления",
      loading: "Загрузка...",
    },

    // Widgets
    widgets: {
      greeting: {
        hello: "привет",
        greetings: [
          "давайте сделаем дела ✨",
          "готовы покорить сегодня?",
          "время двигаться вперёд",
          "продолжайте строить, продолжайте расти",
          "ещё один день, ещё одна победа",
          "у вас всё получится",
          "давайте создадим что-то великое",
          "оставайтесь сосредоточенными, оставайтесь спокойными",
          "прогресс важнее совершенства",
          "одна задача за раз",
          "маленькие шаги, большие результаты",
          "будьте последовательны",
          "воплотите это в жизнь",
          "сосредоточьтесь на важном",
          "поддерживайте импульс",
          "будьте продуктивны, оставайтесь спокойными",
          "ясность ведёт к действию",
          "просто. сосредоточенно. эффективно.",
          "превратите планы в реальность",
          "оставайтесь организованными, опережайте события",
        ],
      },
      taskStats: {
        title: "Обзор задач",
        description: "Статистика ваших задач",
        completed: "Выполнено",
        toDo: "Сделать",
        completionRate: "Процент выполнения",
      },
      overdue: {
        title: "Просроченные задачи",
        needAttention: "требуют внимания",
        allCaughtUp: "Всё выполнено!",
        noOverdueTasks: "Нет просроченных задач!",
        allProjects: "Все проекты",
        due: "Срок",
        task: "задача",
        tasks: "задач",
      },
      dateWeather: {
        title: "Сегодня",
        enableWeather: "Включить погоду",
        allowLocation: "Разрешите доступ к местоположению для погоды",
        locationDenied: "Доступ к местоположению запрещён",
      },
    },

    // Menu Bar
    menuBar: {
      userInfo: "Информация о пользователе",
      settings: "Настройки",
      logout: "Выйти",
      selected: "Выбрано",
      moveToProject: "Переместить в проект",
      deleteSelected: "Удалить выбранное",
      clearSelection: "Снять выделение",
      search: "Поиск",
    },

    // Search
    search: {
      title: "Поиск",
      description: "Поиск задач и проектов",
      placeholder: "Введите для поиска...",
      projects: "Проекты",
      tasks: "Задачи",
      noResults: "Ничего не найдено",
      startTyping: "Начните вводить для поиска...",
      in: "в",
    },

    // User Dialog
    userDialog: {
      title: "Информация о пользователе",
      account: "Аккаунт",
      description: "Данные вашего аккаунта",
      name: "Имя",
      email: "Email",
      memberSince: "Участник с",
      notProvided: "Не указано",
      unknown: "Неизвестно",
    },

    // Settings Dialog
    settings: {
      title: "Настройки",
      description: "Настройте параметры приложения",
      appearance: "Внешний вид",
      appearanceDescription: "Выберите, как приложение будет выглядеть",
      accentColor: "Цветовой акцент",
      accentColorDescription: "Настройте основной цвет приложения",
      language: "Язык",
      languageDescription: "Выберите предпочитаемый язык",
      themes: {
        light: "Светлая",
        dark: "Тёмная",
        system: "Системная",
        lightMode: "Светлый режим",
        darkMode: "Тёмный режим",
        followSystem: "Следовать системной теме",
        lightActive: "Светлый режим активен",
        darkActive: "Тёмный режим активен",
        systemActive:
          "Тема будет автоматически соответствовать настройкам вашей операционной системы",
      },
      colors: {
        default: "По умолчанию",
        purple: "Фиолетовый",
        green: "Зелёный",
        red: "Красный",
        gold: "Золотой",
        blue: "Синий",
        graphite: "Графитовый",
        pink: "Розовый",
      },
      languages: {
        en: "English",
        ru: "Русский",
      },
    },

    // Task List
    taskList: {
      noActiveTasks: "Нет активных задач",
      clickToAdd: "Нажмите кнопку Добавить, чтобы создать первую задачу",
      completed: "Выполнено",
      add: "Добавить",
      newTask: "Новая задача",
      title: "Название",
      titlePlaceholder: "Название задачи",
      description: "Описание (необязательно)",
      descriptionPlaceholder: "Добавить описание",
      dueDate: "Срок выполнения (необязательно)",
      pickDate: "Выберите дату",
      addTask: "Добавить задачу",
      cancel: "Отмена",
    },

    // Task Item
    taskItem: {
      edit: "Редактировать",
      editTask: "Редактировать задачу",
      delete: "Удалить",
      select: "Выбрать",
      deselect: "Снять выбор",
      moveToProject: "Переместить в проект",
      overdue: "Просрочено",
      dueToday: "Срок сегодня",
      due: "Срок",
      markComplete: "Отметить как выполненную",
      markIncomplete: "Отметить как невыполненную",
      save: "Сохранить",
    },

    // Projects
    projects: {
      title: "Проекты",
      add: "Добавить проект",
      newProject: "Новый проект",
      name: "Название",
      namePlaceholder: "Название проекта",
      icon: "Иконка",
      rename: "Переименовать",
      edit: "Редактировать проект",
      save: "Сохранить",
      delete: "Удалить",
      deleteProject: "Удалить проект",
      deleteQuestion: "Что вы хотите сделать с задачами в",
      keepTasksInInbox: "Сохранить задачи в Inbox",
      deleteTasks: "Удалить задачи",
    },

    // Widget Settings
    widgetSettings: {
      title: "Видимость виджетов",
      resetToDefault: "Сбросить к значениям по умолчанию",
      greeting: "Приветствие",
      stats: "Статистика задач",
      dateWeather: "Дата и погода",
      overdue: "Просроченные задачи",
    },

    // Mobile
    mobile: {
      dashboard: "Панель",
      search: "Поиск",
      selection: "Выбор",
      settings: "Настройки",
      user: "Пользователь",
      menu: "Меню",
    },

    // Common
    common: {
      loading: "Загрузка...",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Редактировать",
      add: "Добавить",
      close: "Закрыть",
      confirm: "Подтвердить",
      yes: "Да",
      no: "Нет",
      ok: "ОК",
    },
  },
};
