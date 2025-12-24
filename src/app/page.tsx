"use client";

/**
 * ===========================================
 * LAZORPAY - MAIN DEMO PAGE
 * ===========================================
 *
 * This is the main demonstration page that combines all three examples:
 * 1. Passkey Authentication - Create/connect wallet with biometrics
 * 2. Gasless Transactions - Send SOL without paying gas fees
 * 3. Session Persistence - Stay logged in across sessions
 *
 * PURPOSE:
 * This starter template shows developers how to integrate LazorKit SDK
 * for passkey-based Solana wallets with gasless transactions.
 *
 * @see https://docs.lazorkit.com/
 */

import { PasskeyAuthExample } from "@/examples/passkey-auth";
import { GaslessSendExample } from "@/examples/gasless-send";
import { SessionPersistExample } from "@/examples/session-persist";
import { useWallet } from "@lazorkit/wallet";

export default function Home() {
  const { isConnected, smartWalletPubkey } = useWallet();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔐</span>
            <h1 className="text-xl font-bold text-white">LazorPay</h1>
          </div>
          {isConnected && smartWalletPubkey && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-300 font-mono">
                {smartWalletPubkey.toBase58().slice(0, 4)}...
                {smartWalletPubkey.toBase58().slice(-4)}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Passkey Wallet Starter
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
          A developer-friendly template for building Solana apps with
          <span className="text-purple-400 font-semibold"> biometric authentication</span> and
          <span className="text-green-400 font-semibold"> gasless transactions</span>.
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300">
            ✅ No seed phrases
          </span>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300">
            ✅ No wallet extension
          </span>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300">
            ✅ No gas fees
          </span>
        </div>
      </section>

      {/* Examples Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Example 1: Passkey Auth */}
          <div className="transform hover:scale-[1.02] transition-transform">
            <PasskeyAuthExample />
          </div>

          {/* Example 2: Gasless Send */}
          <div className="transform hover:scale-[1.02] transition-transform">
            <GaslessSendExample />
          </div>

          {/* Example 3: Session Persist */}
          <div className="transform hover:scale-[1.02] transition-transform">
            <SessionPersistExample />
          </div>
        </div>
      </section>

      {/* Developer Resources */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-4">📚 Developer Resources</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="https://docs.lazorkit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            >
              <h4 className="font-semibold text-white mb-1">📖 Documentation</h4>
              <p className="text-sm text-gray-400">Official LazorKit SDK docs</p>
            </a>
            <a
              href="https://github.com/lazor-kit/lazor-kit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            >
              <h4 className="font-semibold text-white mb-1">💻 GitHub</h4>
              <p className="text-sm text-gray-400">View source code</p>
            </a>
            <a
              href="https://t.me/lazorkit"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            >
              <h4 className="font-semibold text-white mb-1">💬 Telegram</h4>
              <p className="text-sm text-gray-400">Join the community</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <p className="text-sm text-gray-500">
            Built for{" "}
            <span className="text-purple-400">Superteam Vietnam Hackathon</span>
            {" "}• Powered by{" "}
            <a
              href="https://lazorkit.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              LazorKit
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
