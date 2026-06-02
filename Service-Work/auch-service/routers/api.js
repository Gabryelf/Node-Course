import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { getDB } from '../database/database.js';

const router = express.Router();

// --- POST /api/register — регистрация нового пользователя ---
router.post("/register", async (req, res) => {
  const { login, password } = req.body;

  // Валидация: оба поля должны быть не пустыми
  if (!login || !password) {
      // 400 Bad Request — клиент отправил некорректные данные
      return res.status(400).json({ success: false, error: "Логин и пароль обязательны" });
  }

  // Дополнительная валидация: минимальная длина пароля (4 символа)
  if (password.length < 4) {
      return res.status(400).json({ success: false, error: "Пароль должен быть минимум 4 символа" });
  }

  // Получаем пул соединений с БД
  const db = await getDB();

  // Хешируем пароль с помощью bcrypt.
  // 10 — количество "раундов" соли (чем больше, тем дольше, но безопаснее).
  // Хеширование — асинхронная операция, используем await.
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
      // Вставляем нового пользователя в таблицу users.
      // Используем параметризованный запрос ($1, $2) — защита от SQL-инъекций.
      // RETURNING ... — сразу возвращаем созданные поля (id, login, created_at)
      const result = await db.query(
          'INSERT INTO users (login, password) VALUES ($1, $2) RETURNING id, login, created_at',
          [login, hashedPassword]
      );

      // Извлекаем первый (и единственный) ряд результата
      const newUser = result.rows[0];

      // Асинхронно пытаемся создать профиль в сервисе профилей.
      // Не используем await, чтобы не задерживать ответ клиенту.
      createProfileForUser(newUser.id, newUser.login).catch(console.error);

      res.json({ success: true, message: "Регистрация успешна!" });
  } catch (err) {
      // Обработка ошибок PostgreSQL.
      // Код 23505 — violation уникального ограничения (логин уже существует).
      if (err.code === '23505') {
          return res.status(400).json({ success: false, error: "Логин уже занят" });
      }
      // Любая другая ошибка — внутренняя проблема сервера.
      console.error(err);
      res.status(500).json({ success: false, error: "Ошибка сервера" });
  }
});

// --- POST /api/login — вход существующего пользователя ---
router.post("/login", async (req, res) => {
  const { login, password } = req.body;

  // Базовая валидация (аналогично регистрации)
  if (!login || !password) {
      return res.status(400).json({ success: false, error: "Логин и пароль обязательны" });
  }

  const db = await getDB();

  // Ищем пользователя по логину.
  // Используем параметризованный запрос, чтобы избежать SQL-инъекций.
  const result = await db.query('SELECT * FROM users WHERE login = $1', [login]);
  const user = result.rows[0];

  // Если пользователь не найден — отправляем 401 Unauthorized (неверные учётные данные)
  if (!user) {
      return res.status(401).json({ success: false, error: "Неверный логин или пароль" });
  }

  // Сравниваем введённый пароль с сохранённым хешем.
  // bcrypt.compare() самостоятельно извлекает соль из хеша.
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: "Неверный логин или пароль" });
  }

  // --- Генерация JWT токена ---
  // Токен будет содержать полезную нагрузку (payload) с userId и login.
  // Секретный ключ берётся из переменной окружения JWT_SECRET (файл .env).
  // Срок действия — 24 часа (expiresIn: '24h').
  const token = jwt.sign(
      { userId: user.id, login: user.login },   // данные, которые зашифруем в токен
      process.env.JWT_SECRET,                   // секрет для подписи
      { expiresIn: '24h' }                      // опции
  );

  // Отправляем успешный ответ:
  // - токен (клиент сохранит его, например, в sessionStorage)
  // - публичные данные пользователя (без пароля)
  // - флаг success: true
  res.json({
      success: true,
      message: "Вход выполнен успешно!",
      token,
      user: {
          id: user.id,
          login: user.login,
          created_at: user.created_at
      }
  });
});

async function createProfileForUser(userId, login) {
  try {
      // Отправляем fetch-запрос к profile-сервису.
      // URL формируется из переменной окружения PROFILE_SERVICE_URL (например, http://localhost:3001)
      const response = await fetch(`${process.env.PROFILE_SERVICE_URL}/api/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Тело запроса: user_id (обязательный) и full_name (опционально, но мы передаём login)
          body: JSON.stringify({ user_id: userId, full_name: login })
      });

      // Если сервер профилей вернул ошибку (статус не 2xx), логируем текст ошибки,
      // но не прерываем выполнение — пользователь уже создан в auth-сервисе.
      if (!response.ok) {
          const errorText = await response.text();
          console.error('Profile creation failed:', errorText);
      }
  } catch (err) {
      // Если profile-сервис вообще недоступен (сеть, порт, etc.), ловим ошибку.
      // Регистрация всё равно считается успешной, профиль можно будет создать позже.
      console.error('Could not reach profile service:', err.message);
  }
}

export default router;
