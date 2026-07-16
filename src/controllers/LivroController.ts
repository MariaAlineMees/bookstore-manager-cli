import { LivroService } from '../services/LivroService';
import { perguntar } from '../utils/input';
import { LivroMenu } from '../menus/LivroMenu';
import { AppError } from '../utils/AppError';

export class LivroController {
  private livroService = new LivroService();

  async gerenciarLivros(): Promise<void> {
    while (true) {

      LivroMenu.exibir();

      const opcao = await perguntar('Escolha uma opção: ');

      switch (opcao.trim()) {
        case '1':
          await this.cadastrarLivro();
          break;
        case '2':
          await this.listarLivros();
          break;
        case '3':
          await this.consultarLivro();
          break;
        case '4':
          await this.atualizarLivro();
          break;
        case '5':
          await this.removerLivro();
          break;
        case '0':
          return;
        default:
          console.log('❌ Opção inválida! Tente novamente.');
      }
    }
  }

  private async cadastrarLivro(): Promise<void> {
    console.log('\n--- ✍️  Cadastrar Livro ---');
    const titulo = await perguntar('Título do Livro (obrigatório): ');
    const autorIdStr = await perguntar('ID do Autor (obrigatório): ');
    const quantidadeStr = await perguntar('Quantidade Disponível em estoque (padrão 1): ');
    const anoStr = await perguntar('Ano de Publicação (opcional): ');

    const autorId = Number(autorIdStr);
    const quantidade = quantidadeStr.trim() !== '' ? Number(quantidadeStr) : 1;
    const ano = anoStr.trim() !== '' ? Number(anoStr) : undefined;

    try {
      const novoLivro = await this.livroService.cadastrar(titulo, autorId, quantidade, ano);
      console.log(`\n✅ Livro cadastrado com sucesso! ID gerado: ${novoLivro.id}`);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async listarLivros(): Promise<void> {
    console.log('\n--- 📋 Lista de Livros ---');
    try {
      const livros = await this.livroService.listar();
      if (livros.length === 0) {
        console.log('Nenhum livro cadastrado no sistema.');
      } else {

        const livrosFormatados = livros.map((livro: any) => ({
          ID: livro.id,
          Título: livro.titulo,
          'ID Autor': livro.autor_id,
          Ano: livro.ano_publicacao || 'N/D',
          Qtd: livro.quantidade_disponivel,
          Status: livro.quantidade_disponivel > 0 ? '🟢 Disponível' : '🔴 Indisponível'
        }));
        console.table(livrosFormatados);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async consultarLivro(): Promise<void> {
    console.log('\n--- 🔍 Consultar Livro por ID ---');
    const idStr = await perguntar('Digite o ID do Livro: ');
    try {
      const livro = await this.livroService.buscarPorId(Number(idStr));

      const livroFormatado = {
        ID: livro.id,
        Título: livro.titulo,
        'ID Autor': livro.autor_id,
        Ano: livro.ano_publicacao || 'N/D',
        Qtd: livro.quantidade_disponivel,
        Status: livro.quantidade_disponivel > 0 ? '🟢 Disponível' : '🔴 Indisponível'
      };

      console.log('\n✅ Livro encontrado:');
      console.table([livroFormatado]);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async atualizarLivro(): Promise<void> {
    console.log('\n--- ✏️  Atualizar Livro ---');
    const idStr = await perguntar('Digite o ID do Livro que deseja atualizar: ');
    const titulo = await perguntar('Novo Título (deixe em branco para manter): ');
    const autorIdStr = await perguntar('Novo ID do Autor (deixe em branco para manter): ');
    const quantidadeStr = await perguntar('Nova Quantidade Disponível (deixe em branco para manter): ');
    const anoStr = await perguntar('Novo Ano de Publicação (deixe em branco para manter): ');

    try {
      const dadosAtualizados: any = {};

      if (titulo.trim() !== '') dadosAtualizados.titulo = titulo.trim();
      if (autorIdStr.trim() !== '') dadosAtualizados.autor_id = Number(autorIdStr.trim());
      if (quantidadeStr.trim() !== '') dadosAtualizados.quantidade_disponivel = Number(quantidadeStr.trim());

      if (anoStr.trim() !== '') dadosAtualizados.ano_publicacao = Number(anoStr.trim());

      const livroAtualizado = await this.livroService.atualizar(Number(idStr), dadosAtualizados);
      console.log('\n✅ Livro atualizado com sucesso!');
      console.table([livroAtualizado]);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async removerLivro(): Promise<void> {
    console.log('\n--- 🗑️  Remover Livro ---');
    const idStr = await perguntar('Digite o ID do Livro que deseja remover: ');
    try {
      await this.livroService.remover(Number(idStr));
      console.log(`\n✅ Livro ID ${idStr} removido com sucesso!`);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }
}