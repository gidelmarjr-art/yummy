from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
import app.models.usuario
from app.routers import auth_router

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

# Inclusão do router
app.include_router(auth_router.router)

@app.get("/")
def main():
    return {"mensagem": "Servidor rodando com sucesso!"}