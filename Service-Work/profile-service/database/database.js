import pg from "pg";

const {Pool} = pg;

let pool;

/**
 * Асинхронная функция инициализации базы данных:
 * - создаёт пул соединений с использованием строки подключения из переменных окружения
 * - создаёт таблицу profiles, если она ещё не существует
 * - возвращает пул для дальнейшего использования
 */

export async function initDatabase(){
    pool = new Pool({connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}});

    await pool.query(`
        CREATE TABLE IF NOT EXISTS profiles (
            id SERIAL PRIMARY KEY,
            user_id INTEGER UNIQUE NOT NULL,
            full_name VARCHAR(100),
            bio TEXT,
            birth_date DATE,
            avatar_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('Profile DB: PostgreSQL ready');
    return pool;
}

export function getDB(){
    return pool;
}