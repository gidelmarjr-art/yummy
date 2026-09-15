import os

os.environ["DATABASE_URL"] = "sqlite:////tmp/smoke_yummy.db"

if os.path.exists("/tmp/smoke_yummy.db"):
    os.remove("/tmp/smoke_yummy.db")

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402
from app.database import SessionLocal  # noqa: E402
from app.models.usuario import Usuario  # noqa: E402
from app.security.auth import gerar_hash_senha  # noqa: E402

client = TestClient(app)


def check(label, condition):
    status_ = "OK" if condition else "FALHOU"
    print(f"[{status_}] {label}")
    if not condition:
        raise SystemExit(1)


# 1) bootstrap: cria um admin direto no banco (chicken-and-egg do primeiro admin)
db = SessionLocal()
admin = Usuario(
    usuario="admin@yummy.com",
    senha=gerar_hash_senha("admin123"),
    perfil="admin",
    nome_completo="Admin Teste",
)
db.add(admin)
db.commit()
db.close()

# 2) login
r = client.post("/auth/login", json={"usuario": "admin@yummy.com", "senha": "admin123"})
check("login admin", r.status_code == 200)
token = r.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# 3) /auth/me
r = client.get("/auth/me", headers=headers)
check("/auth/me", r.status_code == 200 and r.json()["perfil"] == "admin")

# 4) criar funcionário (garçom)
r = client.post(
    "/auth/funcionarios",
    json={"usuario": "garcom1", "senha": "123456", "nome_completo": "Garçom Teste", "perfil": "garcom"},
    headers=headers,
)
check("criar funcionário garçom", r.status_code == 201)

# 5) criar insumos
r = client.post(
    "/estoque",
    json={"nome": "Blend de Carne", "categoria": "Carnes", "quantidade": 150, "unidade": "g",
          "custo_unitario": 0.15, "limite_baixo": 300, "limite_critico": 50},
    headers=headers,
)
check("criar insumo carne", r.status_code == 201)
insumo_carne_id = r.json()["id"]
check("status inicial do insumo = Crítico (150 <= limite_critico? nao, <= limite_baixo=300 sim)",
      r.json()["status"] == "Baixo")

r = client.post(
    "/estoque",
    json={"nome": "Queijo Cheddar", "categoria": "Laticínios", "quantidade": 30, "unidade": "g",
          "custo_unitario": 0.05, "limite_baixo": 60, "limite_critico": 10},
    headers=headers,
)
check("criar insumo queijo", r.status_code == 201)
insumo_queijo_id = r.json()["id"]

# 6) criar produto com ficha técnica (1 unidade consome 150g carne + 30g queijo => só dá pra vender 1!)
r = client.post(
    "/cardapio",
    json={
        "nome": "X-Burger",
        "categoria": "Pratos principais",
        "preco": 28.5,
        "ficha_tecnica": [
            {"insumo_id": insumo_carne_id, "quantidade_necessaria": 150},
            {"insumo_id": insumo_queijo_id, "quantidade_necessaria": 30},
        ],
    },
    headers=headers,
)
check("criar produto com ficha técnica", r.status_code == 201)
produto = r.json()
produto_id = produto["id"]
check("ficha técnica tem 2 insumos", len(produto["ficha_tecnica"]) == 2)

# 7) leitura pública do cardápio (sem token)
r = client.get("/cardapio")
check("GET /cardapio é público", r.status_code == 200 and len(r.json()) == 1)

# 8) criar pedido com esse produto (perfil garçom deveria poder)
r = client.post("/auth/login", json={"usuario": "garcom1", "senha": "123456"})
token_garcom = r.json()["access_token"]
headers_garcom = {"Authorization": f"Bearer {token_garcom}"}

r = client.post(
    "/pedidos",
    json={
        "cliente_nome": "João Silva",
        "local": "Mesa 04",
        "canal": "local",
        "forma_pagamento": "Pix",
        "itens": [{"produto_id": produto_id, "nome_produto": "X-Burger", "quantidade": 1, "preco_unitario": 28.5}],
    },
    headers=headers_garcom,
)
check("garçom cria pedido", r.status_code == 201)
pedido = r.json()
check("total do pedido calculado certo", pedido["total"] == 28.5)
check("status inicial = Novos", pedido["status"] == "Novos")
pedido_id = pedido["id"]

# 9) avançar pra "Em preparo" -> deve dar baixa no estoque e bloquear o produto (só tinha p/ 1 unidade)
r = client.patch(f"/pedidos/{pedido_id}/avancar", headers=headers_garcom)
check("avançar pra Em preparo", r.status_code == 200 and r.json()["status"] == "Em preparo")

r = client.get(f"/estoque/{insumo_carne_id}", headers=headers)
check("baixa de estoque aplicada (carne foi de 150 pra 0)", r.json()["quantidade"] == 0)

r = client.get(f"/cardapio/{produto_id}")
check("produto bloqueado automaticamente (Esgotado) por falta de insumo", r.json()["status"] == "Esgotado")

# 10) repor estoque de carne e queijo -> produto deve voltar a ficar disponível
r = client.patch(f"/estoque/{insumo_carne_id}/repor", json={"quantidade_adicional": 300}, headers=headers)
check("repor estoque de carne", r.status_code == 200)
r = client.get(f"/cardapio/{produto_id}")
check("produto AINDA bloqueado (queijo continua zerado)", r.json()["status"] == "Esgotado")

r = client.patch(f"/estoque/{insumo_queijo_id}/repor", json={"quantidade_adicional": 60}, headers=headers)
check("repor estoque de queijo", r.status_code == 200)
r = client.get(f"/cardapio/{produto_id}")
check("produto reativado após repor os DOIS insumos", r.json()["status"] == "Em estoque")

# 11) avançar pedido até Concluídos -> deve gerar transação
for _ in range(3):  # Em preparo -> Prontos -> Entregues -> Concluídos
    r = client.patch(f"/pedidos/{pedido_id}/avancar", headers=headers_garcom)
check("pedido concluído", r.json()["status"] == "Concluídos")

# 12) dashboard de transações deve refletir essa venda
r = client.get("/transacoes", headers=headers)
check("dashboard de transações OK", r.status_code == 200)
check("faturamento apareceu", r.json()["metrics"]["numTransactions"] == "1")

# 13) dashboard geral
r = client.get("/geral", headers=headers)
check("dashboard geral OK", r.status_code == 200)
check("total de clientes = 0 (só criamos admin e garçom, nenhum cliente)", r.json()["metrics"]["totalClients"] == 0)

# 14) relatórios
r = client.get("/relatorios", headers=headers)
check("dashboard de relatórios OK", r.status_code == 200)

# 15) segurança: trocar senha
r = client.post(
    "/seguranca/alterar-senha",
    json={"senha_atual": "admin123", "nova_senha": "novaSenha123"},
    headers=headers,
)
check("trocar senha", r.status_code == 200)

r = client.get("/seguranca/sessoes", headers=headers)
check("listar sessões", r.status_code == 200 and len(r.json()) >= 1)

# 16) configurações da loja
r = client.get("/configuracoes", headers=headers)
check("obter configurações (cria default)", r.status_code == 200)
r = client.put(
    "/configuracoes",
    json={
        "nome_loja": "Yummy Lanches", "telefone": "123", "email": "a@a.com", "endereco": "Rua X",
        "taxa_servico": "10%", "alerta_novos_pedidos": True, "relatorios_email": False, "sons_alerta": True,
    },
    headers=headers,
)
check("atualizar configurações", r.status_code == 200 and r.json()["nome_loja"] == "Yummy Lanches")

# 17) papel errado não acessa rota de gerência
r = client.get("/estoque", headers=headers_garcom)
check("garçom NÃO acessa /estoque (403)", r.status_code == 403)

# 18) sem token nenhum
r = client.get("/estoque")
check("sem token retorna 401", r.status_code == 401)

print("\nTODOS OS TESTES PASSARAM ✅")
