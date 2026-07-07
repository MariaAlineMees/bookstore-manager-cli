import { AutorRepository } from '../repositories/AutorRepository';
import { Autor, IAutor } from '../models/Autor';
import { AppError } from '../utils/AppError';

export class AutorService {
  private autorRepository = new AutorRepository();

  async cadastrar(nome: string, nacionalidade?: string, dataNascimento?: string): Promise<IAutor> {
    try {
      if (!nome || nome.trim() === '') {
        throw new AppError('O nome do autor é obrigatório para o cadastro.');
      }
      const novoAutor = new Autor(nome.trim(), nacionalidade?.trim(), dataNascimento?.trim());
      return await this.autorRepository.criar(novoAutor);
    } catch (error) {
      throw error;
    }
  }

  async listar(): Promise<IAutor[]> {
    try {
      return await this.autorRepository.listarTodos();
    } catch (error) {
      throw new AppError('Falha ao buscar a lista de autores no banco de dados.');
    }
  }

  async buscarPorId(id: number): Promise<IAutor> {
    try {
      if (isNaN(id) || id <= 0) {
        throw new AppError('ID inválido informado.');
      }
      const autor = await this.autorRepository.buscarPorId(id);
      if (!autor) {
        throw new AppError(`Autor com ID ${id} não foi encontrado.`);
      }
      return autor;
    } catch (error) {
      throw error;
    }
  }

  async atualizar(id: number, dados: Partial<Autor>): Promise<IAutor> {
    try {
      await this.buscarPorId(id);
      
      const autorAtualizado = await this.autorRepository.atualizar(id, dados);
      if (!autorAtualizado) {
        throw new AppError('Não foi possível atualizar o autor.');
      }
      return autorAtualizado;
    } catch (error) {
      throw error;
    }
  }

  async remover(id: number): Promise<boolean> {
    try {
      await this.buscarPorId(id);
      return await this.autorRepository.remover(id);
    } catch (error) {
      throw error;
    }
  }
}