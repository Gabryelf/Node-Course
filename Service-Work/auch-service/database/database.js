import pg from "pg";

const { Pool } = pg;

let pool;

/**
 * Асинхронная функция инициализации базы данных.
 * Должна быть вызвана ПЕРЕД запуском сервера.
 * 
 * @returns {Promise<Pool>} — экземпляр пула для дальнейшего использования
 */

export async function initDatabase(){
    pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}});

    //await pool.query(`DROP TABLE IF EXISTS users;`);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            login TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('Auth DB: PostgreSQL ready');
    return pool;
}

/**
 * Геттер для получения экземпляра пула из других модулей (например, из routes/api.js).
 * 
 * @returns {Pool} — пул соединений PostgreSQL
 */

export async function getDB(){
    return pool;
}