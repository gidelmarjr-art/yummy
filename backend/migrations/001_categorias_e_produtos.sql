-- Execute somente se a aplicação não puder iniciar para aplicar a sincronização
-- automática de colunas. PostgreSQL / Render.
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR NOT NULL UNIQUE,
    slug VARCHAR NOT NULL UNIQUE,
    icone VARCHAR,
    ordem INTEGER NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE produtos ADD COLUMN IF NOT EXISTS imagem_url VARCHAR;
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS descricao TEXT;

INSERT INTO categorias (nome, slug, ordem, ativo) VALUES
    ('Lanches', 'lanches', 0, TRUE),
    ('Pizzas', 'pizzas', 1, TRUE),
    ('Japonesa', 'japonesa', 2, TRUE),
    ('Saudável', 'saudavel', 3, TRUE),
    ('Doces', 'doces', 4, TRUE),
    ('Bebidas', 'bebidas', 5, TRUE),
    ('Frango', 'frango', 6, TRUE)
ON CONFLICT (slug) DO NOTHING;
