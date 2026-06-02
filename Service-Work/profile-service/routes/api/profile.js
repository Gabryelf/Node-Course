import { getDB } from '../../database/database.js';

export default async function profileRoutes(fastify, opts) {
    
    // ✅ GET - получить профиль текущего пользователя
    fastify.get('/api/profile', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const userId = request.user.userId;
        const db = getDB();

        const result = await db.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);

        if (result.rows.length === 0) {
            return reply.status(404).send({ success: false, error: 'Profile not found' });
        }

        return { success: true, profile: result.rows[0] };
    });

    // ✅ POST - создать или обновить профиль
    fastify.post('/api/profile', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const userId = request.user.userId;
        const { full_name, bio, birth_date, avatar_url } = request.body;

        const db = getDB();

        const result = await db.query(
            `INSERT INTO profiles (user_id, full_name, bio, birth_date, avatar_url)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (user_id) DO UPDATE SET
                full_name = EXCLUDED.full_name,
                bio = EXCLUDED.bio,
                birth_date = EXCLUDED.birth_date,
                avatar_url = EXCLUDED.avatar_url,
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [userId, full_name, bio, birth_date, avatar_url]
        );

        return { success: true, profile: result.rows[0] };
    });

    // ✅ PUT - полностью обновить профиль
    fastify.put('/api/profile', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const userId = request.user.userId;
        const { full_name, bio, birth_date, avatar_url } = request.body;

        const db = getDB();

        const result = await db.query(
            `UPDATE profiles 
             SET full_name = $1, bio = $2, birth_date = $3, avatar_url = $4, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = $5
             RETURNING *`,
            [full_name, bio, birth_date, avatar_url, userId]
        );

        if (result.rows.length === 0) {
            return reply.status(404).send({ success: false, error: 'Profile not found' });
        }

        return { success: true, profile: result.rows[0] };
    });

    // ✅ DELETE - удалить профиль
    fastify.delete('/api/profile', { preHandler: fastify.verifyJWT }, async (request, reply) => {
        const userId = request.user.userId;
        const db = getDB();

        const result = await db.query('DELETE FROM profiles WHERE user_id = $1 RETURNING *', [userId]);

        if (result.rows.length === 0) {
            return reply.status(404).send({ success: false, error: 'Profile not found' });
        }

        return { success: true, message: 'Profile deleted successfully' };
    });
}