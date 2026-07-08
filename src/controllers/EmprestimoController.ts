import { EmprestimoService } from '../services/EmprestimoService';
import { perguntar } from '../utils/input';
import { EmprestimoMenu } from '../menus/EmprestimoMenu';
import { AppError } from '../utils/AppError';
import { DateUtils } from '../utils/DateUtils'; 

export class EmprestimoController {
  private emprestimoService = new EmprestimoService();

  async gerenciarEmprestimos(): Promise<void> {
    while (true) {
      EmprestimoMenu.exibir();

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
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async realizarDevolucao(): Promise<void> {
    console.log('\n--- 📥 Registrar Devolução ---');
    const emprestimoIdStr = await perguntar('Digite o ID do Empréstimo que está sendo devolvido: ');

    try {
      const emprestimoDevolvido = await this.emprestimoService.realizarDevolucao(Number(emprestimoIdStr));
      
      const dataFormatada = DateUtils.formatarDataBR(emprestimoDevolvido.data_devolucao);
      console.log(`\n✅ Devolução registrada com sucesso! Data de devolução: ${dataFormatada}`);
      console.log('💡 O estoque do livro foi aumentado em 1 unidade automaticamente.');
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async listarAtivos(): Promise<void> {
    console.log('\n--- 🟡 Empréstimos Ativos (Pelo Título e Nome) ---');
    try {
      const ativos = await this.emprestimoService.listarAtivos();
      if (ativos.length === 0) {
        console.log('Nenhum empréstimo ativo no momento.');
      } else {
  
        const ativosFormatados = ativos.map((emp: any) => ({
          ...emp,
          data_emprestimo: DateUtils.formatarDataBR(emp.data_emprestimo)
        }));
        console.table(ativosFormatados);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async listarTodos(): Promise<void> {
    console.log('\n--- 📜 Histórico Completo de Empréstimos ---');
    try {
      const todos = await this.emprestimoService.listarTodos();
      if (todos.length === 0) {
        console.log('Nenhum registro de empréstimo encontrado.');
      } else {
        // 👇 Formatando as duas datas (Empréstimo e Devolução)
        const todosFormatados = todos.map((emp: any) => ({
          ...emp,
          data_emprestimo: DateUtils.formatarDataBR(emp.data_emprestimo),
          data_devolucao: DateUtils.formatarDataBR(emp.data_devolucao)
        }));
        console.table(todosFormatados);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async consultarPorId(): Promise<void> {
    console.log('\n--- 🔍 Consultar Empréstimo por ID ---');
    const idStr = await perguntar('Digite o ID do Empréstimo: ');
    try {
      const emprestimo: any = await this.emprestimoService.buscarPorId(Number(idStr));
      console.log('\n✅ Registro encontrado:');
      
      const emprestimoFormatado = {
        ...emprestimo,
        data_emprestimo: DateUtils.formatarDataBR(emprestimo.data_emprestimo),
        data_devolucao: DateUtils.formatarDataBR(emprestimo.data_devolucao)
      };
      
      console.table([emprestimoFormatado]);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }
}