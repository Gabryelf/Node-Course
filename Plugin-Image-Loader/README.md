
![Версия](https://img.shields.io/badge/версия-0.0.1-brightgreen)
![js](https://img.shields.io/badge/javascript-yellow)
![css-3](https://img.shields.io/badge/css-3-blue)
![html-5](https://img.shields.io/badge/html-5-orange)
![canvas](https://img.shields.io/badge/canvas-API-cyan)
![git](https://img.shields.io/badge/git-flow-white)

---

# Задание: Расширение для Chrome "Save Tab"


---

## Цель задания
Создать простое расширение для Chrome, которое позволяет:
1. Сохранять URL текущей активной вкладки
2. Восстанавливать сохраненный URL в новой вкладке
3. Отображать сохраненный URL в интерфейсе

## Шпаргалка: Основные API расширений Chrome

### 1. Manifest V3 - точка входа
```json
{
  "manifest_version": 3,           // Версия манифеста (обязательно 3)
  "name": "Название",              // Имя расширения
  "version": "1.0",                // Версия
  "description": "Описание",       // Краткое описание
  "permissions": [...],            // Запрашиваемые разрешения
  "action": {                      // Настройки кнопки расширения
    "default_popup": "popup.html", // HTML-файл попапа
    "default_title": "Подсказка"   // Текст при наведении
  }
}
```

### 2. Разрешения (permissions)

**"tabs"** - работа с вкладками
- Позволяет читать, создавать, закрывать вкладки
- Нужно для получения URL активной вкладки

**"storage"** - работа с хранилищем
- Сохранение данных между сессиями
- Данные не удаляются при закрытии браузера

### 3. Chrome Tabs API (работа с вкладками)

```javascript
// Получить все вкладки
const allTabs = await chrome.tabs.query({});

// Получить активную вкладку в текущем окне
const [activeTab] = await chrome.tabs.query({ 
    active: true,           // Только активные вкладки
    currentWindow: true     // Только в текущем окне
});

// Создать новую вкладку
await chrome.tabs.create({ 
    url: "https://example.com" 
});

// Закрыть вкладку
await chrome.tabs.remove(tabId);

// Обновить вкладку
await chrome.tabs.reload(tabId);
```

### 4. Chrome Storage API (хранение данных)

```javascript
// Сохранить данные (локальное хранилище)
await chrome.storage.local.set({ 
    key: "value" 
});

// Прочитать данные
const result = await chrome.storage.local.get(['key']);
console.log(result.key); // "value"

// Удалить данные
await chrome.storage.local.remove(['key']);

// Очистить всё хранилище
await chrome.storage.local.clear();
```

### 5. События браузера - расширенные!

```javascript
// Когда вкладка создана
chrome.tabs.onCreated.addListener((tab) => {
    console.log('Tab created:', tab.id);
});

// Когда вкладка закрыта
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    console.log('Tab removed:', tabId);
});

// Когда вкладка активирована (переключились на неё)
chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log('Activated tab:', activeInfo.tabId);
});

// Когда URL вкладки изменился
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        console.log('URL changed to:', changeInfo.url);
    }
});

// При установке расширения
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Extension installed/updated');
});
```

### 6. Работа с DOM в попапе

```javascript
// Получить элемент
const button = document.getElementById('myButton');

// Изменить текст
button.textContent = 'New Text';

// Добавить обработчик клика
button.addEventListener('click', () => {
    console.log('Button clicked!');
});

// Изменить стиль
element.style.color = 'red';
```

### 7. Асинхронность 

Все Chrome API возвращают **Promise** (async/await):

```javascript
// async/await
async function myFunction() {
    const tabs = await chrome.tabs.query({});
    console.log(tabs);
}

// Promise.then
chrome.tabs.query({}).then((tabs) => {
    console.log(tabs);
});

```

### 8. Отладка расширения

1. Перейти на `chrome://extensions/`
2. Включить "Режим разработчика"
3. Нажать "Загрузить распакованное расширение"
4. Выбрать папку с файлами
5. Для обновления нажать кнопку обновления (⟳)
6. Для отладки попапа - ПКМ на иконке → "Проверить всплывающее окно"

## Задание!

### Базовый уровень (обязательно)
1. Создайте расширение с двумя кнопками: "Save" и "Restore"
2. При нажатии "Save" сохраняйте URL текущей вкладки
3. При нажатии "Restore" открывайте сохраненный URL в новой вкладке
4. Показывайте сохраненный URL в интерфейсе

### Продвинутый уровень (по желанию)
1. Добавьте возможность сохранять несколько URL (список)
2. Добавьте удаление сохраненных URL
3. Используйте события браузера для автоматического сохранения
4. Добавьте горячие клавиши (commands в manifest)
5. Показывайте уведомление при сохранении/восстановлении

## Критерии оценки
- [ ] Расширение устанавливается без ошибок
- [ ] Кнопка "Save" сохраняет URL текущей вкладки
- [ ] Кнопка "Restore" открывает сохраненный URL
- [ ] Код чистый и понятный
- [ ] Есть обработка ошибок
- [ ] Используется async/await
- [ ] (Доп.) Есть дополнительные функции
```

