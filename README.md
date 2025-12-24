# LazorPay 🔐

> A developer-friendly starter template for building Solana apps with **passkey authentication** and **gasless transactions** using [LazorKit](https://lazorkit.com).

![Demo Screenshot](public/demo.gif)

## ✨ What You'll Learn

| Feature | Description |
|---------|-------------|
| **Passkey Authentication** | Create wallets with FaceID/TouchID - no seed phrases! |
| **Gasless Transactions** | Send SOL/tokens without holding SOL for gas fees |
| **Session Persistence** | Stay logged in across browser sessions |

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/BishalJena/lazorpay.git
cd lazorpay

# Install dependencies
npm install

# Set up environment (optional - defaults work for devnet)
cp .env.example .env.local

# Run the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you should see the demo in under 2 minutes!

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with LazorKit provider
│   └── page.tsx          # Demo page combining all examples
├── examples/             # ⭐ THE MAIN LEARNING RESOURCES
│   ├── passkey-auth.tsx  # Example 1: Wallet creation & login
│   ├── gasless-send.tsx  # Example 2: Send SOL without gas
│   └── session-persist.tsx # Example 3: Stay logged in
└── lib/
    └── providers.tsx     # LazorKit SDK configuration
```

## 📖 Step-by-Step Tutorials

### Tutorial 1: Passkey Authentication
→ [docs/TUTORIAL-1-PASSKEY.md](docs/TUTORIAL-1-PASSKEY.md)

Learn how to:
- Set up `LazorkitProvider`
- Use the `useWallet` hook
- Create wallets with biometrics
- Handle connection states

### Tutorial 2: Gasless Transactions
→ [docs/TUTORIAL-2-GASLESS.md](docs/TUTORIAL-2-GASLESS.md)

Learn how to:
- Send SOL without paying gas
- Configure the Paymaster
- Sign transactions with passkey
- Handle transaction states

### Tutorial 3: Session Persistence
→ [docs/TUTORIAL-3-SESSION.md](docs/TUTORIAL-3-SESSION.md)

Learn how to:
- Persist sessions across refreshes
- Auto-reconnect returning users
- Manage session lifecycle

## 🔧 Configuration

### Environment Variables

Create `.env.local` from the template:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_RPC_URL` | Solana RPC endpoint | `https://api.devnet.solana.com` |
| `NEXT_PUBLIC_PORTAL_URL` | LazorKit passkey portal | `https://portal.lazor.sh` |
| `NEXT_PUBLIC_PAYMASTER_URL` | Gas sponsorship service | `https://kora.devnet.lazorkit.com` |

### Switching to Mainnet

```bash
# In .env.local
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_PAYMASTER_URL=https://kora.mainnet.lazorkit.com
```

## 🧩 Key Code Examples

### 1. Connect with Passkey

```tsx
import { useWallet } from "@lazorkit/wallet";

function ConnectButton() {
  const { connect, isConnected, wallet } = useWallet();

  if (isConnected) {
    return <p>Connected: {wallet.smartWallet}</p>;
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
      fromPubkey: smartWalletPubkey,
      toPubkey: new PublicKey("RECIPIENT_ADDRESS"),
      lamports: 0.01 * LAMPORTS_PER_SOL,
    });

    // Gas is sponsored by Paymaster - user pays nothing!
    const signature = await signAndSendTransaction({
      instructions: [instruction],
    });
    
    console.log("Transaction:", signature);
  };

  return <button onClick={handleSend}>Send 0.01 SOL (Gasless)</button>;
}
```

## 🐛 Troubleshooting

### "Buffer is not defined"
Add the polyfill in your layout or provider:
```tsx
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || require("buffer").Buffer;
}
```

### Passkey not working
- Ensure you're on HTTPS or localhost
- Check browser supports WebAuthn (Chrome, Safari, Firefox, Edge)
- Clear site data and try again

### Transaction failing
- Verify you're on Devnet (check RPC URL)
- Ensure the Paymaster URL is correct
- Check console for detailed error messages

## 🔗 Resources

- [LazorKit Documentation](https://docs.lazorkit.com/)
- [LazorKit GitHub](https://github.com/lazor-kit/lazor-kit)
- [Telegram Community](https://t.me/lazorkit)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)

## 📄 License

MIT © 2025

---

Built for [Superteam Vietnam Hackathon](https://superteam.fun) 🇻🇳
