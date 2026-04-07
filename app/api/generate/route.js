export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Envie mensagens válidas." }, { status: 400 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Chave ANTHROPIC_API_KEY não configurada no servidor." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system:
          "Você é o Matheus Dev IA, um assistente inteligente, amigável e objetivo criado por Matheus. " +
          "Responda de forma clara e útil em português, a menos que o usuário escreva em outro idioma. " +
          "Seja direto, mas nunca seco. Quando adequado, use formatação para facilitar a leitura.",
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data?.error?.message || "Erro ao conectar com o Claude.";
      return Response.json({ error: msg }, { status: response.status });
    }

    const output = data.content?.[0]?.text ?? "Sem resposta.";
    return Response.json({ output });
  } catch (error) {
    return Response.json(
      { error: error.message || "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
