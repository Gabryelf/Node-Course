import Fastify from 'fastify';
import 'dotenv/config';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';  // Добавляем CORS
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './database/database.js';
import { verifyJWT } from './middleware/auth.js';
import profileRoutes from './routes/api/profile.js';
import pageRoutes from './routes/pages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({ logger: true });

// ✅ Настройка CORS для работы с auth-сервисом
await fastify.register(cors, {
    origin: 'http://localhost:3000', // Разрешаем запросы только с auth-сервиса
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

await initDatabase();
fastify.decorate('verifyJWT', verifyJWT);

await fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/'
});

await fastify.register(profileRoutes);
await fastify.register(pageRoutes);

fastify.get('/health', async () => ({ status: 'ok', service: 'profile-service' }));

const port = process.env.PROFILE_PORT || 3001;
fastify.listen({ port, host: '0.0.0.0' }, (err) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`🚀 Profile service running on http://localhost:${port}`);
    console.log(`📋 Profile page: http://localhost:${port}/profile`);
});