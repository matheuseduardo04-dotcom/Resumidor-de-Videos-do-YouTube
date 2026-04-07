"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DAILY_LIMIT = 20;

function getUsage() {
  try {
    const raw = localStorage.getItem("mdai-usage");
    const today = new Date().toISOString().slice(0, 10);
    if (!raw) return { date: today, count: 0 };
    const parsed = JSON.parse(raw);
    if (parsed.date !== today) return { date: today, count: 0 };
    return parsed;
  } catch {
    return { date: new Date().toISOString().slice(0, 10), count: 0 };
  }
}

function saveUsage(usage) {
  localStorage.setItem("mdai-usage", JSON.stringify(usage));
}

const SUGGESTIONS = [
  { label: "Programação", text: "Me explique como funciona uma API REST com exemplos práticos." },
  { label: "Criatividade", text: "Crie um slogan impactante para uma startup de tecnologia." },
  { label: "Produtividade", text: "Quais são as melhores técnicas para melhorar o foco no trabalho?" },
  { label: "Análise", text: "Quais são as tendências de IA para 2025 e 2026?" },
];

export default function HomePage() {
  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState({ date: "", count: 0 });
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Load theme + usage
  useEffect(() => {
    const saved = localStorage.getItem("mdai-theme") || "dark";
    setTheme(saved);
    document.documentElement.dataset.theme = saved;
    setUsage(getUsage());
  }, []);

  // Save theme
  useEffect(() => {
    localStorage.setItem("mdai-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  // Close sidebar on overlay click
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  function startNewChat() {
    setMessages([]);
    setInput("");
    setSidebarOpen(false);
  }

  function fillSuggestion(text) {
    setInput(text);
    setSidebarOpen(false);
    textareaRef.current?.focus();
  }

  async function sendMessage(content) {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    const currentUsage = getUsage();
    if (currentUsage.count >= DAILY_LIMIT) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Você atingiu o limite de ${DAILY_LIMIT} mensagens por dia. Volte amanhã para continuar conversando! 😊`,
          isError: true,
        },
      ]);
      return;
    }

    const userMsg = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const newUsage = { date: currentUsage.date, count: currentUsage.count + 1 };
    saveUsage(newUsage);
    setUsage(newUsage);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Erro ao obter resposta.", isError: true },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.output }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Falha na conexão. Verifique sua internet e tente novamente.", isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="app">
      {/* Sidebar overlay (mobile) */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " visible" : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-icon">✦</div>
            <div className="brand-name">
              Matheus Dev IA
              <span className="brand-tag">Powered by Claude</span>
            </div>
          </div>
          <button className="new-chat-btn" onClick={startNewChat}>
            + Nova conversa
          </button>
        </div>

        <div className="sidebar-body">
          <p className="sidebar-section-label">Sugestões</p>
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              className="suggestion-btn"
              onClick={() => fillSuggestion(s.text)}
            >
              <strong style={{ display: "block", marginBottom: 2, color: "var(--accent)", fontSize: "0.72rem" }}>
                {s.label}
              </strong>
              {s.text}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <span className="footer-info">
            Matheus Dev IA<br />v1.0 · Claude
          </span>
          <button
            className="icon-btn"
            onClick={toggleTheme}
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="chat-main">
        {/* Mobile topbar */}
        <div className="mobile-topbar">
          <button className="icon-btn" onClick={() => setSidebarOpen(true)} title="Menu">
            ☰
          </button>
          <div className="brand-icon" style={{ width: 28, height: 28, borderRadius: 8, fontSize: "0.8rem", background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center" }}>
            ✦
          </div>
          <span className="brand-name" style={{ flex: 1, fontSize: "0.88rem" }}>Matheus Dev IA</span>
          <button className="icon-btn" onClick={toggleTheme} title="Tema">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Messages */}
        <div className="messages-area">
          <div className="messages-inner">
            {messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-icon">✦</div>
                <h1>Matheus Dev IA</h1>
                <p>Seu assistente inteligente powered by Claude. Pergunte qualquer coisa e receba respostas rápidas e úteis.</p>

                <div className="welcome-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      className="welcome-card"
                      onClick={() => fillSuggestion(s.text)}
                    >
                      <strong>{s.label}</strong>
                      {s.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div className="msg-group" key={i}>
                    <div className={`msg-row${msg.role === "user" ? " user" : ""}`}>
                      <div className={`avatar ${msg.role === "user" ? "user" : "ai"}`}>
                        {msg.role === "user" ? "U" : "✦"}
                      </div>
                      <div className={`bubble ${msg.role === "user" ? "user" : "ai"}${msg.isError ? " error" : ""}`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="msg-group">
                    <div className="msg-row">
                      <div className="avatar ai">✦</div>
                      <div className="bubble ai">
                        <div className="thinking">
                          <span /><span /><span />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="composer-wrap">
          <form className="composer" onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mensagem para o Matheus Dev IA..."
              rows={1}
              disabled={loading}
            />
            <div className="composer-actions">
              <span className="composer-hint">
                {usage.count >= DAILY_LIMIT
                  ? "⛔ Limite diário atingido — volte amanhã"
                  : `Enter para enviar · ${DAILY_LIMIT - usage.count} mensagens restantes hoje`}
              </span>
              <button
                className="send-btn"
                type="submit"
                disabled={!input.trim() || loading || usage.count >= DAILY_LIMIT}
              >
                {loading ? "Gerando..." : "Enviar ↑"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
