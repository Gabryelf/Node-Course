
# 📝 Notes App

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=node.js)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![License](https://img.shields.io/badge/License-ISC-blue)
![GitHub Actions](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?logo=github-actions)

![GitHub last commit](https://img.shields.io/github/last-commit/Gabryelf/Node-Course)
![GitHub issues](https://img.shields.io/github/issues/Gabryelf/Node-Course)
![GitHub stars](https://img.shields.io/github/stars/Gabryelf/Node-Course?style=social)
![GitHub forks](https://img.shields.io/github/forks/Gabryelf/Node-Course?style=social)

**Простое серверное приложение для управления заметками**

[Демо](#) • [Установка](#-установка) • [Использование](#-использование) • [API](#-api)

</div>

---

## ✨ Особенности

- 🚀 **Быстрый старт** - никаких сложных настроек
- 💾 **Автосохранение** - заметки сохраняются автоматически
- 🌐 **REST API** - удобный интерфейс для интеграции
- 📱 **Адаптивный дизайн** - работает на любых устройствах
- 🔄 **Живое обновление** - изменения видны сразу

## 🛠️ Технологии

### Backend
- **Node.js** - серверная платформа
- **Native HTTP** - без дополнительных зависимостей
- **File System** - хранение данных в JSON

### Frontend
- **HTML5** - структура страницы
- **CSS3** - стилизация интерфейса
- **Vanilla JS** - чистый JavaScript без фреймворков

### DevOps
- **GitHub Actions** - автоматическое тестирование
- **Cross-version testing** - проверка на Node.js 18, 20, 22

## 📦 Установка

### Установка зависимостей

```bash
npm install
```

### Запуск сервера

```bash
# Продакшн режим
npm start

# Режим разработки (с автоперезагрузкой)
npm run dev
```

### Открыть приложение

```
http://localhost:3000
```

## 🎯 Использование

### Интерфейс

1. **Добавление заметки**
   - Нажмите кнопку "Добавить заметку"
   - Введите заголовок и содержание
   - Нажмите OK - заметка сохранится

2. **Просмотр заметок**
   - Нажмите "Показать заметки"
   - Все заметки отобразятся в хронологическом порядке

3. **Статистика**
   - Счетчик показывает общее количество заметок
   - Обновляется автоматически

### Пример работы

```javascript
// Создание заметки
{
  id: 1,
  title: "Встреча с командой",
  content: "Обсудить новый проект в 15:00",
  date: "2024-03-22 14:30:45"
}
```

## 🔌 API Endpoints

### GET /api/notes
Получить все заметки

```bash
curl http://localhost:3000/api/notes
```

**Ответ:**
```json
[
  {
    "id": 1,
    "title": "Пример заметки",
    "content": "Содержание заметки",
    "date": "2024-03-22 14:30:45"
  }
]
```

### POST /api/notes
Создать новую заметку

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Новая заметка","content":"Текст заметки"}'
```

**Ответ:**
```json
{
  "success": true
}
```


## 🌐 Тестирование

Проект автоматически тестируется через GitHub Actions при каждом push:

```yaml
✅ Проверка синтаксиса
✅ Установка зависимостей
✅ Совместимость с Node.js 18, 20, 22
```

### Локальное тестирование

```bash
# Проверка синтаксиса
node -c index.js
node -c utils/helper.js
node -c utils/fileManager.js
```


---

<div align="center">
  <sub>Built with 🌟 using Node.js</sub>
</div>
```







