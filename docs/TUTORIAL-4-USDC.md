# Tutorial 4: USDC Transfer (SPL Tokens)

> Learn how to transfer USDC and other SPL tokens using LazorKit with gasless transactions.

## Overview

This tutorial covers:
1. Understanding SPL tokens vs native SOL
2. Working with Associated Token Accounts (ATAs)
3. Creating SPL transfer instructions
4. Sending gasless token transfers

---

## Prerequisites

- Completed [Tutorial 1: Passkey Authentication](./TUTORIAL-1-PASSKEY.md)
- Wallet connected via passkey

---

## Step 1: Install SPL Token Library

```bash
npm install @solana/spl-token
```

---

## Step 2: Understand Token Accounts

Unlike native SOL (stored directly in wallet), SPL tokens like USDC are stored in **Associated Token Accounts (ATAs)**.

```
Wallet (e.g., ABC123...)
  ├── Native SOL Balance
  └── Associated Token Accounts
      ├── USDC ATA → holds USDC
      ├── BONK ATA → holds BONK
      └── ... other tokens
```

Each token has a unique **mint address**:

```tsx
// USDC Mint Addresses
const USDC_DEVNET = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
const USDC_MAINNET = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
```

---

## Step 3: Get Associated Token Addresses

```tsx
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

// Get the sender's USDC account
const senderATA = getAssociatedTokenAddressSync(
  USDC_MINT,
  smartWalletPubkey,
  true // allowOwnerOffCurve - required for PDAs like smart wallets
);

// Get the recipient's USDC account
const recipientATA = getAssociatedTokenAddressSync(
  USDC_MINT,
  recipientPubkey
);
```

---

## Step 4: Create Transfer Instruction

```tsx
import { createTransferInstruction } from "@solana/spl-token";

// USDC has 6 decimals: 1 USDC = 1,000,000 micro-units
const amount = 1; // 1 USDC
const microUnits = amount * 1_000_000;

const instruction = createTransferInstruction(
  senderATA,         // From: sender's token account
  recipientATA,      // To: recipient's token account
  smartWalletPubkey, // Authority: who can authorize the transfer
  microUnits         // Amount in smallest units
);
```

---

## Step 5: Send Gasless Transaction

```tsx
const { signAndSendTransaction } = useWallet();

const handleTransfer = async () => {
  try {
    // This uses the Paymaster to cover gas fees
    const signature = await signAndSendTransaction({
      instructions: [instruction]
    });
    
    console.log("Transfer successful:", signature);
  } catch (error) {
    console.error("Transfer failed:", error);
  }
};
```

---

## Complete Component

```tsx
"use client";

import { useWallet } from "@lazorkit/wallet";
import { 
  createTransferInstruction, 
  getAssociatedTokenAddressSync 
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";

const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

export function UsdcTransfer() {
  const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("1");
  const [status, setStatus] = useState("idle");

  const handleTransfer = async () => {
    if (!smartWalletPubkey || !recipient) return;
    
    setStatus("sending");
    
    try {
      const recipientPubkey = new PublicKey(recipient);
      
      const senderATA = getAssociatedTokenAddressSync(
        USDC_MINT, smartWalletPubkey, true
      );
      
      const recipientATA = getAssociatedTokenAddressSync(
        USDC_MINT, recipientPubkey
      );
      
      const instruction = createTransferInstruction(
        senderATA,
        recipientATA,
        smartWalletPubkey,
        parseFloat(amount) * 1_000_000
      );
      
      await signAndSendTransaction({ instructions: [instruction] });
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  if (!isConnected) {
    return <p>Connect wallet first</p>;
  }

  return (
    <div>
      <input 
        placeholder="Recipient address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input 
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer} disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send USDC"}
      </button>
    </div>
  );
}
```

---

## Token Decimals Reference

| Token | Decimals | 1 Token = |
|-------|----------|-----------|
| USDC | 6 | 1,000,000 units |
| USDT | 6 | 1,000,000 units |
| SOL | 9 | 1,000,000,000 lamports |
| BONK | 5 | 100,000 units |

---

## Common Errors

**"Token account not found"**
- Recipient may not have a USDC account
- You may need to create the ATA first (advanced)

**"Insufficient funds"**
- Sender doesn't have enough USDC
- Check balance before transfer

**"Invalid owner"**
- Using wrong authority pubkey
- Ensure you're using `smartWalletPubkey`, not a different key

---

## Next Steps

- [Tutorial 1: Passkey Authentication](./TUTORIAL-1-PASSKEY.md)
- [Tutorial 2: Gasless SOL Transfer](./TUTORIAL-2-GASLESS.md)
- [Tutorial 3: Session Persistence](./TUTORIAL-3-SESSION.md)

---

## Resources

- [SPL Token Documentation](https://spl.solana.com/token)
- [USDC Developer Docs](https://developers.circle.com/)
