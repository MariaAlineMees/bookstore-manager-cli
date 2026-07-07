import { MenuPrincipal } from './menus/MenuPrincipal';
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
    console.clear(); 
  
    MenuPrincipal.exibir();

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
        console.log('\n👋 Encerrando o BookStore Manager CLI... Até logo!');
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