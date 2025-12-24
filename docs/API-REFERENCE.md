# API Reference

> Complete reference for the LazorKit SDK methods used in this template.

## `LazorkitProvider`

Root provider component that initializes the SDK.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `rpcUrl` | `string` | ✅ | Solana RPC endpoint URL |
| `portalUrl` | `string` | ✅ | WebAuthn portal URL |
| `paymasterConfig` | `object` | ❌ | Paymaster configuration |

### Usage

```tsx
import { LazorkitProvider } from "@lazorkit/wallet";

<LazorkitProvider
  rpcUrl="https://api.devnet.solana.com"
  portalUrl="https://portal.lazor.sh"
  paymasterConfig={{
    paymasterUrl: "https://kora.devnet.lazorkit.com"
  }}
>
  {children}
</LazorkitProvider>
```

---

## `useWallet()`

React hook for all wallet operations.

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `isConnected` | `boolean` | `true` if user has an active session |
| `isConnecting` | `boolean` | `true` during authentication flow |
| `wallet` | `Wallet \| null` | Wallet metadata object |
| `smartWalletPubkey` | `PublicKey \| null` | User's on-chain address |

### Methods

#### `connect()`
Triggers the passkey authentication flow.

```tsx
const { connect } = useWallet();

const handleConnect = async () => {
  try {
    await connect();
    console.log("Connected!");
  } catch (error) {
    console.error("Connection failed:", error);
  }
};
```

#### `disconnect()`
Clears the current session.

```tsx
const { disconnect } = useWallet();

disconnect(); // Immediately disconnects
```

#### `signAndSendTransaction({ instructions })`
Signs and submits a transaction with optional Paymaster gas sponsorship.

```tsx
const { signAndSendTransaction, smartWalletPubkey } = useWallet();

const tx = await signAndSendTransaction({
  instructions: [
    SystemProgram.transfer({
      fromPubkey: smartWalletPubkey!,
      toPubkey: recipientPubkey,
      lamports: 1000000,
    }),
  ],
});

console.log("Signature:", tx);
```

---

## `Wallet` Object

Returned by `useWallet().wallet`.

| Property | Type | Description |
|----------|------|-------------|
| `smartWallet` | `string` | Base58 encoded wallet address |
| `credentialId` | `string` | WebAuthn credential identifier |
| `publicKey` | `Uint8Array` | Raw public key bytes |

---

## Error Handling

Common errors and how to handle them:

| Error | Cause | Solution |
|-------|-------|----------|
| `UserCancelledError` | User dismissed passkey prompt | Show retry button |
| `NotAllowedError` | Browser blocked WebAuthn | Check HTTPS/localhost |
| `NetworkError` | RPC/Paymaster unreachable | Retry with backoff |
| `InsufficientFundsError` | Wallet lacks SOL | Paymaster should cover gas |

```tsx
try {
  await connect();
} catch (error) {
  if (error.name === "UserCancelledError") {
    // User dismissed, show gentle prompt
  } else if (error.name === "NotAllowedError") {
    // Browser issue
  } else {
    // Generic error
  }
}
```
