import os
import re

import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi

load_dotenv(".env.local")

app = FastAPI()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-haiku-4-5-20251001")


def extract_video_id(url: str) -> str | None:
    patterns = [
        r"(?:youtube\.com\/watch\?v=)([\w-]{11})",
        r"(?:youtu\.be\/)([\w-]{11})",
        r"(?:youtube\.com\/embed\/)([\w-]{11})",
        r"(?:youtube\.com\/shorts\/)([\w-]{11})",
    ]
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None


ytt_api = YouTubeTranscriptApi()


def get_transcript(video_id: str) -> str:
    try:
        entries = ytt_api.fetch(video_id, languages=["pt", "pt-BR", "en"])
        return " ".join(entry.text for entry in entries)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Não foi possível obter a transcrição do vídeo. Verifique se o vídeo tem legendas disponíveis. Erro: {str(e)}",
        )


def summarize_with_claude(transcript: str) -> str:
    if not ANTHROPIC_API_KEY:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY não configurada.")

    max_chars = 80000
    if len(transcript) > max_chars:
        transcript = transcript[:max_chars]

    payload = {
        "model": CLAUDE_MODEL,
        "max_tokens": 2048,
        "system": (
            "Você é um resumidor de vídeos do YouTube. "
            "Receba a transcrição e retorne um resumo estruturado em português. "
            "Formato obrigatório:\n"
            "1. Uma frase com o tema central do vídeo.\n"
            "2. Lista de pontos principais (máximo 7), cada um com 1-2 frases.\n"
            "3. Uma conclusão curta com o que o espectador deve levar do vídeo.\n"
            "Não use markdown. Texto puro. Seja direto e útil."
        ),
        "messages": [{"role": "user", "content": f"Transcrição do vídeo:\n\n{transcript}"}],
    }

    try:
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
            },
            json=payload,
            timeout=90,
        )
        result = response.json()

        if not response.ok:
            msg = result.get("error", {}).get("message", "Erro ao conectar com o Claude.")
            raise HTTPException(status_code=response.status_code, detail=msg)

        return result.get("content", [{}])[0].get("text", "Sem resposta.")

    except HTTPException:
        raise
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Tempo limite excedido.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class SummarizeRequest(BaseModel):
    url: str


@app.post("/api/summarize")
def summarize(req: SummarizeRequest):
    video_id = extract_video_id(req.url)
    if not video_id:
        raise HTTPException(status_code=400, detail="URL do YouTube inválida.")

    transcript = get_transcript(video_id)
    summary = summarize_with_claude(transcript)
    return {"video_id": video_id, "summary": summary}


@app.get("/", response_class=HTMLResponse)
def index():
    with open("static/index.html") as f:
        return f.read()


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3000))
    uvicorn.run(app, host="0.0.0.0", port=port)