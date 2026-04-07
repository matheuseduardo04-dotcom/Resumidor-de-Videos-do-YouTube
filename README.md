# Matheus Dev IA · nextjs-claude-chat

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853d?logo=node.js&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Claude API](https://img.shields.io/badge/Claude%20API-Anthropic-8A2BE2)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)

Assistente conversacional em português inspirado no Claude, com interface moderna (tema claro/escuro), sugestões rápidas e limite diário de uso para evitar abuso. Construído em Next.js (App Router) e estilizado com CSS puro.

## Recursos principais
- UI responsiva com sidebar, autosave de tema (localStorage) e auto-scroll de mensagens.
- Sugestões prontas e botão de nova conversa para zerar o histórico local.
- Limite diário de 20 mensagens por navegador, com aviso amigável ao usuário.
- Rota `/api/generate` chama a API do Claude (Anthropic) com modelo configurável via env.

## Stack
- Next.js 15 (App Router) + React 19.
- API Route serverless com `fetch` direto para Anthropic.
- CSS customizado em `app/globals.css` (sem Tailwind).
- Deploy recomendado na Vercel.

## Requisitos
- Node.js 20+ (recomendado) e npm.

## Como rodar localmente
1) Instale dependências:
```bash
npm install
```
2) Configure variáveis de ambiente:
```bash
cp .env.example .env.local
# edite .env.local com sua chave da Anthropic
```
3) Suba o servidor de desenvolvimento:
```bash
npm run dev
```
4) Acesse http://localhost:3000

## Variáveis de ambiente
- `ANTHROPIC_API_KEY` (obrigatória) – chave da API do Claude.
- `CLAUDE_MODEL` (opcional) – ex: `claude-3-5-sonnet-20241022` (fallback definido no código).

## Scripts npm
- `npm run dev` – desenvolvimento.
- `npm run build` – build de produção.
- `npm run start` – serve o build.
- `npm run lint` – lint do projeto.

## Estrutura do projeto
```
app/
  api/generate/route.js   # chama a API do Claude
  globals.css             # temas, layout e responsividade
  layout.js               # metadata e shell base
  page.js                 # UI do chat e lógica de front
jsconfig.json             # paths/alias
next.config.mjs           # config Next
package.json              # scripts e dependências
```

## Deploy na Vercel
- Crie um novo projeto e selecione este repositório.
- Adicione `ANTHROPIC_API_KEY` (e opcional `CLAUDE_MODEL`) em Project Settings → Environment Variables.
- Build command: `npm run build` · Output: `.next`.

## Notas
- `.env.local` já está ignorado por padrão; nunca versione sua chave.
- Limite diário é salvo no navegador (`localStorage`), portanto reinicia por browser/dia.
