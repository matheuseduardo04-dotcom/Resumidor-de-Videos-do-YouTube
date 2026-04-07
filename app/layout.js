import "./globals.css";

export const metadata = {
  title: "Matheus Dev IA",
  description:
    "Converse com o Matheus Dev IA — assistente inteligente powered by Claude da Anthropic.",
  keywords: ["IA", "chat inteligente", "Claude", "Anthropic", "Matheus Dev IA", "Next.js"],
  openGraph: {
    title: "Matheus Dev IA",
    description: "Assistente de IA inteligente e conversacional feito por Matheus.",
    siteName: "Matheus Dev IA",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
