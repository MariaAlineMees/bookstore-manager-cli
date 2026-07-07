import { ClienteService } from '../services/ClienteService';
import { perguntar } from '../utils/input';
import { ClienteMenu } from '../menus/ClienteMenu';
import { AppError } from '../utils/AppError';

export class ClienteController {
  private clienteService = new ClienteService();

  async gerenciarClientes(): Promise<void> {
    while (true) {
      ClienteMenu.exibir();

      const opcao = await perguntar('Escolha uma opção: ');

      switch (opcao.trim()) {
        case '1':
          await this.cadastrarCliente();
          break;
        case '2':
          await this.listarClientes();
          break;
        case '3':
          await this.consultarCliente();
          break;
        case '4':
          await this.atualizarCliente();
          break;
        case '5':
          await this.removerCliente();
          break;
        case '0':
          return;
        default:
          console.log('❌ Opção inválida! Tente novamente.');
      }
    }
  }

  private async cadastrarCliente(): Promise<void> {
    console.log('\n--- ✍️  Cadastrar Cliente ---');
    const nome = await perguntar('Nome do Cliente (obrigatório): ');
    const email = await perguntar('E-mail (obrigatório): ');
    const telefone = await perguntar('Telefone (opcional): ');

    try {
      const novoCliente = await this.clienteService.cadastrar(nome, email, telefone);
      console.log(`\n✅ Cliente cadastrado com sucesso! ID gerado: ${novoCliente.id}`);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async listarClientes(): Promise<void> {
    console.log('\n--- 📋 Lista de Clientes ---');
    try {
      const clientes = await this.clienteService.listar();
      if (clientes.length === 0) {
        console.log('Nenhum cliente cadastrado no sistema.');
      } else {
        console.table(clientes);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async consultarCliente(): Promise<void> {
    console.log('\n--- 🔍 Consultar Cliente por ID ---');
    const idStr = await perguntar('Digite o ID do Cliente: ');
    try {
      const cliente = await this.clienteService.buscarPorId(Number(idStr));
      console.log('\n✅ Cliente encontrado:');
      console.table([cliente]);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async atualizarCliente(): Promise<void> {
    console.log('\n--- ✏️  Atualizar Cliente ---');
    const idStr = await perguntar('Digite o ID do Cliente que deseja atualizar: ');
    const nome = await perguntar('Novo Nome (deixe em branco para manter): ');
    const email = await perguntar('Novo E-mail (deixe em branco para manter): ');
    const telefone = await perguntar('Novo Telefone (deixe em branco para manter): ');

    try {
      const dadosAtualizados: any = {};
      if (nome.trim() !== '') dadosAtualizados.nome = nome.trim();
      if (email.trim() !== '') dadosAtualizados.email = email.trim();
      if (telefone.trim() !== '') dadosAtualizados.telefone = telefone.trim();

      const clienteAtualizado = await this.clienteService.atualizar(Number(idStr), dadosAtualizados);
      console.log('\n✅ Cliente atualizado com sucesso!');
      console.table([clienteAtualizado]);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }

  private async removerCliente(): Promise<void> {
    console.log('\n--- 🗑️  Remover Cliente ---');
    const idStr = await perguntar('Digite o ID do Cliente que deseja remover: ');
    try {
      await this.clienteService.remover(Number(idStr));
      console.log(`\n✅ Cliente ID ${idStr} removido com sucesso!`);
    } catch (error: any) {
      if (error instanceof AppError) {
        console.log(`\n⚠️  Atenção: ${error.message}`);
      } else {
        console.log(`\n❌ Erro inesperado: ${error.message}`);
      }
    }
  }
}