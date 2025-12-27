# Troubleshooting Guide

Common issues and solutions when working with LazorPay and LazorKit SDK.

---

## 🔐 WebAuthn / Passkey Issues

### "Signing failed" or "origins don't match"

**Cause:** WebAuthn requires HTTPS for passkey signing. HTTP won't work.

**Solution:** Use the HTTPS development server:
```bash
# Generate local certificates (one-time setup)
brew install mkcert
mkcert -install
mkdir -p certs && cd certs && mkcert localhost 127.0.0.1 ::1

# Run with HTTPS
npm run dev:https
```

Then open `https://localhost:3000` (not `http://`).

---

### "Transaction too large"

**Cause:** The passkey signature + smart wallet wrapper can exceed Solana's 1232-byte limit.

**Solution:**
1. Clear your session and reconnect
2. Try with a smaller transaction
3. If persistent, this is a known LazorKit limitation

---

## 💰 Transaction Issues

### "Insufficient funds" / "Custom:1"

**Cause:** Your wallet doesn't have enough tokens to send.

**Solution:**
1. Check your balance: Copy your wallet address and check on [Solana Explorer](https://explorer.solana.com/?cluster=devnet)
2. For SOL: `curl https://api.devnet.solana.com -X POST -d '{"jsonrpc":"2.0","id":1,"method":"requestAirdrop","params":["YOUR_ADDRESS",2000000000]}'`
3. For USDC: Use [Circle Faucet](https://faucet.circle.com/) → Solana → Devnet

---

### "Invalid account data"

**Cause:** Token account (ATA) doesn't exist or has no balance.

**Solution:** 
- For USDC, the sender must have an existing token account with balance
- The code automatically creates recipient ATAs

---

## 🔧 Development Issues

### "Unable to acquire lock"

**Cause:** Another Next.js dev server is running.

**Solution:**
```bash
pkill -f "next" && rm -rf .next/dev/lock
npm run dev:https
```

---

### Session won't clear

**Cause:** The wallet state wasn't fully cleared from localStorage.

**Solution:** Open DevTools → Application → Local Storage → Delete `lazorkit-wallet-store`

---

## 🌐 Network Issues

### "Failed to fetch" or RPC errors

**Cause:** Solana Devnet can be unreliable.

**Solution:** Use a dedicated RPC endpoint:
1. Get free endpoint from [Helius](https://helius.dev/) or [QuickNode](https://quicknode.com/)
2. Update `.env.local`:
```env
NEXT_PUBLIC_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY
```

---

## Need More Help?

- [LazorKit Docs](https://docs.lazorkit.com/)
- [LazorKit Telegram](https://t.me/lazorkit)
- [Open an Issue](https://github.com/BishalJena/lazorpay/issues)
