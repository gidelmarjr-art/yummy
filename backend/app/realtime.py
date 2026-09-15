"""
Tempo real via WebSocket nativo do FastAPI (sem socket.io).

Mantém uma "sala" de conexões por assunto (ex: "dashboard", "transacoes")
e permite fazer broadcast de um payload JSON pra todo mundo conectado
naquela sala. Isso substitui o servidor socket.io mockado que os hooks
useRealtimeDashboard/useRealtimeTransactions esperavam antes — mesma
ideia (push de atualização), um único processo/porta, e funciona no
plano gratuito do Render.
"""
from typing import Dict, Set

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self._salas: Dict[str, Set[WebSocket]] = {}

    async def connect(self, sala: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self._salas.setdefault(sala, set()).add(websocket)

    def disconnect(self, sala: str, websocket: WebSocket) -> None:
        self._salas.get(sala, set()).discard(websocket)

    async def broadcast(self, sala: str, payload: dict) -> None:
        conexoes = list(self._salas.get(sala, set()))
        for ws in conexoes:
            try:
                await ws.send_json(payload)
            except Exception:
                self.disconnect(sala, ws)


manager = ConnectionManager()
