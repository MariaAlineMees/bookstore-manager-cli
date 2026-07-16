import { AutorService } from '../services/AutorService';
import { perguntar } from '../utils/input';
import { AutorMenu } from '../menus/AutorMenu';
import { AppError } from '../utils/AppError';
import { DateUtils } from '../utils/DateUtils';
export class AutorController {
  private autorService = new AutorService();

  async gerenciarAutores(): Promise<void> {
    while (true) {
      AutorMenu.exibir();

      const opcao = await perguntar('Escolha uma opção: ');

      switch (opcao.trim()) {
        case '1':
          await this.cadastrarAutor();
          break;
        case '2':
          await this.listarAutores();
          break;
        case '3':
          await this.consultarAutor();
          break;
        case '4':
          await this.atualizarAutor();
          break;
        case '5':
          await this.removerAutor();
          break;
        case '0':
          return;
        default:
          console.log('❌ Opção inválida! Tente novamente.');
      }
    }
  }

  private async cadastrarAutor(): Promise<void> {
    console.log('\n--- ✍️  Cadastrar Autor ---');
    const nome = await perguntar('Nome do Autor (obrigatório): ');
    const nacionalidade = await perguntar('Nacionalidade (opcional): ');
    const anoStr = await perguntar('Data de Nascimento no formato AAAA-MM-DD (opcional): ');

    const ano: any = anoStr.trim() !== '' ? anoStr.trim() : undefined;

    try {
      const novoAutor = await this.autorService.cadastrar(nome, nacionalidade, ano);
      console.log(`\n✅ Autor cadastrado com sucesso! ID gerado: ${novoAutor.id}`);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async listarAutores(): Promise<void> {
    console.log('\n--- 📋 Lista de Autores ---');
    try {
      const autores = await this.autorService.listar();
      if (autores.length === 0) {
        console.log('Nenhum autor cadastrado no sistema.');
      } else {
        const autoresFormatados = autores.map((autor: any) => ({
          ...autor,
          data_nascimento: autor.data_nascimento ? DateUtils.formatarDataBR(autor.data_nascimento) : 'N/D'
        }));
        console.table(autoresFormatados);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async consultarAutor(): Promise<void> {
    console.log('\n--- 🔍 Consultar Autor por ID ---');
    const idStr = await perguntar('Digite o ID do Autor: ');
    try {
      const autor: any = await this.autorService.buscarPorId(Number(idStr));
      console.log('\n✅ Autor encontrado:');

      const autorFormatado = {
        ...autor,
        data_nascimento: autor.data_nascimento ? DateUtils.formatarDataBR(autor.data_nascimento) : 'N/D'
      };
      console.table([autorFormatado]);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async atualizarAutor(): Promise<void> {
    console.log('\n--- ✏️  Atualizar Autor ---');
    const idStr = await perguntar('Digite o ID do Autor que deseja atualizar: ');
    const nome = await perguntar('Novo Nome (deixe em branco para manter): ');
    const nacionalidade = await perguntar('Nova Nacionalidade (deixe em branco para manter): ');
    const dataNascimento = await perguntar('Nova Data (AAAA-MM-DD) (deixe em branco para manter): ');

    try {
      const dadosAtualizados: any = {};
      if (nome.trim() !== '') dadosAtualizados.nome = nome.trim();
      if (nacionalidade.trim() !== '') dadosAtualizados.nacionalidade = nacionalidade.trim();
      if (dataNascimento.trim() !== '') dadosAtualizados.data_nascimento = dataNascimento.trim();

      const autorAtualizado = await this.autorService.atualizar(Number(idStr), dadosAtualizados);
      console.log('\n✅ Autor atualizado com sucesso!');
      console.table([autorAtualizado]);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async removerAutor(): Promise<void> {
    console.log('\n--- 🗑️  Remover Autor ---');
    const idStr = await perguntar('Digite o ID do Autor que deseja remover: ');
    try {
      await this.autorService.remover(Number(idStr));
      console.log(`\n✅ Autor ID ${idStr} removido com sucesso!`);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }
}