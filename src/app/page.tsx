"use client";

import { useWallet } from "@lazorkit/wallet";
import { PasskeyAuthExample } from "@/examples/passkey-auth";
import { GaslessSendExample } from "@/examples/gasless-send";
import { SessionPersistExample } from "@/examples/session-persist";
import { UsdcTransferExample } from "@/examples/usdc-transfer";
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
  ),
  DollarSign: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
};



export default function Home() {
  const { isConnected, smartWalletPubkey } = useWallet();

  return (
    <main className="min-h-screen bg-transparent font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">

      {/* Background Blur Overlay */}
      <div className="fixed inset-0 backdrop-blur-[2px] bg-white/30 -z-10" />

      {/* Navbar */}

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-2xl tracking-tighter text-gray-900">LazorPay</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wide uppercase">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            {isConnected && smartWalletPubkey && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-xs font-semibold font-mono tracking-tight">
                <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
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

        {/* Demo Grid - 4 Columns */}
        <section id="demo" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Feature 1: Biometric Auth */}
          <Card className="p-5 flex flex-col min-h-[320px]">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 shrink-0">
              <Icons.Fingerprint />
            </div>
            <h3 className="text-base font-bold mb-2">Biometric Auth</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">
              Replace seed phrases with FaceID/TouchID.
            </p>
            <div className="mt-auto">
              <PasskeyAuthExample />
            </div>
          </Card>

          {/* Feature 2: Gasless SOL */}
          <Card className="p-5 flex flex-col min-h-[320px]">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 shrink-0">
              <Icons.Zap />
            </div>
            <h3 className="text-base font-bold mb-2">Gasless SOL</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">
              Sponsor fees with Paymaster. $0 SOL to start.
            </p>
            <div className="mt-auto">
              <GaslessSendExample />
            </div>
          </Card>

          {/* Feature 3: USDC Transfer */}
          <Card className="p-5 flex flex-col min-h-[320px]">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4 shrink-0">
              <Icons.DollarSign />
            </div>
            <h3 className="text-base font-bold mb-2">USDC Transfer</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">
              Send SPL tokens gaslessly. Real payments.
            </p>
            <div className="mt-auto">
              <UsdcTransferExample />
            </div>
          </Card>

          {/* Feature 4: Session */}
          <Card className="p-5 flex flex-col min-h-[320px]">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mb-4 shrink-0">
              <Icons.Database />
            </div>
            <h3 className="text-base font-bold mb-2">Session</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">
              Stay logged in across refreshes.
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
