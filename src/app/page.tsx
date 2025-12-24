"use client";

/**
 * ===========================================
 * LAZORPAY - MAIN DEMO PAGE
 * ===========================================
 * 
 * Professional, minimalist UI demonstrating LazorKit SDK integration.
 */

import { PasskeyAuthExample } from "@/examples/passkey-auth";
import { GaslessSendExample } from "@/examples/gasless-send";
import { SessionPersistExample } from "@/examples/session-persist";
import { useWallet } from "@lazorkit/wallet";

export default function Home() {
  const { isConnected, smartWalletPubkey } = useWallet();

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold">
              L
            </div>
            <span className="text-lg font-semibold tracking-tight">LazorPay</span>
          </div>

          {isConnected && smartWalletPubkey && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <code className="text-xs text-emerald-400 font-mono">
                {smartWalletPubkey.toBase58().slice(0, 6)}...{smartWalletPubkey.toBase58().slice(-4)}
              </code>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Passkey Wallet
            <br />
            <span className="text-neutral-500">Starter Template</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-neutral-400 leading-relaxed">
            Build Solana apps with biometric authentication and gasless transactions.
            No seed phrases. No wallet extensions. No gas fees.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Passkey Auth", "Gasless TX", "Session Persist"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          <PasskeyAuthExample />
          <GaslessSendExample />
          <SessionPersistExample />
        </div>
      </section>

      {/* Resources */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl">
          <h2 className="text-sm font-semibold text-neutral-300 mb-4">Resources</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Documentation", href: "https://docs.lazorkit.com", icon: "📖" },
              { label: "GitHub", href: "https://github.com/lazor-kit/lazor-kit", icon: "💻" },
              { label: "Telegram", href: "https://t.me/lazorkit", icon: "💬" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700/50 rounded-xl transition-colors"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-sm font-medium text-neutral-300">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800">
        <div className="mx-auto max-w-5xl px-6 py-6 text-center">
          <p className="text-xs text-neutral-500">
            Built for Superteam Vietnam Hackathon · Powered by{" "}
            <a href="https://lazorkit.com" className="text-neutral-400 hover:text-white transition-colors">
              LazorKit
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
