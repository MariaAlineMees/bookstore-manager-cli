-- Criação da tabela de Autores
CREATE TABLE IF NOT EXISTS autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nacionalidade VARCHAR(100),
    data_nascimento DATE
);

-- Criação da tabela de Livros (com chave estrangeira para autores)
CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    ano_publicacao INTEGER,
    quantidade_disponivel INTEGER NOT NULL DEFAULT 1,
    autor_id INTEGER NOT NULL,
    CONSTRAINT fk_autor FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE CASCADE
);

-- Criação da tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefone VARCHAR(20)
);

-- Criação da tabela de Empréstimos (relacionando Livros e Clientes)
CREATE TABLE IF NOT EXISTS emprestimos (
    id SERIAL PRIMARY KEY,
    livro_id INTEGER NOT NULL,
    cliente_id INTEGER NOT NULL,
    data_emprestimo DATE NOT NULL DEFAULT CURRENT_DATE,
    data_devolucao DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',
    CONSTRAINT fk_livro FOREIGN KEY (livro_id) REFERENCES livros(id) ON DELETE CASCADE,
    CONSTRAINT fk_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);