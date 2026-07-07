# 🏢 BookStore Manager CLI 📚

Uma aplicação de linha de comando (CLI) interativa e robusta desenvolvida em **Node.js** com **TypeScript** e banco de dados relacional **PostgreSQL**. 

O sistema permite o gerenciamento completo de uma livraria, realizando controle de estoque automatizado, cadastro de clientes, vínculo de autores e consultas relacionais complexas em tempo real direto no terminal.

---

## 📖 Sobre o projeto

O **BookStore Manager CLI** foi idealizado para simular a rotina administrativa de uma livraria real. O sistema aplica os princípios fundamentais da **Engenharia de Software Moderno**, dividindo as responsabilidades em uma **Arquitetura em Camadas (Layered Architecture)** utilizando o padrão **Repository**.

Toda a comunicação de entrada e saída é feita através de um menu interativo contínuo no terminal, garantindo tratamento de erros em tempo de execução sem travar a aplicação e mantendo a integridade dos dados através de restrições relacionais no banco de dados.

---

## 🎯 Objetivos e Competências Desenvolvidas

Praticar e consolidar conceitos avançados do desenvolvimento Back-end:

* **TypeScript & POO:** Classes tipadas, interfaces robustas e encapsulamento de lógica.
* **Banco de Dados Relacional (PostgreSQL):** Modelagem de dados, chaves primárias/estrangeiras (`PK/FK`) e restrições de unicidade (`UNIQUE`).
* **Consultas Avançadas (`JOIN`):** Junção de múltiplas tabelas para geração de relatórios gerenciais precisos.
* **Arquitetura Limpa:** Separação estrita entre Interface (`Controller`), Lógica (`Service`), Acesso a Dados (`Repository`) e Banco (`Database`).
* **Tratamento de Exceções:** Prevenção contra travamentos por entradas inválidas ou falhas de regras de negócio.
* **Versionamento Semântico:** Histórico Git limpo e organizado baseado no fluxo GitFlow.

---

## 🚀 Tecnologias e Ferramentas Utilizadas

* **[Node.js](https://nodejs.org/)** — Ambiente de execução JavaScript no servidor
* **[TypeScript](https://www.typescriptlang.org/)** — Superset tipado para segurança em tempo de compilação
* **[PostgreSQL](https://www.postgresql.org/)** — Banco de dados relacional de alta performance
* **[`pg` (node-postgres)](https://node-postgres.com/)** — Driver de conexão assíncrona com pool de queries
* **[`dotenv`](https://github.com/motdotla/dotenv)** — Gerenciamento seguro de credenciais de ambiente
* **[`ts-node`](https://typestrong.org/ts-node/)** — Compilação e execução direta em ambiente de desenvolvimento

---

## ⚠️ Pré-requisitos

Antes de clonar e executar o projeto, certifique-se de ter instalado em sua máquina:

* [Node.js](https://nodejs.org/en/) (Versão LTS recomendada, 18+)
* [PostgreSQL](https://www.postgresql.org/download/) rodando localmente na porta padrão (`5432`)
* [Git](https://git-scm.com/)

---

## 💻 Como Instalar e Executar

**1. Clone o repositório:**
```bash
git clone https://github.com/MariaAlineMees/bookstore-manager-cli.git
```

**2. Acesse a pasta do projeto:**
```bash
cd bookstore-manager-cli
```

**3. Instale as dependências:**
```bash
npm install
```

**4. Configure as Variáveis de Ambiente:**

Crie um arquivo chamado `.env` na raiz do projeto e adicione as suas configurações locais do PostgreSQL.

> **Atenção:** Certifique-se de criar o banco de dados `bookstore_db` no seu PostgreSQL antes de continuar.

```dotenv
DB_USER=seu_usuario_postgres
DB_HOST=localhost
DB_NAME=bookstore_db
DB_PASSWORD=sua_senha
DB_PORT=5432
```

**5. Popule o Banco com Massa de Dados para Testes:**

O comando a seguir injeta 10 Autores, 20 Livros, 8 Clientes e 11 Empréstimos pré-configurados:

```bash
npm run seed
```

**6. Execute o Sistema Interativo:**
```bash
npm run dev
```

---

## 📂 Estrutura e Explicação dos Arquivos
A árvore do projeto foi estritamente organizada para separar regras de apresentação, processamento e persistência:

```plaintext
bookstore-manager-cli/
├── src/
│   ├── controllers/            # Recebem a entrada do terminal (CLI) e exibem tabelas visualmente
│   │   ├── AutorController.ts
│   │   ├── LivroController.ts
│   │   ├── ClienteController.ts
│   │   ├── EmprestimoController.ts
│   │   └── RelatorioController.ts
│   ├── models/                 # Interfaces e Tipagens estáticas das entidades relacionais
│   │   ├── Autor.ts
│   │   ├── Livro.ts
│   │   ├── Cliente.ts
│   │   └── Emprestimo.ts
│   ├── repositories/           # Executam o SQL puro parametrizado no PostgreSQL ($1, $2...)
│   │   ├── AutorRepository.ts
│   │   ├── LivroRepository.ts
│   │   ├── ClienteRepository.ts
│   │   ├── EmprestimoRepository.ts
│   │   └── RelatorioRepository.ts
│   ├── services/               # Lógica de negócio, checagem de regras e controle de inventário
│   │   ├── AutorService.ts
│   │   ├── LivroService.ts
│   │   ├── ClienteService.ts
│   │   ├── EmprestimoService.ts
│   │   └── RelatorioService.ts
│   ├── database/               # Conexão com o banco, inicialização de tabelas e Seeder
│   │   ├── connection.ts       # Configuração do Pool assíncrono do pg
│   │   ├── schema.sql          # DDL para criação das tabelas e chaves estrangeiras
│   │   └── seed.ts             # Povoador de dados automatizado para testes
│   ├── utils/                  # Ferramentas auxiliares transversais
│   │   └── input.ts            # Leitor centralizado do teclado (evita eco duplicado)
│   └── main.ts                 # Ponto de entrada central com o Menu de Navegação Principal
├── .env                        # Credenciais locais do banco
├── package.json                # Gerenciador de dependências e scripts de execução
├── tsconfig.json               # Configurações estritas do compilador TypeScript
└── README.md                   # Documentação oficial do sistema
```

---
✨ Funcionalidades Principais
✍️ Gerenciamento de Autores: Cadastro, listagem, consulta por ID, atualização de dados e remoção.

📘 Catálogo de Livros: CRUD completo com controle de quantidade em estoque e vínculo obrigatório a um Autor (autor_id).

👥 Registro de Clientes: Cadastro com validação automática que impede e-mails duplicados no banco.

🔄 **Empréstimos Inteligentes:**
*   Checagem se o cliente e o livro existem no banco antes do registro.
*   Bloqueio automático se o exemplar possuir `quantidade_disponivel <= 0`.
*   Baixa automática no estoque (`-1` unidade) ao concretizar um empréstimo.

📥 Devoluções de Exemplares: Atualização do status para DEVOLVIDO, registro da data atual e reposição automática de +1 unidade no estoque do livro.

📊 **Relatórios Relacionais (JOIN):**
*   Consulta de livros específicos de um autor.
*   Listagem exclusiva de livros com estoque disponível (`> 0`).
*   Tabela de livros atualmente emprestados combinada com o nome e e-mail do cliente tomador.
*   Histórico completo de movimentações por cliente.

📸 Exemplos de Execução e Testes de Regras de Negócio
O sistema implementa validações robustas que garantem a segurança do banco de dados perante erros operacionais:

1. Teste de Restrição de Estoque Zerado (RF10)
Ação: Tentar registrar empréstimo do livro A Revolução dos Bichos (que possui estoque 0).

Comportamento do Sistema: O serviço intercepta a consulta SQL de inserção e exibe uma mensagem clara:
> ❌ **Erro ao realizar empréstimo:** O livro 'A Revolução dos Bichos' está indisponível para empréstimo (estoque zerado).

2. Teste de Devolução e Incremento de Estoque (RF11)
Ação: Registrar devolução de um empréstimo ativo.

Comportamento do Sistema:
> ✅ **Devolução registrada com sucesso!** Data de devolução: 2026-07-06
>
> 💡 O estoque do livro foi aumentado em 1 unidade automaticamente.

🧠 Conceitos e Padrões Aplicados
Pool de Conexões (pg.Pool): Reaproveitamento inteligente das conexões com o PostgreSQL, evitando vazamento de recursos e sobrecarga na rede.

Queries Parametrizadas: Proteção nativa contra ataques de SQL Injection utilizando marcadores posicionais ($1, $2, etc.) nas chamadas ao banco.

Idempotência de Banco (CREATE TABLE IF NOT EXISTS): Inicialização segura que verifica a estrutura das tabelas no boot do sistema sem destruir dados existentes.

Centralização de Stream de Entrada (readline Singleton): Padrão criado em utils/input.ts para capturar os eventos de teclado de forma unificada em CLI, eliminando comportamentos de repetição de caracteres.

📋 Organização e Versionamento
O projeto seguiu estritamente o fluxo de trabalho GitFlow, isolando cada entrega relacional em branches temáticas antes de integrá-las:

*   `main` — Versão final estável e testada.
*   `develop` — Branch principal de integração contínua.
*   **Branches de Features/Tarefas:**
    *   `feat/database`, `feat/models`, `feat/autores`, `feat/livros`, `feat/clientes`, `feat/emprestimos`, `feat/relatorios`, `chore/seeder`, `docs/readme`.

✒️ Autoria
Projeto desenvolvido por Maria Aline Mees, aplicando modelagem de software avançada, CLI interativo e arquitetura limpa com TypeScript.
