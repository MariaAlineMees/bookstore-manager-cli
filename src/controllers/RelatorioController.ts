import { RelatorioService } from '../services/RelatorioService';
import { perguntar } from '../utils/input';

export class RelatorioController {
  private relatorioService = new RelatorioService();

  async exibirMenuRelatorios(): Promise<void> {
    while (true) {
      console.log('\n========================================');
      console.log('       📊 RELATÓRIOS E CONSULTAS        ');
      console.log('========================================');
      console.log('1. Listar Livros por Autor específico');
      console.log('2. Listar apenas Livros Disponíveis em Estoque');
      console.log('3. Listar Livros Atualmente Emprestados (e quem pegou)');
      console.log('4. Histórico Completo de Empréstimos de um Cliente');
      console.log('0. Voltar ao Menu Principal');
      console.log('========================================');

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
      console.log(`\n❌ Erro: ${error.message}`);
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
      console.log(`\n❌ Erro: ${error.message}`);
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
      console.log(`\n❌ Erro: ${error.message}`);
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
      console.log(`\n❌ Erro: ${error.message}`);
    }
  }
}