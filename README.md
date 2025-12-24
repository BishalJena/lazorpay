# LazorPay 🔐

> **Production-ready starter template** for building Solana apps with **passkey authentication** and **gasless transactions** using [LazorKit](https://lazorkit.com).

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://lazpas-superteam.vercel.app)
[![Solana Devnet](https://img.shields.io/badge/network-devnet-blue)](https://solana.com)
[![Built with LazorKit](https://img.shields.io/badge/built%20with-LazorKit-purple)](https://lazorkit.com)

---

## 🎯 What This Template Demonstrates

| Feature | Description | Tutorial |
|---------|-------------|----------|
| **Passkey Authentication** | Create wallets with FaceID/TouchID — no seed phrases! | [Tutorial 1](docs/TUTORIAL-1-PASSKEY.md) |
| **Gasless SOL Transfer** | Send SOL without holding SOL for gas fees | [Tutorial 2](docs/TUTORIAL-2-GASLESS.md) |
| **USDC Transfer** | Send SPL tokens like USDC with gasless transactions | [Tutorial 4](docs/TUTORIAL-4-USDC.md) |
| **Session Persistence** | Stay logged in across browser sessions securely | [Tutorial 3](docs/TUTORIAL-3-SESSION.md) |

---

## 🚀 Quick Start (Under 2 Minutes)

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/BishalJena/lazorpay.git
cd lazorpay

# 2. Install dependencies
npm install

# 3. Set up environment (optional - defaults work for Devnet)
cp .env.example .env.local

# 4. Run the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live on Solana Devnet!

### 🔐 HTTPS Setup (Required for Transaction Signing)

WebAuthn requires HTTPS for passkey signing. For local development:

```bash
# Install mkcert (one-time setup)
brew install mkcert
mkcert -install

# Generate local certificates
mkdir -p certs && cd certs && mkcert localhost 127.0.0.1 ::1

# Run with HTTPS
npm run dev:https
```

Open [https://localhost:3000](https://localhost:3000) — transactions will now work!

---

## 📦 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **LazorKit SDK** | Passkey wallet + Paymaster |
| **Tailwind CSS v4** | Styling with CSS-first config |
| **TypeScript** | Type safety |
| **Solana Web3.js** | Blockchain interaction |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts & providers
│   ├── page.tsx            # Landing page with all 3 demos
│   └── globals.css         # Tailwind v4 + custom styles
│
├── components/ui/          # Reusable UI components
│   ├── Button.tsx          # Primary/Secondary/Ghost variants
│   ├── Card.tsx            # Elevated card with shadow
│   └── Input.tsx           # Styled form input
│
├── examples/               # ⭐ THE MAIN LEARNING RESOURCES
│   ├── passkey-auth.tsx    # Example 1: Biometric wallet creation
│   ├── gasless-send.tsx    # Example 2: Send SOL without gas
│   └── session-persist.tsx # Example 3: Local session storage
│
├── lib/
│   └── providers.tsx       # LazorKit SDK configuration
│
└── docs/                   # Step-by-step tutorials
    ├── TUTORIAL-1-PASSKEY.md
    ├── TUTORIAL-2-GASLESS.md
    └── TUTORIAL-3-SESSION.md
```

---

## 📖 Step-by-Step Tutorials

### [Tutorial 1: Passkey Authentication](docs/TUTORIAL-1-PASSKEY.md)
Learn how to:
- Set up `LazorkitProvider`
- Use the `useWallet` hook
- Create wallets with biometrics
- Handle connection states

### [Tutorial 2: Gasless Transactions](docs/TUTORIAL-2-GASLESS.md)
Learn how to:
- Send SOL without paying gas
- Configure the Paymaster
- Sign transactions with passkey
- Handle transaction states

### [Tutorial 3: Session Persistence](docs/TUTORIAL-3-SESSION.md)
Learn how to:
- Persist sessions across refreshes
- Auto-reconnect returning users
- Manage session lifecycle securely

---

## 🧩 Key Code Examples

### 1. Connect with Passkey

```tsx
import { useWallet } from "@lazorkit/wallet";

function ConnectButton() {
  const { connect, isConnected, smartWalletPubkey } = useWallet();

  if (isConnected) {
    return <p>Connected: {smartWalletPubkey?.toBase58().slice(0, 8)}...</p>;
  }

  return <button onClick={connect}>Connect with Passkey</button>;
}
```

### 2. Send Gasless Transaction

```tsx
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

function SendButton() {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();

  const handleSend = async () => {
    const instruction = SystemProgram.transfer({
      fromPubkey: smartWalletPubkey!,
      toPubkey: new PublicKey("RECIPIENT_ADDRESS"),
      lamports: 0.01 * LAMPORTS_PER_SOL,
    });

    // Gas is sponsored by Paymaster — user pays $0!
    const signature = await signAndSendTransaction({
      instructions: [instruction],
    });
    
    console.log("Transaction:", signature);
  };

  return <button onClick={handleSend}>Send 0.01 SOL (Gasless)</button>;
}
```

---

## � Configuration

### Environment Variables

Create `.env.local` from the template:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|----------|-------------|---------||`NEXT_PUBLIC_RPC_URL` | Solana RPC endpoint | `https://api.devnet.solana.com` |
| `NEXT_PUBLIC_PORTAL_URL` | LazorKit passkey portal | `https://portal.lazor.sh` |
| `NEXT_PUBLIC_PAYMASTER_URL` | Gas sponsorship service | `https://kora.devnet.lazorkit.com` |

### Switching to Mainnet

```bash
# In .env.local
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PAYMASTER_URL=https://kora.mainnet.lazorkit.com
```

---

## 🐛 Troubleshooting

<details>
<summary><strong>"Buffer is not defined"</strong></summary>

Add the polyfill in `src/lib/providers.tsx`:
```tsx
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || require("buffer").Buffer;
}
```
</details>

<details>
<summary><strong>Passkey not working</strong></summary>

- Ensure you're on HTTPS or localhost
- Check browser supports WebAuthn (Chrome 67+, Safari 14+, Firefox 60+)
- Clear site data and try again
</details>

<details>
<summary><strong>Transaction failing</strong></summary>

- Verify you're on Devnet (check RPC URL)
- Ensure the Paymaster URL is correct
- Check console for detailed error messages
</details>

---

## 🎥 Video Walkthrough

Coming soon — a 2-minute demo showing the complete passkey wallet flow.

---

## 🔗 Resources

- [LazorKit Documentation](https://docs.lazorkit.com/)
- [LazorKit GitHub](https://github.com/lazor-kit/lazor-kit)
- [Telegram Community](https://t.me/lazorkit)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)

---

## 📄 License

MIT © 2025

---

## 👤 Author

**Bishal Jena**
- GitHub: [@BishalJena](https://github.com/BishalJena)

---

Built for [Superteam Vietnam Hackathon](https://superteam.fun) 🇻🇳 | Powered by [LazorKit](https://lazorkit.com)
