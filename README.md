<!-- ===================== BANNER ===================== -->
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=FF0000&height=200&section=header&text=Resumidor%20de%20V%C3%ADdeos%20do%20YouTube&fontSize=38&fontColor=ffffff&animation=fadeIn&fontAlignY=50" width="100%" />

<img src="https://cdn.simpleicons.org/youtube/FF0000" width="80" alt="YouTube" />

<br/><br/>

**Cole a URL → receba um resumo estruturado com pontos principais.**

<br/>

<img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/Claude%20API-D97757?style=for-the-badge&logo=anthropic&logoColor=white" />
<img src="https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" />

</div>

---

## 📝 Sobre o Projeto

Aplicação web que recebe a URL de um vídeo do YouTube e retorna um resumo estruturado, contendo o **tema central**, os **pontos principais** e a **conclusão** do conteúdo. Construída em Python com FastAPI e a API do Claude (Anthropic) como motor de IA.

---

## ⚙️ Como Funciona

```
1.  Extrai a transcrição do vídeo (legendas do YouTube)
        ↓
2.  Envia para a API do Claude (Anthropic) processar
        ↓
3.  Retorna um resumo com tema central, pontos principais e conclusão
```

---

## 📦 Requisitos

- **Python 3.10+**
- **Chave da API da Anthropic** ([criar aqui](https://console.anthropic.com/))

---

## 🚀 Setup

Clone o repositório e entre na pasta:

```bash
git clone https://github.com/matheuseduardo04-dotcom/<nome-do-repo>.git
cd <nome-do-repo>
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Configure a chave da API:

```bash
cp .env.example .env.local
# edite .env.local com sua chave da Anthropic
```

Rode o servidor:

```bash
python3 app.py
```

Acesse no navegador:

```
http://localhost:3000
```

---

## 🛠️ Stack

<table>
  <tr>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/python/3776AB" width="40" /><br/>
      <b>Python</b>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/fastapi/009688" width="40" /><br/>
      <b>FastAPI</b>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/anthropic/D97757" width="40" /><br/>
      <b>Claude API</b>
    </td>
    <td align="center" width="120">
      <img src="https://cdn.simpleicons.org/youtube/FF0000" width="40" /><br/>
      <b>YouTube</b>
    </td>
  </tr>
</table>

---

## 👤 Autor

<div align="center">

**Matheus Eduardo**

[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/matheus-eduardo-6a71463b0)
[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/matheuseduardo04-dotcom)

</div>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=FF0000&height=100&section=footer" width="100%" />

</div>
