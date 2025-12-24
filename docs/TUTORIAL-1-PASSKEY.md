# Tutorial 1: Passkey Authentication

> Learn how to create and connect wallets using biometric authentication (FaceID, TouchID, Windows Hello).

## Overview

This tutorial covers:
1. Setting up the LazorKit provider
2. Using the `useWallet` hook
3. Creating new passkey wallets
4. Connecting existing wallets
5. Handling connection states

---

## Step 1: Install Dependencies

```bash
npm install @lazorkit/wallet @coral-xyz/anchor @solana/web3.js
```

---

## Step 2: Set Up the Provider

Wrap your application with `LazorkitProvider` to enable wallet functionality.

```tsx
// src/lib/providers.tsx
"use client";

import { LazorkitProvider } from "@lazorkit/wallet";

// Buffer polyfill (required for Solana web3.js)
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || require("buffer").Buffer;
}

const CONFIG = {
  RPC_URL: "https://api.devnet.solana.com",
  PORTAL_URL: "https://portal.lazor.sh",
  PAYMASTER: {
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  },
};

export function Providers({ children }) {
  return (
    <LazorkitProvider
      rpcUrl={CONFIG.RPC_URL}
      portalUrl={CONFIG.PORTAL_URL}
      paymasterConfig={CONFIG.PAYMASTER}
    >
      {children}
    </LazorkitProvider>
  );
}
```

Then use it in your root layout:

```tsx
// src/app/layout.tsx
import { Providers } from "@/lib/providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## Step 3: Use the `useWallet` Hook

The `useWallet` hook provides everything you need for authentication:

```tsx
import { useWallet } from "@lazorkit/wallet";

function MyComponent() {
  const {
    // State
    isConnected,      // boolean - is user connected?
    isConnecting,     // boolean - is connection in progress?
    wallet,           // object - wallet info (smartWallet, credentialId, etc.)
    smartWalletPubkey, // PublicKey - the user's wallet address

    // Actions
    connect,          // function - trigger passkey auth
    disconnect,       // function - disconnect wallet
  } = useWallet();
}
```

---

## Step 4: Create a Connect Button

Here's a complete, copy-paste-ready component:

```tsx
// components/ConnectButton.tsx
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, wallet } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setError(null);
      await connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    }
  };

  if (isConnected && wallet) {
    return (
      <div>
        <p>Connected: {wallet.smartWallet.slice(0, 8)}...</p>
        <button onClick={disconnect}>Disconnect</button>
      </div>
    );
  }

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleConnect} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect with Passkey"}
      </button>
    </div>
  );
}
```

---

## How It Works Under the Hood

When a user clicks "Connect with Passkey":

```
1. LazorKit opens the Portal URL (portal.lazor.sh)
2. Browser prompts for biometric authentication
   └─ FaceID on iPhone/Mac
   └─ TouchID on Mac
   └─ Windows Hello on Windows
3. A WebAuthn credential is created in the device's Secure Enclave
4. LazorKit derives a Solana PDA (Program Derived Address) from the credential
5. This PDA becomes the user's "smart wallet"
```

**Key insight**: The private key NEVER leaves the device. It's stored in hardware (Secure Enclave) and signing happens on-device.

---

## Common Patterns

### Check if User is Connected Before Actions

```tsx
const { isConnected, smartWalletPubkey } = useWallet();

const handleAction = async () => {
  if (!isConnected || !smartWalletPubkey) {
    alert("Please connect your wallet first");
    return;
  }
  // Proceed with action...
};
```

### Display Wallet Address

```tsx
const { wallet, smartWalletPubkey } = useWallet();

// Option 1: Full address string
<p>{wallet?.smartWallet}</p>

// Option 2: Truncated
<p>{smartWalletPubkey?.toBase58().slice(0, 8)}...</p>
```

---

## Next Steps

- [Tutorial 2: Gasless Transactions](./TUTORIAL-2-GASLESS.md) - Send SOL without gas
- [Tutorial 3: Session Persistence](./TUTORIAL-3-SESSION.md) - Stay logged in

---

## Troubleshooting

**Passkey prompt not appearing?**
- Ensure you're on HTTPS or localhost
- Check browser compatibility (Chrome 67+, Safari 14+, Firefox 60+)

**"User cancelled" error?**
- User dismissed the biometric prompt
- Handle gracefully in your UI

**Buffer errors?**
- Add the polyfill shown in Step 2
