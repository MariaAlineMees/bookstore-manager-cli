DROP TABLE IF EXISTS emprestimos CASCADE;
DROP TABLE IF EXISTS livros CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS autores CASCADE;

CREATE TABLE IF NOT EXISTS autores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    nacionalidade VARCHAR(100),
    data_nascimento DATE
);

CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    ano_publicacao INTEGER,
    quantidade_disponivel INTEGER NOT NULL DEFAULT 1,
    autor_id INTEGER NOT NULL,
    CONSTRAINT fk_autor FOREIGN KEY (autor_id) REFERENCES autores(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telefone VARCHAR(20)
);

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

INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES
    ('Machado de Assis', 'Brasileira', '1839-06-21'),
    ('J.K. Rowling', 'Britanica', '1965-07-31'),
    ('George Orwell', 'Britanica', '1903-06-25'),
    ('Clarice Lispector', 'Brasileira', '1920-12-10'),
    ('J.R.R. Tolkien', 'Britanica', '1892-01-03'),
    ('Agatha Christie', 'Britanica', '1890-09-15'),
    ('Gabriel Garcia Marquez', 'Colombiana', '1927-03-06'),
    ('Jorge Amado', 'Brasileira', '1912-08-10'),
    ('Isaac Asimov', 'Russa/Americana', '1920-01-02'),
    ('Robert C. Martin', 'Americana', '1952-12-05');

INSERT INTO livros (titulo, autor_id, quantidade_disponivel, ano_publicacao) VALUES
    ('Dom Casmurro', 1, 5, 1899),
    ('Memorias Postumas', 1, 3, 1881),
    ('Quincas Borba', 1, 2, 1891),
    ('Harry Potter 1', 2, 10, 1997),
    ('Harry Potter 2', 2, 8, 1998),
    ('Harry Potter 3', 2, 0, 1999),
    ('1984', 3, 4, 1949),
    ('A Revolucao dos Bichos', 3, 0, 1945),
    ('A Hora da Estrela', 4, 6, 1977),
    ('Perto do Coracao', 4, 3, 1943),
    ('Senhor dos Aneis', 5, 7, 1954),
    ('O Hobbit', 5, 5, 1937),
    ('E Nao Sobrou Nenhum', 6, 4, 1939),
    ('Assassinato no Expresso', 6, 2, 1934),
    ('Cem Anos de Solidao', 7, 5, 1967),
    ('Capitaes da Areia', 8, 8, 1937),
    ('Gabriela', 8, 4, 1958),
    ('Eu, Robo', 9, 3, 1950),
    ('Fundacao', 9, 0, 1951),
    ('Codigo Limpo', 10, 12, 2008);

INSERT INTO clientes (nome, email, telefone) VALUES
    ('Ana Silva', 'ana@email.com', '11111'),
    ('Carlos Oliveira', 'carlos@email.com', '22222'),
    ('Beatriz Souza', 'beatriz@email.com', '33333'),
    ('Lucas Mendes', 'lucas@email.com', '44444'),
    ('Fernanda Lima', 'fernanda@email.com', '55555'),
    ('Roberto Costa', 'roberto@email.com', '66666'),
    ('Juliana Pereira', 'juliana@email.com', '77777'),
    ('Gabriel Santos', 'gabriel@email.com', '88888');

INSERT INTO emprestimos (livro_id, cliente_id, status) VALUES
    (1, 1, 'ATIVO'),
    (4, 2, 'ATIVO'),
    (11, 4, 'ATIVO'),
    (20, 5, 'ATIVO'),
    (16, 6, 'ATIVO'),
    (15, 8, 'ATIVO'),
    (7, 1, 'DEVOLVIDO'),
    (9, 3, 'DEVOLVIDO'),
    (12, 7, 'DEVOLVIDO'),
    (18, 4, 'DEVOLVIDO'),
    (14, 2, 'DEVOLVIDO');