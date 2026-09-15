from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.configuracao_loja import ConfiguracaoLoja
from app.schemas.configuracao_schema import ConfiguracaoLojaResponse, ConfiguracaoLojaUpdate
from app.security.dependencies import require_gerencia

router = APIRouter(prefix="/configuracoes", tags=["Configurações"])


def _obter_ou_criar(db: Session) -> ConfiguracaoLoja:
    config = db.get(ConfiguracaoLoja, 1)
    if not config:
        config = ConfiguracaoLoja(id=1, nome_loja="Yummy")
        db.add(config)
        db.commit()
        db.refresh(config)
    return config


@router.get("", response_model=ConfiguracaoLojaResponse)
def obter_configuracoes(db: Session = Depends(get_db), _u=Depends(require_gerencia)):
    return _obter_ou_criar(db)


@router.put("", response_model=ConfiguracaoLojaResponse)
def atualizar_configuracoes(
    dados: ConfiguracaoLojaUpdate, db: Session = Depends(get_db), _u=Depends(require_gerencia)
):
    config = _obter_ou_criar(db)
    for campo, valor in dados.model_dump().items():
        setattr(config, campo, valor)
    db.commit()
    db.refresh(config)
    return config
