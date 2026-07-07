import { LivroRepository } from '../repositories/LivroRepository';
import { AutorRepository } from '../repositories/AutorRepository';
import { Livro, ILivro } from '../models/Livro';
import { AppError } from '../utils/AppError'; 

export class LivroService {
  private livroRepository = new LivroRepository();
  private autorRepository = new AutorRepository();

  async cadastrar(titulo: string, autorId: number, quantidade: number = 1, anoPublicacao?: number): Promise<ILivro> {
    try {
      if (!titulo || titulo.trim() === '') {
        throw new AppError('O título do livro é obrigatório.');
      }
      if (isNaN(autorId) || autorId <= 0) {
        throw new AppError('ID do autor informado é inválido.');
      }
      if (quantidade < 0) {
        throw new AppError('A quantidade disponível em estoque não pode ser negativa.');
      }

      const autorExiste = await this.autorRepository.buscarPorId(autorId);
      if (!autorExiste) {
        throw new AppError(`Não é possível cadastrar: O Autor com ID ${autorId} não existe no banco de dados. Cadastre o autor primeiro!`);
      }

      const novoLivro = new Livro(titulo.trim(), autorId, quantidade, anoPublicacao);
      return await this.livroRepository.criar(novoLivro);
    } catch (error) {
      throw error;
    }
  }

  async listar(): Promise<any[]> {
    try {
      return await this.livroRepository.listarTodos();
    } catch (error) {
      throw new Error('Falha ao buscar a lista de livros no banco de dados.');
    }
  }

  async buscarPorId(id: number): Promise<ILivro> {
    try {
      if (isNaN(id) || id <= 0) {
        throw new AppError('ID do livro informado é inválido.');
      }
      const livro = await this.livroRepository.buscarPorId(id);
      if (!livro) {
        throw new AppError(`Livro com ID ${id} não foi encontrado.`);
      }
      return livro;
    } catch (error) {
      throw error;
    }
  }

  async atualizar(id: number, dados: Partial<Livro>): Promise<ILivro> {
    try {
      await this.buscarPorId(id);

      if (dados.autor_id !== undefined && !isNaN(dados.autor_id)) {
        const autorExiste = await this.autorRepository.buscarPorId(dados.autor_id);
        if (!autorExiste) {
          throw new AppError(`Não é possível atualizar: O Autor com ID ${dados.autor_id} não existe.`);
        }
      }

      const livroAtualizado = await this.livroRepository.atualizar(id, dados);
      if (!livroAtualizado) {
        throw new AppError('Não foi possível atualizar o livro.');
      }
      return livroAtualizado;
    } catch (error) {
      throw error;
    }
  }

  async remover(id: number): Promise<boolean> {
    try {
      await this.buscarPorId(id);
      return await this.livroRepository.remover(id);
    } catch (error) {
      throw error;
    }
  }
}