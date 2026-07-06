import { pool } from './connection';

async function popularBancoDeDados() {
  const client = await pool.connect();
  try {
    console.log('🌱 Limpando o banco e iniciando um povoamento de dados...');

    await client.query('TRUNCATE TABLE emprestimos, livros, clientes, autores RESTART IDENTITY CASCADE;');

    await client.query(`
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
    `);

    await client.query(`
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
    `);

    await client.query(`
      INSERT INTO clientes (nome, email, telefone) VALUES
      ('Ana Silva', 'ana.silva@email.com', '(11) 99999-1111'),
      ('Carlos Oliveira', 'carlos.o@email.com', '(21) 98888-2222'),
      ('Beatriz Souza', 'beatriz.s@email.com', '(41) 97777-3333'),
      ('Lucas Mendes', 'lucas.m@email.com', '(31) 96666-4444'),
      ('Fernanda Lima', 'fernanda.l@email.com', '(51) 95555-5555'),
      ('Roberto Costa', 'roberto.c@email.com', '(71) 94444-6666'),
      ('Juliana Pereira', 'juliana.p@email.com', '(81) 93333-7777'),
      ('Gabriel Santos', 'gabriel.s@email.com', '(19) 92222-8888');
    `);

    await client.query(`
      INSERT INTO emprestimos (livro_id, cliente_id, data_emprestimo, data_devolucao, status) VALUES
      -- EMPRÉSTIMOS ATIVOS (Atualmente nas mãos dos clientes)
      (1, 1, CURRENT_DATE - INTERVAL '6 days', NULL, 'ATIVO'),  -- Ana está com Dom Casmurro
      (4, 2, CURRENT_DATE - INTERVAL '3 days', NULL, 'ATIVO'),  -- Carlos está com Harry Potter 1
      (11, 4, CURRENT_DATE - INTERVAL '12 days', NULL, 'ATIVO'), -- Lucas está com O Senhor dos Anéis
      (20, 5, CURRENT_DATE - INTERVAL '1 day', NULL, 'ATIVO'),   -- Fernanda está com Código Limpo
      (16, 6, CURRENT_DATE - INTERVAL '5 days', NULL, 'ATIVO'),  -- Roberto está com Capitães da Areia
      (15, 8, CURRENT_DATE - INTERVAL '8 days', NULL, 'ATIVO'),  -- Gabriel está com Cem Anos de Solidão

      -- EMPRÉSTIMOS JÁ DEVOLVIDOS (Histórico antigo)
      (7, 1, CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '15 days', 'DEVOLVIDO'), -- Ana já leu 1984
      (9, 3, CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE - INTERVAL '25 days', 'DEVOLVIDO'), -- Beatriz já leu A Hora da Estrela
      (12, 7, CURRENT_DATE - INTERVAL '18 days', CURRENT_DATE - INTERVAL '10 days', 'DEVOLVIDO'), -- Juliana já leu O Hobbit
      (18, 4, CURRENT_DATE - INTERVAL '14 days', CURRENT_DATE - INTERVAL '7 days', 'DEVOLVIDO'),  -- Lucas já leu Eu, Robô
      (14, 2, CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE - INTERVAL '20 days', 'DEVOLVIDO'); -- Carlos já leu Expresso do Oriente
    `);

    console.log('✅ Banco de dados populado com sucesso!');
    console.log('📚 10 Autores | 20 Livros | 8 Clientes | 11 Empréstimos gerados!');
  } catch (erro) {
    console.error('❌ Erro ao popular o banco de dados:', erro);
  } finally {
    client.release();
    pool.end();
  }
}

popularBancoDeDados();