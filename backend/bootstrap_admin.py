"""
Cria (ou atualiza a senha de) o primeiro usuário admin do sistema.

Diferente do criar_usuario_manual.py antigo, este script:
  - NÃO tem nenhuma credencial de banco escrita no código (lê de DATABASE_URL);
  - NÃO apaga nenhuma tabela existente;
  - só cria o que falta.

Uso local:
    DATABASE_URL="postgresql://..." python bootstrap_admin.py

Uso no Render: abra o "Shell" do serviço (já tem DATABASE_URL configurada
no ambiente) e rode:
    python bootstrap_admin.py
"""
import getpass
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app.database import Base, SessionLocal, engine  # noqa: E402
from app.models.usuario import Usuario  # noqa: E402
from app.security.auth import gerar_hash_senha  # noqa: E402

# Garante que as tabelas existem antes de tentar inserir.
import app.models.sessao  # noqa: E402,F401
import app.models.produto  # noqa: E402,F401
import app.models.insumo  # noqa: E402,F401
import app.models.produto_insumo  # noqa: E402,F401
import app.models.pedido  # noqa: E402,F401
import app.models.item_pedido  # noqa: E402,F401
import app.models.transacao  # noqa: E402,F401
import app.models.configuracao_loja  # noqa: E402,F401

Base.metadata.create_all(bind=engine)


def main():
    email = input("E-mail/usuário do admin: ").strip()
    nome = input("Nome completo: ").strip()
    senha = getpass.getpass("Senha: ").strip()

    db = SessionLocal()
    try:
        existente = db.query(Usuario).filter(Usuario.usuario == email).first()
        if existente:
            existente.senha = gerar_hash_senha(senha)
            existente.perfil = "admin"
            db.commit()
            print(f"Usuário '{email}' já existia — senha atualizada e perfil garantido como admin.")
        else:
            novo = Usuario(
                usuario=email,
                senha=gerar_hash_senha(senha),
                perfil="admin",
                nome_completo=nome,
            )
            db.add(novo)
            db.commit()
            print(f"Admin '{email}' criado com sucesso.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
