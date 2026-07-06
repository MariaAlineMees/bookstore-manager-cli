import { pool } from '../database/connection';
import { Livro, ILivro } from '../models/Livro';

export class LivroRepository {
  
  async criar(livro: Livro): Promise<ILivro> {
    const query = `
      INSERT INTO livros (titulo, autor_id, quantidade_disponivel, ano_publicacao)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const valores = [
      livro.titulo, 
      livro.autor_id, 
      livro.quantidade_disponivel, 
      livro.ano_publicacao || null
    ];
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  }

  async listarTodos(): Promise<any[]> {
    const query = `
      SELECT l.id, l.titulo, l.ano_publicacao, l.quantidade_disponivel, l.autor_id, a.nome AS autor_nome
      FROM livros l
      LEFT JOIN autores a ON l.autor_id = a.id
      ORDER BY l.id ASC;
    `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async buscarPorId(id: number): Promise<ILivro | null> {
    const query = 'SELECT * FROM livros WHERE id = $1;';
    const resultado = await pool.query(query, [id]);
    return resultado.rows[0] || null;
  }

  async atualizar(id: number, livro: Partial<Livro>): Promise<ILivro | null> {
    const query = `
      UPDATE livros
      SET titulo = COALESCE($1, titulo),
          autor_id = COALESCE($2, autor_id),
          quantidade_disponivel = COALESCE($3, quantidade_disponivel),
          ano_publicacao = COALESCE($4, ano_publicacao)
      WHERE id = $5
      RETURNING *;
    `;
    const valores = [
      livro.titulo || null,
      livro.autor_id || null,
      livro.quantidade_disponivel !== undefined ? livro.quantidade_disponivel : null,
      livro.ano_publicacao || null,
      id
    ];
    const resultado = await pool.query(query, valores);
    return resultado.rows[0] || null;
  }

  async remover(id: number): Promise<boolean> {
    const query = 'DELETE FROM livros WHERE id = $1;';
    const resultado = await pool.query(query, [id]);
    return (resultado.rowCount ?? 0) > 0;
  }
}