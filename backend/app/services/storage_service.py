"""
Envio de imagens de pratos para o Supabase Storage.

O banco guarda só o LINK da imagem (produtos.imagem_url); o arquivo em si fica
no Storage. A chave de serviço do Supabase é secreta e fica apenas aqui no
backend (variáveis de ambiente) — nunca no frontend.

Variáveis de ambiente (configuradas no Render):
  SUPABASE_URL          ex.: https://abcdefgh.supabase.co
  SUPABASE_SERVICE_KEY  chave "service_role" do projeto (SECRETA)
  SUPABASE_BUCKET       nome do bucket PÚBLICO (padrão: produtos)
"""
import os
import uuid

import httpx

MAX_BYTES = 3 * 1024 * 1024  # 3 MB por imagem
TIMEOUT_SEGUNDOS = 20


class StorageNaoConfigurado(Exception):
    pass


class StorageFalhou(Exception):
    pass


def _config() -> tuple[str, str, str]:
    url = (os.getenv("SUPABASE_URL") or "").strip().rstrip("/")
    chave = (os.getenv("SUPABASE_SERVICE_KEY") or "").strip()
    bucket = (os.getenv("SUPABASE_BUCKET") or "produtos").strip()
    if not url or not chave:
        raise StorageNaoConfigurado()
    return url, chave, bucket


def configurado() -> bool:
    try:
        _config()
        return True
    except StorageNaoConfigurado:
        return False


def detectar_tipo(conteudo: bytes) -> tuple[str, str] | None:
    """
    Descobre o tipo REAL pelo conteúdo do arquivo (não confia no nome nem no
    Content-Type enviado pelo navegador). Retorna (mime, extensão) ou None.
    """
    if conteudo[:3] == b"\xff\xd8\xff":
        return "image/jpeg", "jpg"
    if conteudo[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png", "png"
    return None


def enviar_imagem(conteudo: bytes, mime: str, extensao: str) -> str:
    """Envia o arquivo ao bucket e devolve a URL pública."""
    url, chave, bucket = _config()
    caminho = f"pratos/{uuid.uuid4().hex}.{extensao}"
    try:
        resposta = httpx.post(
            f"{url}/storage/v1/object/{bucket}/{caminho}",
            content=conteudo,
            headers={
                "Authorization": f"Bearer {chave}",
                "apikey": chave,
                "Content-Type": mime,
                "Cache-Control": "max-age=31536000",
            },
            timeout=TIMEOUT_SEGUNDOS,
        )
    except httpx.HTTPError as exc:
        raise StorageFalhou(f"Sem resposta do armazenamento: {exc}") from exc
    if resposta.status_code not in (200, 201):
        raise StorageFalhou(f"O armazenamento recusou o envio (HTTP {resposta.status_code}).")
    return f"{url}/storage/v1/object/public/{bucket}/{caminho}"
