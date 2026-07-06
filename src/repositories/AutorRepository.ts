import { pool } from '../database/connection';
import { Autor, IAutor } from '../models/Autor';

export class AutorRepository {
  async criar(autor: Autor): Promise<IAutor> {
    const query = `
      INSERT INTO autores (nome, nacionalidade, data_nascimento)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const valores = [autor.nome, autor.nacionalidade || null, autor.data_nascimento || null];
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  }

  async listarTodos(): Promise<IAutor[]> {
    const query = 'SELECT * FROM autores ORDER BY id ASC;';
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async buscarPorId(id: number): Promise<IAutor | null> {
    const query = 'SELECT * FROM autores WHERE id = $1;';
    const resultado = await pool.query(query, [id]);
    return resultado.rows[0] || null;
  }

  async atualizar(id: number, autor: Partial<Autor>): Promise<IAutor | null> {
    const query = `
      UPDATE autores
      SET nome = COALESCE($1, nome),
          nacionalidade = COALESCE($2, nacionalidade),
          data_nascimento = COALESCE($3, data_nascimento)
      WHERE id = $4
      RETURNING *;
    `;
    const valores = [autor.nome || null, autor.nacionalidade || null, autor.data_nascimento || null, id];
    const resultado = await pool.query(query, valores);
    return resultado.rows[0] || null;
  }

  async remover(id: number): Promise<boolean> {
    const query = 'DELETE FROM autores WHERE id = $1;';
    const resultado = await pool.query(query, [id]);
    return (resultado.rowCount ?? 0) > 0;
  }
}