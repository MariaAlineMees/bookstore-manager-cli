import { pool } from '../database/connection';
import { Emprestimo, IEmprestimo } from '../models/Emprestimo';

export class EmprestimoRepository {
  
  async criar(emprestimo: Emprestimo): Promise<IEmprestimo> {
    const query = `
      INSERT INTO emprestimos (livro_id, cliente_id, data_emprestimo, status)
      VALUES ($1, $2, CURRENT_DATE, 'ATIVO')
      RETURNING *;
    `;
    const valores = [emprestimo.livro_id, emprestimo.cliente_id];
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  }

  async devolver(id: number): Promise<IEmprestimo | null> {
    const query = `
      UPDATE emprestimos
      SET status = 'DEVOLVIDO',
          data_devolucao = CURRENT_DATE
      WHERE id = $1 AND status = 'ATIVO'
      RETURNING *;
    `;
    const resultado = await pool.query(query, [id]);
    return resultado.rows[0] || null;
  }

  async listarTodos(): Promise<any[]> {
    const query = `
      SELECT e.id, e.data_emprestimo, e.data_devolucao, e.status,
             l.titulo AS livro_titulo,
             c.nome AS cliente_nome
      FROM emprestimos e
      JOIN livros l ON e.livro_id = l.id
      JOIN clientes c ON e.cliente_id = c.id
      ORDER BY e.id DESC;
    `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async listarAtivos(): Promise<any[]> {
    const query = `
      SELECT e.id, e.data_emprestimo, e.status,
             l.titulo AS livro_titulo,
             c.nome AS cliente_nome
      FROM emprestimos e
      JOIN livros l ON e.livro_id = l.id
      JOIN clientes c ON e.cliente_id = c.id
      WHERE e.status = 'ATIVO'
      ORDER BY e.id ASC;
    `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async buscarPorId(id: number): Promise<IEmprestimo | null> {
    const query = 'SELECT * FROM emprestimos WHERE id = $1;';
    const resultado = await pool.query(query, [id]);
    return resultado.rows[0] || null;
  }
}