# Architecture Overview

> Technical deep-dive into how LazorPay integrates with the LazorKit SDK.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐   │
│   │  Next.js    │───▶│  LazorKit    │───▶│  Secure Enclave │   │
│   │  Frontend   │    │  SDK         │    │  (FaceID/Touch) │   │
│   └─────────────┘    └──────────────┘    └─────────────────┘   │
│          │                  │                                   │
│          │                  ▼                                   │
│          │         ┌──────────────┐                             │
│          │         │  Portal      │  (portal.lazor.sh)          │
│          │         │  WebAuthn    │                             │
│          │         └──────────────┘                             │
│          │                  │                                   │
└──────────│──────────────────│───────────────────────────────────┘
           │                  │
           ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Solana Blockchain                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────┐         ┌─────────────────────────────┐  │
│   │   Paymaster     │         │   Smart Wallet (PDA)        │  │
│   │   (Gas Sponsor) │────────▶│   Derived from Passkey      │  │
│   └─────────────────┘         └─────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. LazorkitProvider
The root provider that initializes the SDK and manages wallet state.

```tsx
// Configuration options
interface LazorkitConfig {
  rpcUrl: string;        // Solana RPC endpoint
  portalUrl: string;     // WebAuthn portal
  paymasterConfig: {
    paymasterUrl: string; // Gas sponsorship endpoint
  };
}
```

### 2. useWallet Hook
React hook that exposes all wallet functionality:

| Property | Type | Description |
|----------|------|-------------|
| `isConnected` | `boolean` | Whether user is authenticated |
| `isConnecting` | `boolean` | Loading state during auth |
| `wallet` | `Wallet | null` | Wallet metadata |
| `smartWalletPubkey` | `PublicKey | null` | On-chain address |
| `connect()` | `async function` | Trigger passkey auth |
| `disconnect()` | `function` | Clear session |
| `signAndSendTransaction()` | `async function` | Sign + submit tx |

### 3. Smart Wallet PDA
The user's wallet address is a **Program Derived Address (PDA)** derived from their passkey credential:

```
Smart Wallet = PDA(
  seeds: [credential_public_key, program_id],
  bump: u8
)
```

This means:
- Same passkey → Same wallet address (deterministic)
- Wallet exists without on-chain setup (lazy initialization)
- User controls the PDA via passkey signatures

### 4. Paymaster Flow
How gasless transactions work:

```
1. User creates transaction (e.g., transfer SOL)
2. SDK sends tx to Paymaster API
3. Paymaster signs a partial signature (covering gas)
4. SDK prompts user for passkey signature
5. SDK combines both signatures
6. Final tx submitted to Solana
7. Paymaster's SOL covers the fee
8. User's SOL is transferred (if applicable)
```

## Data Flow

### Authentication Flow
```
User Click → SDK.connect() → Portal Opens → Biometric Prompt → 
→ Credential Created → PDA Derived → Session Stored → Connected!
```

### Transaction Flow
```
User Action → Create Instruction → signAndSendTransaction() → 
→ Paymaster Signs (gas) → Passkey Signs (authorization) →
→ Combined Tx → RPC Submission → Confirmation
```

## Security Model

| Layer | Protection |
|-------|------------|
| **Device** | Private key in Secure Enclave (never extractable) |
| **Browser** | WebAuthn attestation (phishing-resistant) |
| **Session** | Encrypted credential in localStorage |
| **Blockchain** | PDA ownership verification |

## File Reference

| File | Purpose |
|------|---------|
| `src/lib/providers.tsx` | SDK initialization |
| `src/examples/passkey-auth.tsx` | Auth implementation |
| `src/examples/gasless-send.tsx` | Transaction implementation |
| `src/examples/session-persist.tsx` | Session management |
