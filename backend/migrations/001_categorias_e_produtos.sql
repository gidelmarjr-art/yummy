-- Recria o cardápio do Codó Burger (55 pratos) no Supabase.
-- Cole no SQL Editor e clique em Run. Pode rodar mais de uma vez: categorias e
-- pratos que já existem são ignorados. Não depende de constraints únicas.

INSERT INTO categorias (nome, slug, ordem, ativo)
SELECT v.nome, v.slug, v.ordem, TRUE
FROM (VALUES
    ('Lanches', 'lanches', 0),
    ('Pizzas', 'pizzas', 1),
    ('Japonesa', 'japonesa', 2),
    ('Saudável', 'saudavel', 3),
    ('Doces', 'doces', 4),
    ('Bebidas', 'bebidas', 5),
    ('Frango', 'frango', 6)
) AS v(nome, slug, ordem)
WHERE NOT EXISTS (SELECT 1 FROM categorias c WHERE c.slug = v.slug);

WITH novos AS (
    SELECT v.ord, v.nome::text AS nome, v.categoria::text AS categoria,
           v.preco::numeric AS preco, v.descricao::text AS descricao
    FROM (VALUES
        (1, 'Bacon BBQ Gourmet', 'lanches', 28.90, 'Blend artesanal, bacon crocante e molho barbecue da casa.'),
        (2, 'Chicken Crispy Burger', 'lanches', 24.90, 'Frango empanado crocante, alface e maionese temperada.'),
        (3, 'Classic Smash Burger', 'lanches', 22.90, 'Smash burger suculento, queijo derretido e cebola caramelizada.'),
        (4, 'Club Sandwich', 'lanches', 23.90, 'Três camadas de pão, frango, bacon, alface, tomate e maionese.'),
        (5, 'Hot Dog Gourmet', 'lanches', 18.90, 'Salsicha especial, molhos da casa e batata palha crocante.'),
        (6, 'Sanduíche de Costela Desfiada', 'lanches', 29.90, 'Costela desfiada lentamente, no ponto, com molho barbecue.'),
        (7, 'Smash Triple Cheese', 'lanches', 26.90, 'Três camadas de queijo derretido sobre smash burger suculento.'),
        (8, 'Veggie Mushroom Burger', 'lanches', 23.90, 'Hambúrguer vegetariano de cogumelos com queijo derretido.'),
        (9, 'Wrap de Mignon com Queijo', 'lanches', 27.90, 'Filé mignon fatiado, queijo derretido e molho especial no wrap.'),
        (10, 'X-Salada Tradicional', 'lanches', 19.90, 'O clássico de sempre: hambúrguer, queijo, alface, tomate e maionese.'),
        (11, 'Calabresa Especial', 'pizzas', 44.90, 'Calabresa fatiada, cebola roxa e azeitonas pretas.'),
        (12, 'Carne Seca com Cream Cheese', 'pizzas', 54.90, 'Carne seca desfiada com cream cheese e cebola caramelizada.'),
        (13, 'Frango com Catupiry', 'pizzas', 46.90, 'Frango desfiado temperado com catupiry cremoso.'),
        (14, 'Margherita', 'pizzas', 42.90, 'Molho de tomate, mussarela de búfala e manjericão fresco.'),
        (15, 'Parma com Rúcula', 'pizzas', 56.90, 'Presunto parma, rúcula fresca e lascas de parmesão.'),
        (16, 'Pepperoni com Mel', 'pizzas', 48.90, 'Pepperoni picante com um toque de mel para equilibrar.'),
        (17, 'Portuguesa', 'pizzas', 45.90, 'Presunto, ovos, cebola, azeitona e ervilha.'),
        (18, 'Quatro Queijos', 'pizzas', 47.90, 'Mussarela, provolone, parmesão e gorgonzola.'),
        (19, 'Quattro Formaggi & Trufas', 'pizzas', 62.90, 'Quatro queijos selecionados com um toque de azeite trufado.'),
        (20, 'Milkshake de Ovomaltine (400ml)', 'bebidas', 15.90, NULL),
        (21, 'Soda Italiana de Maçã Verde', 'bebidas', 6.90, NULL),
        (22, 'Suco Detox Verde (500ml)', 'bebidas', 11.90, NULL),
        (23, 'Suco Natural de Goiaba (500ml)', 'bebidas', 8.90, NULL),
        (24, 'Suco Natural de Laranja (500ml)', 'bebidas', 8.90, NULL),
        (25, 'Suco Natural de Maracujá(500ml)', 'bebidas', 8.90, NULL),
        (26, 'Suco Natural de Uva (500ml)', 'bebidas', 8.90, NULL),
        (27, 'Água Mineral sem Gás ou com Gás (500ml)', 'bebidas', 14.90, NULL),
        (28, 'Banoffee no Pote', 'doces', 23.90, NULL),
        (29, 'Brigadeiro Gourmet Tradicional (4 unid.)', 'doces', 20.90, NULL),
        (30, 'Brownie de Chocolate com Nocciola', 'doces', 16.90, NULL),
        (31, 'Cheesecake de Frutas Vermelhas', 'doces', 20.90, NULL),
        (32, 'Copo da Felicidade de Morango', 'doces', 18.90, NULL),
        (33, 'Petit Gâteau de Doce de Leite', 'doces', 16.90, NULL),
        (34, 'Pudim de Leite Condensado', 'doces', 23.90, NULL),
        (35, 'Torta Holandesa Tradicional', 'doces', 18.90, NULL),
        (36, 'Balde de Frango Crocante (Crispy Tenders)', 'frango', 39.90, NULL),
        (37, 'Chicken Wings BBQ', 'frango', 47.90, NULL),
        (38, 'Coxinha de Frango com Catupiry (6 unid.)', 'frango', 46.90, NULL),
        (39, 'Escondidinho de Frango com Mandioquinha', 'frango', 28.90, NULL),
        (40, 'Frango a Passarinho ao Alho e Óleo', 'frango', 28.90, NULL),
        (41, 'Grelhado de Frango ao Molho de Limão', 'frango', 46.90, NULL),
        (42, 'Sobrecoxa Assada com Ervas e Batatas', 'frango', 55.90, NULL),
        (43, 'Stroganoff de Frango Tradicional', 'frango', 54.90, NULL),
        (44, 'Combinado Hot Roll (10 unid.)', 'japonesa', 60.90, NULL),
        (45, 'Niguiri de Salmão Flambado (4 unid.)', 'japonesa', 50.90, NULL),
        (46, 'Sashimi de Salmão (10 fatias)', 'japonesa', 33.90, NULL),
        (47, 'Sashimi de Tuna (Tuna Crisp)', 'japonesa', 59.90, NULL),
        (48, 'Temaki de Salmão Completo', 'japonesa', 42.90, NULL),
        (49, 'Uramaki Philadelphia (8 unid.)', 'japonesa', 53.90, NULL),
        (50, 'Bowl de Quinoa com Legumes Assados', 'saudavel', 27.90, NULL),
        (51, 'Omelete de Ervas e Queijo Branco', 'saudavel', 31.90, NULL),
        (52, 'Salada Caesar com Frango', 'saudavel', 36.90, NULL),
        (53, 'Salmão Grelhado com Purê de Mandioquinha', 'saudavel', 30.90, NULL),
        (54, 'Stroganoff Fit de Frango', 'saudavel', 30.90, NULL),
        (55, 'Wrap Integral de Peito de Peru', 'saudavel', 29.90, NULL)
    ) AS v(ord, nome, categoria, preco, descricao)
    WHERE NOT EXISTS (
        SELECT 1 FROM produtos p WHERE p.nome = v.nome AND p.categoria = v.categoria
    )
),
base AS (
    SELECT COALESCE(MAX(CAST(REPLACE(codigo, '.', '') AS INTEGER)), 100) AS maior
    FROM produtos
    WHERE codigo ~ '^[0-9]+[.]$'
)
INSERT INTO produtos (codigo, nome, categoria, preco, status, descricao, criado_em)
SELECT (base.maior + ROW_NUMBER() OVER (ORDER BY novos.ord))::text || '.',
       novos.nome, novos.categoria, novos.preco, 'Em estoque', novos.descricao, NOW()
FROM novos CROSS JOIN base;

SELECT categoria, COUNT(*) AS pratos FROM produtos GROUP BY categoria ORDER BY categoria;