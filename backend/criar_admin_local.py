"""Cria a primeira conta administrativa para uso local.

Execute uma vez dentro da pasta backend:
    python criar_admin_local.py
"""
from app.database import Base, SessionLocal, engine
from app.models.usuario import Usuario
from app.security.auth import gerar_hash_senha

Base.metadata.create_all(bind=engine)
db = SessionLocal()
try:
    usuario = "admin"
    if db.query(Usuario).filter(Usuario.usuario == usuario).first():
        print("A conta 'admin' já existe.")
    else:
        db.add(Usuario(
            usuario=usuario,
            senha=gerar_hash_senha("admin123"),
            nome_completo="Administrador Yummy",
            perfil="admin",
        ))
        db.commit()
        print("Conta criada: admin / admin123. Altere a senha no primeiro acesso.")
finally:
    db.close()
