const { Pool } = require('pg');
const POSTGRES_HOST = process.env.POSTGRES_HOST || '127.0.0.1';
const POSTGRES_DB = process.env.POSTGRES_DB || 'postgres-db-list';
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || 'password';
const POSTGRES_USER = process.env.POSTGRES_USER || 'postgres';
const DATABASE_URL = process.env.DATABASE_URL;

const dbConfig = {
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: 5432,
};



const pool = DATABASE_URL ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
                rejectUnauthorized: false
            }
        }) : new Pool(dbConfig);

module.exports = pool;