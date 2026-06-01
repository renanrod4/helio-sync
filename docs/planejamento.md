# Planejamento

## Objetivo
Criar um ecossistema integrado para monitoramento de placas solares com login, pareamento via QR Code, telemetria em tempo real e análise histórica.

## Requisitos do Produto
- Monitoramento de status vivo: ativo, repouso, desligado.
- Indicadores em tempo real: voltagem e eficiência.
- Análise histórica: dia, semana, mês.
- Gestão multidispositivo com seletor rápido.

## Fluxo de Pareamento (QR Code)
1. QR Code carrega rota de pareamento com serialId do ESP32.
2. Usuário autenticado confirma o vínculo.
3. Site solicita GPS e salva coordenadas para o dispositivo.
4. Dispositivo busca novos dados na próxima sincronização.

## Comunicação (MQTT)
- Dispositivo publica telemetria em tópico dedicado.
- Servidor consome e grava no banco.
- Servidor publica comandos pendentes para o dispositivo.

## Banco de Dados (MongoDB)

### Coleção Users
Guarda o dono do sistema e preferências globais.

Exemplo:
```json
{
  "_id": "64a7...",
  "email": "renan@exemplo.com",
  "password_hash": "...",
  "base_location": { "lat": -23.50, "lng": -47.45 },
  "registered_at": "2026-04-13",
  "timezone": "America/Sao_Paulo",
  "preferences": {
    "hibernation_rules": []
  }
}
```

### Coleção Devices
Vincula o hardware ao usuário.

Exemplo:
```json
{
  "serialId": "HS-001-A23",
  "ownerId": "64a7...",
  "nickname": "Lótus do Jardim",
  "status": "ativo",
  "config": {
    "overwritten_lat": null,
    "overwritten_lng": null,
    "identify_pending": false
  },
  "last_sync": "2026-04-13T18:00:00Z",
  "firmware": "1.0.3"
}
```

### Coleção Telemetry
Append-only para histórico e gráficos.

Exemplo:
```json
{
  "serialId": "HS-001-A23",
  "timestamp": "2026-04-13T18:00:00Z",
  "status": "ativo",
  "efficiency": 94.2,
  "voltage": 12.6,
  "daily_yield_wh": 450.5,
  "azimuth": 133.2,
  "elevation": 42.1
}
```

## Retenção de Dados
- Telemetria a cada 20 minutos.
- Retenção de 1 ano para dados brutos.
- Considerar rollups diários para histórico longo.

## Queries do Dashboard
- Status vivo: Devices por ownerId, ordenado por last_sync.
- Indicadores: último registro de Telemetry por device.
- Histórico: Telemetry filtrado por período.

## Segurança
- Auth com email/senha (bcrypt).
- Tokens por dispositivo no MQTT.
- Validação de payloads.
- Rate limit para pareamento e ingestão.