// Импортируем встроенный модуль path для работы с путями файловой системы
import path from 'path';

// Импортируем утилиты для работы с URL (необходимы для ES-модулей, чтобы получить __dirname)
import { fileURLToPath } from 'url';

// Получаем путь к текущему файлу (pages.js) в формате URL
const __filename = fileURLToPath(import.meta.url);

// Получаем директорию текущего файла (например, /.../profile_service/routes)
const __dirname = path.dirname(__filename);

/**
 * Регистрация маршрута для отдачи HTML-страницы управления профилем.
 * Используется для того, чтобы пользователь мог видеть и редактировать свой профиль через браузер.
 *
 * @param {object} fastify - экземпляр Fastify
 */
export default async function pageRoutes(fastify) {
    // Маршрут GET /profile – отдаёт статический HTML-файл profile.html
    fastify.get('/profile', (request, reply) => {
        // Отправляем файл. Первый аргумент – имя файла.
        // Второй аргумент – корневая директория, где лежит файл (join(__dirname, '../public')).
        reply.sendFile('profile.html', path.join(__dirname, '../public'));
    });
}