import type { Metadata } from "next";
import { Inter, Outfit, Lora } from "next/font/google";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";
import ReactQueryProvider from "@/lib/react-query-provider";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "QuantRiskMetrics | Institutional Risk Analytics",
    template: "%s | QuantRiskMetrics"
  },
  description: "Advanced Monte Carlo simulations and survival-focused risk intelligence for professional prop firm traders.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "QuantRiskMetrics | Institutional Risk Analytics",
    description: "Verify your strategy's survival with institutional-grade risk modeling.",
    url: "./",
    siteName: "QuantRiskMetrics",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuantRiskMetrics | Institutional Risk Analytics",
    description: "Verify your strategy's survival with institutional-grade risk modeling.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} ${lora.variable} font-sans antialiased bg-slate-950 text-slate-50 selection:bg-blue-500/30 selection:text-white`}>
        <ReactQueryProvider>
          <AuthProvider>
            <div className="animate-in-fade">
              <React.Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
                <Shell>
                  {children}
                </Shell>
              </React.Suspense>
            </div>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
