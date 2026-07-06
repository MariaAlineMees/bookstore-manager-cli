import { AutorService } from '../services/AutorService';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const perguntar = (pergunta: string): Promise<string> => {
  return new Promise((resolve) => rl.question(pergunta, resolve));
};

export class AutorController {
  private autorService = new AutorService();

  async gerenciarAutores(): Promise<void> {
    while (true) {
      console.log('\n========================================');
      console.log('       📚 GERENCIAMENTO DE AUTORES      ');
      console.log('========================================');
      console.log('1. Cadastrar novo Autor');
      console.log('2. Listar todos os Autores');
      console.log('3. Consultar Autor por ID');
      console.log('4. Atualizar Autor');
      console.log('5. Remover Autor');
      console.log('0. Voltar ao Menu Principal');
      console.log('========================================');

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
    console.log('\n--- ✍️ Cadastrar Autor ---');
    const nome = await perguntar('Nome do Autor (obrigatório): ');
    const nacionalidade = await perguntar('Nacionalidade (opcional): ');
    const dataNascimento = await perguntar('Data de Nascimento AAAA-MM-DD (opcional): ');

    try {
      const novoAutor = await this.autorService.cadastrar(nome, nacionalidade, dataNascimento);
      console.log(`\n✅ Autor cadastrado com sucesso! ID gerado: ${novoAutor.id}`);
    } catch (error: any) {
      console.log(`\n❌ Erro ao cadastrar autor: ${error.message}`);
    }
  }

  private async listarAutores(): Promise<void> {
    console.log('\n--- 📋 Lista de Autores ---');
    try {
      const autores = await this.autorService.listar();
      if (autores.length === 0) {
        console.log('Nenhum autor cadastrado no sistema.');
      } else {
        console.table(autores);
      }
    } catch (error: any) {
      console.log(`\n❌ Erro: ${error.message}`);
    }
  }

  private async consultarAutor(): Promise<void> {
    console.log('\n--- 🔍 Consultar Autor por ID ---');
    const idStr = await perguntar('Digite o ID do Autor: ');
    try {
      const autor = await this.autorService.buscarPorId(Number(idStr));
      console.log('\n✅ Autor encontrado:');
      console.table([autor]);
    } catch (error: any) {
      console.log(`\n❌ Erro: ${error.message}`);
    }
  }

  private async atualizarAutor(): Promise<void> {
    console.log('\n--- ✏️ Atualizar Autor ---');
    const idStr = await perguntar('Digite o ID do Autor que deseja atualizar: ');
    const nome = await perguntar('Novo Nome (deixe em branco para manter o atual): ');
    const nacionalidade = await perguntar('Nova Nacionalidade (deixe em branco para manter): ');

    try {
      const autorAtualizado = await this.autorService.atualizar(Number(idStr), {
        nome: nome || undefined,
        nacionalidade: nacionalidade || undefined
      } as any);
      console.log('\n✅ Autor atualizado com sucesso!');
      console.table([autorAtualizado]);
    } catch (error: any) {
      console.log(`\n❌ Erro: ${error.message}`);
    }
  }

  private async removerAutor(): Promise<void> {
    console.log('\n--- 🗑️ Remover Autor ---');
    const idStr = await perguntar('Digite o ID do Autor que deseja remover: ');
    try {
      await this.autorService.remover(Number(idStr));
      console.log(`\n✅ Autor ID ${idStr} removido com sucesso!`);
    } catch (error: any) {
      console.log(`\n❌ Erro: ${error.message}`);
    }
  }
}