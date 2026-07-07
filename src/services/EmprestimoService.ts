import { EmprestimoRepository } from '../repositories/EmprestimoRepository';
import { LivroRepository } from '../repositories/LivroRepository';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { Emprestimo, IEmprestimo } from '../models/Emprestimo';
import { AppError } from '../utils/AppError'; 

export class EmprestimoService {
  private emprestimoRepository = new EmprestimoRepository();
  private livroRepository = new LivroRepository();
  private clienteRepository = new ClienteRepository();

  async realizarEmprestimo(livroId: number, clienteId: number): Promise<IEmprestimo> {
    try {
      if (isNaN(livroId) || livroId <= 0) {
        throw new AppError('ID do livro informado é inválido.');
      }
      if (isNaN(clienteId) || clienteId <= 0) {
        throw new AppError('ID do cliente informado é inválido.');
      }

      const cliente = await this.clienteRepository.buscarPorId(clienteId);
      if (!cliente) {
        throw new AppError(`O Cliente com ID ${clienteId} não está cadastrado no sistema.`);
      }

      const livro = await this.livroRepository.buscarPorId(livroId);
      if (!livro) {
        throw new AppError(`O Livro com ID ${livroId} não está cadastrado no sistema.`);
      }

      if (livro.quantidade_disponivel <= 0) {
        throw new AppError(`O livro '${livro.titulo}' está indisponível para empréstimo (estoque zerado).`);
      }

      const novoEmprestimo = new Emprestimo(livroId, clienteId);
      const emprestimoCriado = await this.emprestimoRepository.criar(novoEmprestimo);

      await this.livroRepository.atualizar(livroId, {
        quantidade_disponivel: livro.quantidade_disponivel - 1
      });

      return emprestimoCriado;
    } catch (error) {
      throw error;
    }
  }

  async realizarDevolucao(emprestimoId: number): Promise<IEmprestimo> {
    try {
      if (isNaN(emprestimoId) || emprestimoId <= 0) {
        throw new AppError('ID do empréstimo informado é inválido.');
      }

      const emprestimo = await this.emprestimoRepository.buscarPorId(emprestimoId);
      if (!emprestimo) {
        throw new AppError(`Empréstimo com ID ${emprestimoId} não encontrado.`);
      }

      if (emprestimo.status === 'DEVOLVIDO') {
        throw new AppError(`Este empréstimo (ID ${emprestimoId}) já foi finalizado/devolvido anteriormente.`);
      }

      const emprestimoDevolvido = await this.emprestimoRepository.devolver(emprestimoId);
      if (!emprestimoDevolvido) {
        throw new Error('Falha ao processar a devolução no banco de dados.');
      }

      const livro = await this.livroRepository.buscarPorId(emprestimo.livro_id);
      if (livro) {
        await this.livroRepository.atualizar(livro.id!, {
          quantidade_disponivel: livro.quantidade_disponivel + 1
        });
      }

      return emprestimoDevolvido;
    } catch (error) {
      throw error;
    }
  }

  async listarTodos(): Promise<any[]> {
    try {
      return await this.emprestimoRepository.listarTodos();
    } catch (error) {
      throw new Error('Falha ao buscar o histórico de empréstimos.');
    }
  }

  async listarAtivos(): Promise<any[]> {
    try {
      return await this.emprestimoRepository.listarAtivos();
    } catch (error) {
      throw new Error('Falha ao buscar a lista de empréstimos ativos.');
    }
  }

  async buscarPorId(id: number): Promise<IEmprestimo> {
    try {
      const emprestimo = await this.emprestimoRepository.buscarPorId(id);
      if (!emprestimo) {
        throw new AppError(`Empréstimo com ID ${id} não encontrado.`);
      }
      return emprestimo;
    } catch (error) {
      throw error;
    }
  }
}