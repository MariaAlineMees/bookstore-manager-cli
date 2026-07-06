import { AutorController } from './controllers/AutorController';
import { LivroController } from './controllers/LivroController';
import { ClienteController } from './controllers/ClienteController';
import { EmprestimoController } from './controllers/EmprestimoController';
import { RelatorioController } from './controllers/RelatorioController';
import { perguntar, fecharEntrada } from './utils/input';

const autorController = new AutorController();
const livroController = new LivroController();
const clienteController = new ClienteController();
const emprestimoController = new EmprestimoController();
const relatorioController = new RelatorioController();

async function iniciarSistema(): Promise<void> {
  while (true) {
    console.clear(); // Limpa o terminal para deixar o menu bonito
    console.log('====================================================');
    console.log('        🏢 SISTEMA DE GESTÃO DE LIVRARIA CLI        ');
    console.log('====================================================');
    console.log('1. ✍️  Gerenciar Autores');
    console.log('2. 📘 Gerenciar Livros');
    console.log('3. 👥 Gerenciar Clientes');
    console.log('4. 🔄 Gerenciar Empréstimos e Devoluções');
    console.log('5. 📊 Relatórios e Consultas Avançadas');
    console.log('0. 🚪 Sair do Sistema');
    console.log('====================================================');

    const opcao = await perguntar('Escolha um módulo para acessar: ');

    switch (opcao.trim()) {
      case '1':
        await autorController.gerenciarAutores();
        break;
      case '2':
        await livroController.gerenciarLivros();
        break;
      case '3':
        await clienteController.gerenciarClientes();
        break;
      case '4':
        await emprestimoController.gerenciarEmprestimos();
        break;
      case '5':
        await relatorioController.exibirMenuRelatorios();
        break;
      case '0':
        console.log('\n👋 Encerrando o sistema da livraria... Até logo!');
        fecharEntrada();
        process.exit(0);
      default:
        console.log('❌ Opção inválida! Pressione Enter para tentar novamente...');
        await perguntar('');
    }
  }
}

iniciarSistema().catch((erro) => {
  console.error('❌ Erro fatal na execução do sistema:', erro);
  fecharEntrada();
});