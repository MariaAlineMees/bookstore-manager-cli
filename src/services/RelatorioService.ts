import { RelatorioRepository } from '../repositories/RelatorioRepository';
import { AutorRepository } from '../repositories/AutorRepository';
import { ClienteRepository } from '../repositories/ClienteRepository';

export class RelatorioService {
  private relatorioRepository = new RelatorioRepository();
  private autorRepository = new AutorRepository();
  private clienteRepository = new ClienteRepository();

  async listarLivrosPorAutor(autorId: number): Promise<any[]> {
    try {
      if (isNaN(autorId) || autorId <= 0) {
        throw new Error('ID do autor informado é inválido.');
      }

      const autorExiste = await this.autorRepository.buscarPorId(autorId);
      if (!autorExiste) {
        throw new Error(`O Autor com ID ${autorId} não está cadastrado no sistema.`);
      }

      return await this.relatorioRepository.buscarLivrosPorAutor(autorId);
    } catch (error) {
      throw error;
    }
  }

  async listarLivrosDisponiveis(): Promise<any[]> {
    try {
      return await this.relatorioRepository.buscarLivrosDisponiveis();
    } catch (error) {
      throw new Error('Falha ao gerar relatório de livros disponíveis.');
    }
  }

  async listarLivrosEmprestados(): Promise<any[]> {
    try {
      return await this.relatorioRepository.buscarLivrosEmprestados();
    } catch (error) {
      throw new Error('Falha ao gerar relatório de livros emprestados.');
    }
  }

  async listarHistoricoPorCliente(clienteId: number): Promise<any[]> {
    try {
      if (isNaN(clienteId) || clienteId <= 0) {
        throw new Error('ID do cliente informado é inválido.');
      }

      const clienteExiste = await this.clienteRepository.buscarPorId(clienteId);
      if (!clienteExiste) {
        throw new Error(`O Cliente com ID ${clienteId} não está cadastrado no sistema.`);
      }

      return await this.relatorioRepository.buscarHistoricoPorCliente(clienteId);
    } catch (error) {
      throw error;
    }
  }
}