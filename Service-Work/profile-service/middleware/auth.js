// Импортируем библиотеку jsonwebtoken для верификации JWT
import jwt from 'jsonwebtoken';

/**
 * Асинхронная middleware-функция для Fastify.
 * Проверяет наличие и корректность JWT в заголовке Authorization.
 * Если токен валиден, добавляет в request.user расшифрованные данные (userId, login и др.)
 * В случае ошибки возвращает ответ 401.
 *
 * @param {object} request - объект запроса Fastify
 * @param {object} reply - объект ответа Fastify
 */
export async function verifyJWT(request, reply) {
    try {
        // Читаем заголовок Authorization
        const authHeader = request.headers.authorization;

        // Проверяем: существует ли заголовок и начинается ли он со строки "Bearer "
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // Если нет – отправляем 401 с сообщением об ошибке
            return reply.status(401).send({ success: false, error: 'Missing or invalid token' });
        }

        // Извлекаем сам токен (обрезаем префикс "Bearer ")
        const token = authHeader.split(' ')[1];

        // Верифицируем токен с помощью секретного ключа из переменных окружения
        // Метод verify возвращает раскодированную полезную нагрузку (payload)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Добавляем раскодированные данные в объект request, чтобы следующие обработчики могли их использовать
        request.user = decoded; // например: { userId: 123, login: "alice", iat: ..., exp: ... }
    } catch (err) {
        // Ловим любые ошибки верификации (просроченный токен, неверная подпись и т.д.)
        return reply.status(401).send({ success: false, error: 'Invalid token' });
    }
}