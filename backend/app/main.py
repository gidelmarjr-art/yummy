from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.database import Base, engine
from app.realtime import manager

# Todos os models precisam estar importados aqui antes do create_all(),
# senão o SQLAlchemy não sabe que a tabela existe e não cria nada.
import app.models.usuario  # noqa: F401
import app.models.sessao  # noqa: F401
import app.models.produto  # noqa: F401
import app.models.insumo  # noqa: F401
import app.models.produto_insumo  # noqa: F401
import app.models.pedido  # noqa: F401
import app.models.item_pedido  # noqa: F401
import app.models.transacao  # noqa: F401
import app.models.configuracao_loja  # noqa: F401

from app.routers import (
    auth_router,
    cardapio_router,
    clientes_router,
    configuracoes_router,
    estoque_router,
    geral_router,
    pedidos_router,
    relatorios_router,
    seguranca_router,
    transacoes_router,
)

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
    title="API Yummy",
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

# Inclusão dos routers
app.include_router(auth_router.router)
app.include_router(cardapio_router.router)
app.include_router(estoque_router.router)
app.include_router(pedidos_router.router)
app.include_router(clientes_router.router)
app.include_router(transacoes_router.router)
app.include_router(relatorios_router.router)
app.include_router(geral_router.router)
app.include_router(seguranca_router.router)
app.include_router(configuracoes_router.router)


@app.get("/")
def main():
    return {"mensagem": "Servidor rodando com sucesso!"}


# ---------------------------------------------------------------------
# Tempo real (WebSocket nativo — sem socket.io, sem porta extra).
#
# Os hooks useRealtimeDashboard e useRealtimeTransactions do frontend
# devem se conectar aqui: wss://<mesmo-host-da-api>/ws/dashboard e
# /ws/transacoes. As rotas de pedidos/transações fazem
# `await manager.broadcast(...)` quando algo muda.
# ---------------------------------------------------------------------

@app.websocket("/ws/dashboard")
async def ws_dashboard(websocket: WebSocket):
    await manager.connect("dashboard", websocket)
    try:
        while True:
            # Não esperamos nada do cliente; só mantemos a conexão viva.
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect("dashboard", websocket)


@app.websocket("/ws/transacoes")
async def ws_transacoes(websocket: WebSocket):
    await manager.connect("transacoes", websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect("transacoes", websocket)
