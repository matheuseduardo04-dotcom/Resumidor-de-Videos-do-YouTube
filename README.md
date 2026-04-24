# Resumidor de Vídeos do YouTube

Ferramenta que gera resumos estruturados de vídeos do YouTube usando IA. Cole a URL, receba os pontos principais em segundos.

## Como funciona

1. Extrai a transcrição do vídeo (legendas do YouTube)
2. Envia para a API do Claude (Anthropic) processar
3. Retorna um resumo com tema central, pontos principais e conclusão

## Requisitos

- Python 3.10+
- Chave da API da Anthropic

## Setup

```bash
pip install -r requirements.txt
cp .env.example .env.local
# edite .env.local com sua chave da Anthropic
python3 app.py
```

Acesse `http://localhost:3000`

## Stack

- FastAPI
- youtube-transcript-api
- Claude API (Anthropic)
