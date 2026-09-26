import 'dotenv/config';
import postgres from 'pg';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new postgres.Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;
