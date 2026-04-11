import os
import requests
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

load_dotenv(".env.local")

app = Flask(__name__)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-haiku-4-5-20251001")
DAILY_LIMIT = 20


@app.route("/")
def index():
    return render_template("index.html", daily_limit=DAILY_LIMIT)


@app.route("/api/generate", methods=["POST"])
def generate():
    if not ANTHROPIC_API_KEY:
        return jsonify({"error": "Chave ANTHROPIC_API_KEY não configurada no servidor."}), 500

    data = request.get_json()
    messages = data.get("messages") if data else None

    if not messages or not isinstance(messages, list) or len(messages) == 0:
        return jsonify({"error": "Envie mensagens válidas."}), 400

    payload = {
        "model": CLAUDE_MODEL,
        "max_tokens": 1024,
        "system": (
            "Você é o Matheus Dev IA, um assistente inteligente, amigável e objetivo criado por Matheus. "
            "Responda de forma clara e útil em português, a menos que o usuário escreva em outro idioma. "
            "Seja direto, mas nunca seco. "
            "IMPORTANTE: nunca use markdown nas respostas. Não use hashtags, asteriscos, underlines ou qualquer outra formatação markdown. Escreva sempre em texto puro e simples."
        ),
        "messages": [{"role": m["role"], "content": m["content"]} for m in messages],
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
            timeout=60,
        )
        result = response.json()

        if not response.ok:
            msg = result.get("error", {}).get("message", "Erro ao conectar com o Claude.")
            return jsonify({"error": msg}), response.status_code

        output = result.get("content", [{}])[0].get("text", "Sem resposta.")
        return jsonify({"output": output})

    except requests.exceptions.Timeout:
        return jsonify({"error": "Tempo limite excedido. Tente novamente."}), 504
    except Exception as e:
        return jsonify({"error": str(e) or "Erro interno no servidor."}), 500


if __name__ == "__main__":
    app.run(debug=True, port=3000)
