import { RelatorioService } from '../services/RelatorioService';
import { perguntar } from '../utils/input';
import { RelatorioMenu } from '../menus/RelatorioMenu';
import { AppError } from '../utils/AppError';

export class RelatorioController {
  private relatorioService = new RelatorioService();

  async exibirMenuRelatorios(): Promise<void> {
    while (true) {
      RelatorioMenu.exibir();

      const opcao = await perguntar('Escolha um relatório para gerar: ');

      switch (opcao.trim()) {
        case '1':
          await this.relatorioLivrosPorAutor();
          break;
        case '2':
          await this.relatorioLivrosDisponiveis();
          break;
        case '3':
          await this.relatorioLivrosEmprestados();
          break;
        case '4':
          await this.relatorioHistoricoCliente();
          break;
        case '5':
          await this.relatorioLivrosPopulares();
          break;
        case '0':
          return;
        default:
          console.log('❌ Opção inválida! Tente novamente.');
      }
    }
  }

  private async relatorioLivrosPorAutor(): Promise<void> {
    console.log('\n--- 📚 Livros por Autor ---');
    const autorIdStr = await perguntar('Digite o ID do Autor: ');

    try {
      const livros = await this.relatorioService.listarLivrosPorAutor(Number(autorIdStr));
      if (livros.length === 0) {
        console.log('Nenhum livro cadastrado para este autor no momento.');
      } else {
        console.table(livros);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async relatorioLivrosDisponiveis(): Promise<void> {
    console.log('\n--- 🟢 Livros Disponíveis em Estoque ---');
    try {
      const livros = await this.relatorioService.listarLivrosDisponiveis();
      if (livros.length === 0) {
        console.log('Atenção: Todos os livros estão sem estoque ou emprestados!');
      } else {
        console.table(livros);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async relatorioLivrosEmprestados(): Promise<void> {
    console.log('\n--- 🟡 Livros Atualmente Emprestados ---');
    try {
      const emprestados = await this.relatorioService.listarLivrosEmprestados();
      if (emprestados.length === 0) {
        console.log('Ótima notícia: Nenhum livro pendente de devolução no momento!');
      } else {
        console.table(emprestados);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async relatorioHistoricoCliente(): Promise<void> {
    console.log('\n--- 📜 Histórico de Empréstimos do Cliente ---');
    const clienteIdStr = await perguntar('Digite o ID do Cliente: ');

    try {
      const historico = await this.relatorioService.listarHistoricoPorCliente(Number(clienteIdStr));
      if (historico.length === 0) {
        console.log('Este cliente ainda não realizou nenhum empréstimo na livraria.');
      } else {
        console.table(historico);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async relatorioLivrosPopulares(): Promise<void> {
    console.log('\n--- 🏆 Top 5 Livros Mais Populares ---');
    try {
      const populares = await this.relatorioService.listarLivrosPopulares();
      if (populares.length === 0) {
        console.log('Ainda não há histórico de empréstimos suficiente.');
      } else {
        console.table(populares);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }
}