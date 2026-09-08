from fastapi import FastAPI
from app.database import engine, Base
from app.models import usuario 

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Delivery",
    version="1.0.0"
)

@app.get("/")
def rota_principal():
    return {"mensagem": "Servidor do Backend rodando com sucesso! "}