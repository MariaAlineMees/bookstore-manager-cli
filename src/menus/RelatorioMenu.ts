export class RelatorioMenu {
    static exibir(): void {
        console.log('\n========================================');
        console.log('       📊 RELATÓRIOS E CONSULTAS        ');
        console.log('========================================');
        console.log('1. Listar Livros por Autor específico');
        console.log('2. Listar apenas Livros Disponíveis em Estoque');
        console.log('3. Listar Livros Atualmente Emprestados (e quem pegou)');
        console.log('4. Histórico Completo de Empréstimos de um Cliente');
        console.log('5. Top 5 Livros Mais Populares (Mais Emprestados)');
        console.log('0. Voltar ao Menu Principal');
        console.log('========================================');
    }
}