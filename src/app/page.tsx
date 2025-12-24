"use client";

import { useWallet } from "@lazorkit/wallet";
import { PasskeyAuthExample } from "@/examples/passkey-auth";
import { GaslessSendExample } from "@/examples/gasless-send";
import { SessionPersistExample } from "@/examples/session-persist";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

// Clean Line Icons
const Icons = {
  Fingerprint: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-2.6 4.5c-.31.24-.2.72.15.8c.96.22 2.45.6 4.45.6s3.49-.38 4.45-.6c.35-.08.46-.56.15-.8c-2.5-1.99-2.6-3.48-2.6-4.5a2 2 0 0 0-2-2Z" />
      <path d="M6 10V8a6 6 0 0 1 12 0v2" />
    </svg>
  ),
  Zap: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Database: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
};

export default function Home() {
  const { isConnected, smartWalletPubkey } = useWallet();

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">

      {/* Soft Gradient Background Mesh */}
      <div className="fixed inset-0 bg-gradient-mesh opacity-60 pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-blue-200 shadow-lg">
              L
            </div>
            <span className="font-bold text-xl tracking-tight">LazorPay</span>
          </div>
          <div className="flex items-center gap-4">
            {isConnected && smartWalletPubkey && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 border border-green-100 text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                {smartWalletPubkey.toBase58().slice(0, 4)}...{smartWalletPubkey.toBase58().slice(-4)}
              </div>
            )}
            <a href="https://docs.lazorkit.com" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Documentation</a>
            <Button variant="secondary" size="sm" onClick={() => window.open('https://github.com/lazor-kit', '_blank')}>
              GitHub
            </Button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 pb-32">

        {/* Hero */}
        <header className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-8 border border-blue-100">
            ✨ Live on Solana Devnet
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]">
            The passkey wallet stack <br />
            <span className="text-blue-600">for ambitious products.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            A production-ready starter template for next-gen Solana apps. Biometric auth, gasless transactions, and seamless session management.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}>
              Try the Demo
            </Button>
            <Button variant="secondary" size="lg" onClick={() => window.open('https://github.com/lazor-kit', '_blank')}>
              View Source
            </Button>
          </div>
        </header>

        {/* Demo Grid */}
        <section id="demo" className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Feature 1 */}
          <Card className="p-8 flex flex-col h-full">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
              <Icons.Fingerprint />
            </div>
            <h3 className="text-xl font-bold mb-3">Biometric Auth</h3>
            <p className="text-gray-500 leading-relaxed mb-8 flex-grow">
              Replace seed phrases with FaceID and TouchID using standard WebAuthn passkeys.
            </p>
            <div className="mt-auto">
              <PasskeyAuthExample />
            </div>
          </Card>

          {/* Feature 2 */}
          <Card className="p-8 flex flex-col h-full">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6">
              <Icons.Zap />
            </div>
            <h3 className="text-xl font-bold mb-3">Gasless Transactions</h3>
            <p className="text-gray-500 leading-relaxed mb-8 flex-grow">
              Sponsor transaction fees for your users using a Paymaster. Onboard users with $0 SOL.
            </p>
            <div className="mt-auto">
              <GaslessSendExample />
            </div>
          </Card>

          {/* Feature 3 */}
          <Card className="p-8 flex flex-col h-full">
            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-6">
              <Icons.Database />
            </div>
            <h3 className="text-xl font-bold mb-3">Session Persistence</h3>
            <p className="text-gray-500 leading-relaxed mb-8 flex-grow">
              Securely store session keys in local storage to keep users logged in across refreshes.
            </p>
            <div className="mt-auto">
              <SessionPersistExample />
            </div>
          </Card>

        </section>

        <footer className="mt-32 border-t border-gray-100 pt-12 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <p>&copy; 2025 LazorPay. Built for Superteam Vietnam.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-blue-600 transition-colors">GitHub</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Docs</a>
          </div>
        </footer>

      </div>
    </main>
  );
}
