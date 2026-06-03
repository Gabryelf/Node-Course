<<<<<<< HEAD
import express from "express";
import 'dotenv/config';
import pageRouter from "./routers/pages.js";
import apiRouter from "./routers/api.js";
import { initDatabase } from './database/database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';
=======
import express from 'express';
import 'dotenv/config'
import {initDatabase} from "./database/database.js";
import apiRoutes from "./routes/api.js";
import pageRoutes from "./routes/pages.js";
import {fileURLToPath} from "url";
import path from "path";
>>>>>>> a954766c2488b60937aa3bdbdad80739306821c2

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.AUTH_PORT || 3000;

await initDatabase();

<<<<<<< HEAD
// --- Прокси для profile-сервиса ---
// Вариант 1: Прямое перенаправление без изменения пути
app.use('/profile-api', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    // НЕ меняем путь, просто добавляем /api
    router: function(req) {
        return 'http://localhost:3001';
    },
    pathRewrite: {
        '^/profile-api': '/api', // /profile-api/profile -> /api/profile
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Proxy: ${req.method} ${req.url} -> http://localhost:3001${proxyReq.path}`);
    },
    onError: (err, req, res) => {
        console.error('❌ Proxy error:', err);
        res.status(500).json({ error: 'Profile service unavailable' });
    }
}));

// Остальные мидлвары
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Роутеры
app.use("/api", apiRouter);
app.use("/", pageRouter);

// Запуск
app.listen(port, () => {
    console.log(`Auth service running on http://localhost:${port}`);
    console.log(`Profile API proxy: http://localhost:${port}/profile-api -> http://localhost:3001/api`);
});
=======
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", pageRoutes);
app.use("/api", apiRoutes);

app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
});
>>>>>>> a954766c2488b60937aa3bdbdad80739306821c2
