import { pool } from '../database/connection';
import { Cliente, ICliente } from '../models/Cliente';

export class ClienteRepository {
  async criar(cliente: Cliente): Promise<ICliente> {
    const query = `
      INSERT INTO clientes (nome, email, telefone)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const valores = [cliente.nome, cliente.email, cliente.telefone || null];
    const resultado = await pool.query(query, valores);
    return resultado.rows[0];
  }

  async listarTodos(): Promise<ICliente[]> {
    const query = 'SELECT * FROM clientes ORDER BY id ASC;';
    const resultado = await pool.query(query);
    return resultado.rows;
  }

  async buscarPorId(id: number): Promise<ICliente | null> {
    const query = 'SELECT * FROM clientes WHERE id = $1;';
    const resultado = await pool.query(query, [id]);
    return resultado.rows[0] || null;
  }

  async buscarPorEmail(email: string): Promise<ICliente | null> {
    const query = 'SELECT * FROM clientes WHERE email = $1;';
    const resultado = await pool.query(query, [email]);
    return resultado.rows[0] || null;
  }

  async atualizar(id: number, cliente: Partial<Cliente>): Promise<ICliente | null> {
    const query = `
      UPDATE clientes
      SET nome = COALESCE($1, nome),
          email = COALESCE($2, email),
          telefone = COALESCE($3, telefone)
      WHERE id = $4
      RETURNING *;
    `;
    const valores = [cliente.nome || null, cliente.email || null, cliente.telefone || null, id];
    const resultado = await pool.query(query, valores);
    return resultado.rows[0] || null;
  }

  async remover(id: number): Promise<boolean> {
    const query = 'DELETE FROM clientes WHERE id = $1;';
    const resultado = await pool.query(query, [id]);
    return (resultado.rowCount ?? 0) > 0;
  }
}