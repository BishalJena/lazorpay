# Tutorial 2: Gasless Transactions

> Learn how to send SOL and tokens without users paying gas fees using the LazorKit Paymaster.

## Overview

This tutorial covers:
1. How gasless transactions work
2. Setting up the Paymaster
3. Creating transfer instructions
4. Signing and sending transactions
5. Handling transaction states

---

## How Gasless Works

Traditional flow:
```
User → Has SOL for gas → Signs transaction → Pays ~0.000005 SOL → Transaction sent
```

LazorKit flow:
```
User → Signs with passkey → Paymaster pays gas → Transaction sent (FREE for user!)
```

The **Paymaster** is a service that sponsors gas fees on behalf of users. Users don't need any SOL to transact.

---

## Step 1: Prerequisites

Ensure you have:
1. LazorKit provider set up ([Tutorial 1](./TUTORIAL-1-PASSKEY.md))
2. User connected with passkey
3. Dependencies installed:

```bash
npm install @lazorkit/wallet @solana/web3.js
```

---

## Step 2: The `signAndSendTransaction` Function

This is the core function for gasless transactions:

```tsx
import { useWallet } from "@lazorkit/wallet";

const { signAndSendTransaction, smartWalletPubkey } = useWallet();

// Usage
const signature = await signAndSendTransaction({
  instructions: [instruction1, instruction2, ...],
  // Optional: specify gas token
  transactionOptions: {
    feeToken: "USDC" // or undefined for Paymaster sponsorship
  }
});
```

---

## Step 3: Create a Transfer Instruction

Use Solana's `SystemProgram` for native SOL transfers:

```tsx
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// Create instruction
const instruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,    // Your smart wallet (PDA)
  toPubkey: new PublicKey("RECIPIENT_ADDRESS"),
  lamports: 0.01 * LAMPORTS_PER_SOL, // Amount in lamports
});
```

**Important**: `fromPubkey` must be the `smartWalletPubkey` from `useWallet()`.

---

## Step 4: Complete Transfer Component

Here's a full, copy-paste-ready implementation:

```tsx
// components/GaslessTransfer.tsx
"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export function GaslessTransfer() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("0.01");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [txSignature, setTxSignature] = useState("");

  const handleSend = async () => {
    // 1. Validate inputs
    if (!smartWalletPubkey) {
      alert("Please connect your wallet first");
      return;
    }

    if (!recipient) {
      alert("Please enter a recipient address");
      return;
    }

    try {
      setStatus("sending");

      // 2. Validate recipient address
      const destinationPubkey = new PublicKey(recipient);

      // 3. Create transfer instruction
      const instruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: destinationPubkey,
        lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
      });

      // 4. Sign and send (gas is sponsored by Paymaster!)
      const signature = await signAndSendTransaction({
        instructions: [instruction],
      });

      setTxSignature(signature);
      setStatus("success");
      console.log("Transaction confirmed:", signature);

    } catch (error) {
      console.error("Transaction failed:", error);
      setStatus("error");
    }
  };

  if (!isConnected) {
    return <p>Please connect your wallet first.</p>;
  }

  return (
    <div>
      {status === "success" && (
        <a 
          href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
          target="_blank"
        >
          View on Explorer →
        </a>
      )}

      <input
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      
      <input
        type="number"
        placeholder="Amount (SOL)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={handleSend} disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send (Gasless)"}
      </button>
    </div>
  );
}
```

---

## Step 5: Transaction Flow Explained

When you call `signAndSendTransaction`:

```
1. User clicks "Send"
2. LazorKit prompts for passkey authentication
   └─ User provides biometric (FaceID/TouchID)
3. Transaction is signed using the passkey credential
4. Transaction is sent to the Paymaster
5. Paymaster adds gas fee and broadcasts to Solana
6. Transaction is confirmed on-chain
7. Signature is returned
```

**The user never pays gas** - the Paymaster covers it.

---

## Sending Token Transfers (SPL Tokens)

For tokens like USDC, use the Token Program:

```tsx
import { createTransferInstruction, getAssociatedTokenAddress } from "@solana/spl-token";

const handleTokenTransfer = async () => {
  // USDC Devnet mint
  const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
  
  // Get token accounts
  const fromAta = await getAssociatedTokenAddress(USDC_MINT, smartWalletPubkey);
  const toAta = await getAssociatedTokenAddress(USDC_MINT, recipientPubkey);
  
  // Create transfer instruction (1 USDC = 1_000_000 units for 6 decimals)
  const instruction = createTransferInstruction(
    fromAta,
    toAta,
    smartWalletPubkey,
    1_000_000 // 1 USDC
  );
  
  const signature = await signAndSendTransaction({
    instructions: [instruction],
  });
};
```

---

## Pay Gas in USDC (Optional)

Instead of Paymaster sponsorship, users can pay gas in USDC:

```tsx
const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    feeToken: "USDC"  // User pays gas in USDC
  }
});
```

---

## Troubleshooting

**"Insufficient funds" error?**
- The smart wallet needs tokens to transfer
- On Devnet, use a faucet to get test SOL

**Transaction failing silently?**
- Check console for detailed error
- Verify Paymaster URL in environment config

**Passkey prompt not appearing?**
- User may have already authenticated recently (session cached)
- Check for errors in console

---

## Next Steps

- [Tutorial 3: Session Persistence](./TUTORIAL-3-SESSION.md) - Stay logged in
- [Tutorial 1: Passkey Authentication](./TUTORIAL-1-PASSKEY.md) - Review basics
