# Matheus Dev IA

Assistente de IA conversacional powered by Claude da Anthropic.

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Claude](https://img.shields.io/badge/Claude-D97757?style=for-the-badge&logo=anthropic&logoColor=white)

## Sobre

Chat com IA que utiliza o modelo Claude da Anthropic. Interface responsiva com suporte a tema claro e escuro, sugestões de perguntas e limite diário de mensagens.

## Tecnologias

- **Python + Flask** — servidor web e API
- **HTML/CSS/JS** — interface sem frameworks
- **Claude API (Anthropic)** — modelo de linguagem

## Como rodar

**1. Instalar dependencias:**
```bash
uv pip install -r requirements.txt
```

**2. Configurar a API key:**

Crie um arquivo `.env.local` na raiz do projeto:
```
ANTHROPIC_API_KEY=sua_chave_aqui
```

Obtenha sua chave em: https://console.anthropic.com/settings/keys

**3. Rodar o servidor:**
```bash
uv run python3 app.py
```

Acesse em: http://127.0.0.1:3000
