import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function initDatabase(): Promise<void> {
  try {
    const client = await pool.connect();
    console.log('✅ Conexão com o PostgreSQL estabelecida com sucesso!');

    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    await client.query(schemaSql);
    console.log('✅ Tabelas verificadas/criadas no banco de dados com sucesso!');

    client.release();
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    console.log('💡 Dica: Verifique se o PostgreSQL está rodando e se o banco "bookstore_db" foi criado no pgAdmin.');
  }
}