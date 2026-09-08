from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from app.database import engine, Base
import app.models.usuario
from app.routers import auth_router

# Cria as tabelas no banco de dados se não existirem
Base.metadata.create_all(bind=engine)


def sincronizar_colunas_faltantes():
    """
    O create_all() acima só CRIA tabelas novas — ele não adiciona colunas
    novas em tabelas que já existem no banco. Isso faz com que, ao adicionar
    um campo num model (ex: pin_seguranca) depois que a tabela já existia
    em produção, o banco fique desatualizado e quebre com
    'UndefinedColumn'. Essa função varre os models e adiciona no banco
    qualquer coluna que esteja faltando, sem apagar nada existente.
    """
    inspector = inspect(engine)
    for tabela in Base.metadata.tables.values():
        if not inspector.has_table(tabela.name):
            continue
        colunas_existentes = {col["name"] for col in inspector.get_columns(tabela.name)}
        for coluna in tabela.columns:
            if coluna.name in colunas_existentes:
                continue
            tipo_sql = coluna.type.compile(dialect=engine.dialect)
            with engine.connect() as conn:
                conn.execute(
                    text(f'ALTER TABLE {tabela.name} ADD COLUMN "{coluna.name}" {tipo_sql}')
                )
                conn.commit()


sincronizar_colunas_faltantes()

app = FastAPI(
    title="API Delivery",
    version="1.0.0"
)

# Configuração do CORS usando a classe CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão do router
app.include_router(auth_router.router)

@app.get("/")
def main():
    return {"mensagem": "Servidor rodando com sucesso!"}