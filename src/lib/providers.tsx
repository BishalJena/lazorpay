"use client";

/**
 * LazorKit Provider Configuration
 *
 * This file sets up the LazorKit context for the entire application.
 * It handles:
 * - Passkey-based wallet authentication (WebAuthn)
 * - Gasless transaction support via Paymaster
 * - Session persistence across browser sessions
 *
 * @see https://docs.lazorkit.com/react-sdk/getting-started
 */

import { LazorkitProvider } from "@lazorkit/wallet";
import { ReactNode } from "react";

// Buffer polyfill for Next.js (required for Solana web3.js)
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || require("buffer").Buffer;
}

/**
 * LazorKit Configuration
 *
 * DEFAULT DEVNET CONFIG:
 * - RPC: Solana Devnet endpoint (with fallbacks)
 * - Portal: LazorKit passkey portal
 * - Paymaster: Gas sponsorship service
 * 
 * RPC FALLBACKS:
 * Solana's public Devnet can be unreliable. Consider using:
 * - Helius: https://devnet.helius-rpc.com/?api-key=YOUR_KEY
 * - QuickNode: Your dedicated endpoint
 */
const CONFIG = {
  // Solana RPC endpoint - Devnet for testing
  // Set NEXT_PUBLIC_RPC_URL in .env.local for a more reliable endpoint
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com",

  // LazorKit portal URL for passkey authentication
  PORTAL_URL:
    process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.lazor.sh",

  // Paymaster config for gasless transactions
  PAYMASTER: {
    paymasterUrl:
      process.env.NEXT_PUBLIC_PAYMASTER_URL ||
      "https://kora.devnet.lazorkit.com",
  },
};

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Application Providers Wrapper
 *
 * Wraps the entire app with necessary context providers:
 * 1. LazorkitProvider - Wallet, passkey, and transaction functionality
 *
 * USAGE:
 * Wrap your root layout with this component to enable
 * LazorKit features throughout your app.
 *
 * @example
 * // In layout.tsx
 * <Providers>{children}</Providers>
 */
export function Providers({ children }: ProvidersProps) {
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
