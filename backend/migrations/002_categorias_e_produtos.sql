-- 002 — Ajuste para bancos criados por uma versão antiga da tabela "produtos"
-- (caso do Supabase do projeto): essa versão tinha a coluna "slug" como
-- obrigatória, mas o backend atual não usa nem preenche esse campo, então
-- qualquer INSERT falhava com "null value in column slug".
-- Seguro rodar mais de uma vez e em bancos que nunca tiveram essa coluna.

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'produtos' AND column_name = 'slug'
    ) THEN
        ALTER TABLE produtos ALTER COLUMN slug DROP NOT NULL;
    END IF;
END $$;