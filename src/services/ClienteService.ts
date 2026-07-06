import { ClienteRepository } from '../repositories/ClienteRepository';
import { Cliente, ICliente } from '../models/Cliente';

export class ClienteService {
  private clienteRepository = new ClienteRepository();

  async cadastrar(nome: string, email: string, telefone?: string): Promise<ICliente> {
    try {
      if (!nome || nome.trim() === '') {
        throw new Error('O nome do cliente é obrigatório.');
      }
      if (!email || email.trim() === '') {
        throw new Error('O e-mail do cliente é obrigatório.');
      }

      const emailExistente = await this.clienteRepository.buscarPorEmail(email.trim());
      if (emailExistente) {
        throw new Error(`Não é possível cadastrar: O e-mail '${email}' já está sendo usado por outro cliente.`);
      }

      const novoCliente = new Cliente(nome.trim(), email.trim(), telefone?.trim());
      return await this.clienteRepository.criar(novoCliente);
    } catch (error) {
      throw error;
    }
  }

  async listar(): Promise<ICliente[]> {
    try {
      return await this.clienteRepository.listarTodos();
    } catch (error) {
      throw new Error('Falha ao buscar a lista de clientes no banco de dados.');
    }
  }

  async buscarPorId(id: number): Promise<ICliente> {
    try {
      if (isNaN(id) || id <= 0) {
        throw new Error('ID do cliente informado é inválido.');
      }
      const cliente = await this.clienteRepository.buscarPorId(id);
      if (!cliente) {
        throw new Error(`Cliente com ID ${id} não foi encontrado.`);
      }
      return cliente;
    } catch (error) {
      throw error;
    }
  }

  async atualizar(id: number, dados: Partial<Cliente>): Promise<ICliente> {
    try {
      await this.buscarPorId(id);

      if (dados.email && dados.email.trim() !== '') {
        const clienteComMesmoEmail = await this.clienteRepository.buscarPorEmail(dados.email.trim());
        if (clienteComMesmoEmail && clienteComMesmoEmail.id !== id) {
          throw new Error(`O e-mail '${dados.email}' já está cadastrado para outro cliente.`);
        }
      }

      const clienteAtualizado = await this.clienteRepository.atualizar(id, dados);
      if (!clienteAtualizado) {
        throw new Error('Não foi possível atualizar o cliente.');
      }
      return clienteAtualizado;
    } catch (error) {
      throw error;
    }
  }

  async remover(id: number): Promise<boolean> {
    try {
      await this.buscarPorId(id);
      return await this.clienteRepository.remover(id);
    } catch (error) {
      throw error;
    }
  }
}