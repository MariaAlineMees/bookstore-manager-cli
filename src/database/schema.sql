-- ==========================================
-- 1. LIMPEZA DO BANCO DE DADOS (RESET)
-- ==========================================
-- A ordem do DROP deve ser inversa à criação (por causa das chaves estrangeiras)
DROP TABLE IF EXISTS emprestimos CASCADE;
DROP TABLE IF EXISTS livros CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS autores CASCADE;


-- ==========================================
-- 2. CRIAÇÃO DAS TABELAS (ESTRUTURA DDL)
-- ==========================================

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


-- ==========================================
-- 3. INSERÇÃO DE DADOS INICIAIS (SEED / DML)
-- ==========================================

INSERT INTO autores (nome, nacionalidade) VALUES
    ('Machado de Assis', 'Brasileira'),
    ('J.K. Rowling', 'Britânica'),
    ('George Orwell', 'Britânica'),
    ('Clarice Lispector', 'Brasileira'),
    ('J.R.R. Tolkien', 'Britânica'),
    ('Agatha Christie', 'Britânica'),
    ('Gabriel García Márquez', 'Colombiana'),
    ('Jorge Amado', 'Brasileira'),
    ('Isaac Asimov', 'Russa/Americana'),
    ('Robert C. Martin (Uncle Bob)', 'Americana');

INSERT INTO livros (titulo, autor_id, quantidade_disponivel, ano_publicacao) VALUES
    ('Dom Casmurro', 1, 5, 1899),
    ('Memórias Póstumas de Brás Cubas', 1, 3, 1881),
    ('Quincas Borba', 1, 2, 1891),
    ('Harry Potter e a Pedra Filosofal', 2, 10, 1997),
    ('Harry Potter e a Câmara Secreta', 2, 8, 1998),
    ('Harry Potter e o Prisioneiro de Azkaban', 2, 0, 1999), -- Estoque zerado propositalmente!
    ('1984', 3, 4, 1949),
    ('A Revolução dos Bichos', 3, 0, 1945), -- Estoque zerado propositalmente!
    ('A Hora da Estrela', 4, 6, 1977),
    ('Perto do Coração Selvagem', 4, 3, 1943),
    ('O Senhor dos Anéis: A Sociedade do Anel', 5, 7, 1954),
    ('O Hobbit', 5, 5, 1937),
    ('E Não Sobrou Nenhum', 6, 4, 1939),
    ('Assassinato no Expresso do Oriente', 6, 2, 1934),
    ('Cem Anos de Solidão', 7, 5, 1967),
    ('Capitães da Areia', 8, 8, 1937),
    ('Gabriela, Cravo e Canela', 8, 4, 1958),
    ('Eu, Robô', 9, 3, 1950),
    ('Fundação', 9, 0, 1951), -- Estoque zerado propositalmente!
    ('Código Limpo (Clean Code)', 10, 12, 2008);

INSERT INTO clientes (nome, email, telefone) VALUES
    ('Ana Silva', 'ana.silva@email.com', '(11) 99999-1111'),
    ('Carlos Oliveira', 'carlos.o@email.com', '(21) 98888-2222'),
    ('Beatriz Souza', 'beatriz.s@email.com', '(41) 97777-3333'),
    ('Lucas Mendes', 'lucas.m@email.com', '(31) 96666-4444'),
    ('Fernanda Lima', 'fernanda.l@email.com', '(51) 95555-5555'),
    ('Roberto Costa', 'roberto.c@email.com', '(71) 94444-6666'),
    ('Juliana Pereira', 'juliana.p@email.com', '(81) 93333-7777'),
    ('Gabriel Santos', 'gabriel.s@email.com', '(19) 92222-8888');

INSERT INTO emprestimos (livro_id, cliente_id, data_emprestimo, data_devolucao, status) VALUES
    -- EMPRÉSTIMOS ATIVOS
    (1, 1, CURRENT_DATE - INTERVAL '6 days', NULL, 'ATIVO'),
    (4, 2, CURRENT_DATE - INTERVAL '3 days', NULL, 'ATIVO'),
    (11, 4, CURRENT_DATE - INTERVAL '12 days', NULL, 'ATIVO'),
    (20, 5, CURRENT_DATE - INTERVAL '1 day', NULL, 'ATIVO'),
    (16, 6, CURRENT_DATE - INTERVAL '5 days', NULL, 'ATIVO'),
    (15, 8, CURRENT_DATE - INTERVAL '8 days', NULL, 'ATIVO'),

    -- EMPRÉSTIMOS JÁ DEVOLVIDOS
    (7, 1, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '15 days', 'DEVOLVIDO'),
    (9, 3, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '25 days', 'DEVOLVIDO'),
    (12, 7, CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '10 days', 'DEVOLVIDO'),
    (18, 4, CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE - INTERVAL '7 days', 'DEVOLVIDO'),
    (14, 2, CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE - INTERVAL '20 days', 'DEVOLVIDO');