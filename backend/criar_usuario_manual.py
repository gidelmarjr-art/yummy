from sqlalchemy import create_engine, text
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

DATABASE_URL = "postgresql://yummy_gf8g_user:rt19wkRF1rjfq0RbjnTr9px21w86S4q8@dpg-dafrsuv40ujc73cmfe90-a.oregon-postgres.render.com/yummy_gf8g"

engine = create_engine(DATABASE_URL)

def criar_usuario():
    senha_hash = get_password_hash("123456")
    
    with engine.connect() as connection:
        connection.execute(text("DROP TABLE IF EXISTS usuarios CASCADE;"))
        
        connection.execute(text("""
            CREATE TABLE usuarios (
                id SERIAL PRIMARY KEY,
                usuario VARCHAR UNIQUE NOT NULL,
                senha VARCHAR NOT NULL,
                perfil VARCHAR NOT NULL,
                nome_completo VARCHAR,
                telefone VARCHAR,
                cpf VARCHAR,
                endereco VARCHAR
            );
        """))
        
        sql = text("""
            INSERT INTO usuarios (usuario, senha, perfil, nome_completo, telefone, cpf, endereco)
            VALUES (:usuario, :senha, :perfil, :nome_completo, :telefone, :cpf, :endereco);
        """)
        
        connection.execute(sql, {
            "usuario": "user",  # Alterado para 'user' caso a tela peça o nome de usuário
            "senha": senha_hash,
            "perfil": "cliente",
            "nome_completo": "user da silva",
            "telefone": "99988888888",
            "cpf": "000.000.000-00",
            "endereco": "SCE Q 55 LT 15/17 BL 1G AP205"
        })
        
        connection.commit()
        print("Banco recriado! Tente logar com usuario: 'user' e senha: '123456'")

if __name__ == "__main__":
    criar_usuario()