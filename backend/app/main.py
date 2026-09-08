from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models.usuario

# Cria as tabelas no banco de dados se não existirem
Base.metadata.create_all(bind=engine)

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

# Importação do router e inclusão na aplicação
from app.routers import auth_router
app.include_router(auth_router.router)

@app.get("/")
def main():
    return {"mensagem": "Servidor rodando com sucesso!"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models.usuario

# Apaga as tabelas antigas e recria com as colunas novas
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Delivery",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import auth_router
app.include_router(auth_router.router)

@app.get("/")
def main():
    return {"mensagem": "Servidor rodando com sucesso!"}