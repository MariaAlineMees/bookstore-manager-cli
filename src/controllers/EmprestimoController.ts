import { EmprestimoService } from '../services/EmprestimoService';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const perguntar = (pergunta: string): Promise<string> => {
  return new Promise((resolve) => rl.question(pergunta, resolve));
};

export class EmprestimoController {
  private emprestimoService = new EmprestimoService();

  async gerenciarEmprestimos(): Promise<void> {
    while (true) {
      console.log('\n========================================');
      console.log('       🔄 GERENCIAMENTO DE EMPRÉSTIMOS  ');
      console.log('========================================');
      console.log('1. Registrar Novo Empréstimo');
      console.log('2. Registrar Devolução');
      console.log('3. Listar Empréstimos Ativos');
      console.log('4. Listar Histórico Completo');
      console.log('5. Consultar Empréstimo por ID');
      console.log('0. Voltar ao Menu Principal');
      console.log('========================================');

      const opcao = await perguntar('Escolha uma opção: ');

      switch (opcao.trim()) {
        case '1':
          await this.realizarEmprestimo();
          break;
        case '2':
          await this.realizarDevolucao();
          break;
        case '3':
          await this.listarAtivos();
          break;
        case '4':
          await this.listarTodos();
          break;
        case '5':
          await this.consultarPorId();
          break;
        case '0':
          return;
        default:
          console.log('❌ Opção inválida! Tente novamente.');
      }
    }
  }

  private async realizarEmprestimo(): Promise<void> {
    console.log('\n--- 🤝 Registrar Novo Empréstimo ---');
    const livroIdStr = await perguntar('Digite o ID do Livro: ');
    const clienteIdStr = await perguntar('Digite o ID do Cliente: ');

    try {
      const novoEmprestimo = await this.emprestimoService.realizarEmprestimo(
        Number(livroIdStr),
        Number(clienteIdStr)
      );
      console.log(`\n✅ Empréstimo realizado com sucesso! ID gerado: ${novoEmprestimo.id}`);
      console.log('💡 O estoque do livro foi reduzido em 1 unidade automaticamente.');
    } catch (error: any) {
      console.log(`\n❌ Erro ao realizar empréstimo: ${error.message}`);
    }
  }

  private async realizarDevolucao(): Promise<void> {
    console.log('\n--- 📥 Registrar Devolução ---');
    const emprestimoIdStr = await perguntar('Digite o ID do Empréstimo que está sendo devolvido: ');

    try {
      const emprestimoDevolvido = await this.emprestimoService.realizarDevolucao(Number(emprestimoIdStr));
      console.log(`\n✅ Devolução registrada com sucesso! Data de devolução: ${emprestimoDevolvido.data_devolucao}`);
      console.log('💡 O estoque do livro foi aumentado em 1 unidade automaticamente.');
    } catch (error: any) {
      console.log(`\n❌ Erro ao registrar devolução: ${error.message}`);
    }
  }

  private async listarAtivos(): Promise<void> {
    console.log('\n--- 🟡 Empréstimos Ativos (Pelo Título e Nome) ---');
    try {
      const ativos = await this.emprestimoService.listarAtivos();
      if (ativos.length === 0) {
        console.log('Nenhum empréstimo ativo no momento.');
      } else {
        console.table(ativos);
      }
    } catch (error: any) {
      console.log(`\n❌ Erro: ${error.message}`);
    }
  }

  private async listarTodos(): Promise<void> {
    console.log('\n--- 📜 Histórico Completo de Empréstimos ---');
    try {
      const todos = await this.emprestimoService.listarTodos();
      if (todos.length === 0) {
        console.log('Nenhum registro de empréstimo encontrado.');
      } else {
        console.table(todos);
      }
    } catch (error: any) {
      console.log(`\n❌ Erro: ${error.message}`);
    }
  }

  private async consultarPorId(): Promise<void> {
    console.log('\n--- 🔍 Consultar Empréstimo por ID ---');
    const idStr = await perguntar('Digite o ID do Empréstimo: ');
    try {
      const emprestimo = await this.emprestimoService.buscarPorId(Number(idStr));
      console.log('\n✅ Registro encontrado:');
      console.table([emprestimo]);
    } catch (error: any) {
      console.log(`\n❌ Erro: ${error.message}`);
    }
  }
}