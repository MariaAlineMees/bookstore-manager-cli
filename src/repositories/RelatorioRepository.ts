import { pool } from '../database/connection';

export class RelatorioRepository {
  async buscarLivrosPorAutor(autorId: number): Promise<any[]> {
    const query = `
      SELECT l.id, l.titulo, l.ano_publicacao, l.quantidade_disponivel, a.nome AS autor_nome
      FROM livros l
      JOIN autores a ON l.autor_id = a.id
      WHERE a.id = $1
      ORDER BY l.titulo ASC;
    `;
    const resultado = await pool.query(query, [autorId]);
    return resultado.rows;
  }

  async buscarLivrosDisponiveis(): Promise<any[]> {
    const query = `
      SELECT l.id, l.titulo, l.quantidade_disponivel, a.nome AS autor_nome
      FROM livros l
      JOIN autores a ON l.autor_id = a.id
      WHERE l.quantidade_disponivel > 0
      ORDER BY l.titulo ASC;
    `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async buscarLivrosEmprestados(): Promise<any[]> {
    const query = `
      SELECT e.id AS emprestimo_id, l.titulo AS livro_titulo, c.nome AS cliente_nome, 
             c.email AS cliente_email, e.data_emprestimo
      FROM emprestimos e
      JOIN livros l ON e.livro_id = l.id
      JOIN clientes c ON e.cliente_id = c.id
      WHERE e.status = 'ATIVO'
      ORDER BY e.data_emprestimo ASC;
    `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async buscarHistoricoPorCliente(clienteId: number): Promise<any[]> {
    const query = `
      SELECT l.titulo AS livro_titulo, a.nome AS autor_nome, e.data_emprestimo, 
             e.data_devolucao, e.status
      FROM emprestimos e
      JOIN livros l ON e.livro_id = l.id
      JOIN autores a ON l.autor_id = a.id
      WHERE e.cliente_id = $1
      ORDER BY e.id DESC;
    `;
    const resultado = await pool.query(query, [clienteId]);
    return resultado.rows;
  }

  async buscarLivrosMaisPopulares(): Promise<any[]> {
    const query = `
      SELECT l.titulo AS livro_titulo, a.nome AS autor_nome, COUNT(e.id) AS total_emprestimos
      FROM emprestimos e
      JOIN livros l ON e.livro_id = l.id
      JOIN autores a ON l.autor_id = a.id
      GROUP BY l.id, l.titulo, a.nome
      ORDER BY total_emprestimos DESC
      LIMIT 5;
    `;
    const resultado = await pool.query(query);
    return resultado.rows;
  }
}