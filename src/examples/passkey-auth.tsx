"use client";

/**
 * =============================================================================
 * PASSKEY AUTHENTICATION EXAMPLE
 * =============================================================================
 * 
 * This component demonstrates how to:
 * 1. Connect a wallet using biometric authentication (FaceID/TouchID)
 * 2. Display the wallet address with copy functionality
 * 3. Disconnect the wallet
 * 
 * Key LazorKit SDK methods used:
 * - connect() - Opens the passkey portal for authentication
 * - disconnect() - Clears the wallet session
 * - isConnected - Boolean indicating connection status
 * - smartWalletPubkey - The user's Solana wallet address (PublicKey)
 * 
 * @see https://docs.lazorkit.com/react-sdk/use-wallet
 */

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function PasskeyAuthExample() {
    // =========================================================================
    // STEP 1: Get wallet state and methods from useWallet hook
    // =========================================================================
    // The useWallet hook provides everything needed to manage wallet state:
    // - connect: Function to initiate passkey authentication
    // - disconnect: Function to clear the session
    // - isConnected: Whether a wallet is currently connected
    // - isConnecting: Loading state during authentication
    // - smartWalletPubkey: The user's wallet address (Solana PublicKey)
    const { connect, disconnect, isConnected, isConnecting, smartWalletPubkey } = useWallet();

    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // =========================================================================
    // STEP 2: Handle wallet connection
    // =========================================================================
    // When the user clicks "Create Wallet", we call connect().
    // This opens an iframe to the LazorKit portal where the user
    // authenticates using their device's biometric (FaceID/TouchID/Windows Hello).
    // The passkey is stored in the device's secure enclave - no seed phrase needed!
    const handleConnect = async () => {
        try {
            setError(null);
            // This triggers the passkey authentication flow
            await connect();
            // After successful connection, smartWalletPubkey will be available
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
        }
    };

    // =========================================================================
    // STEP 3: Copy wallet address to clipboard
    // =========================================================================
    // The smartWalletPubkey is a Solana PublicKey object.
    // Use .toBase58() to get the string representation (e.g., "xtixa9bb...")
    const handleCopy = () => {
        if (smartWalletPubkey) {
            navigator.clipboard.writeText(smartWalletPubkey.toBase58());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="w-full space-y-2">
            {/* Wallet Address Display - Click to copy */}
            <div
                className={`h-10 rounded-lg border flex items-center px-3 cursor-pointer transition-colors ${copied
                    ? "bg-green-50 border-green-300"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                onClick={isConnected ? handleCopy : undefined}
                title={isConnected ? "Click to copy full address" : ""}
            >
                {isConnected && smartWalletPubkey ? (
                    <div className="flex items-center justify-between w-full gap-2">
                        <span className="font-mono text-xs text-gray-600 truncate">
                            {copied ? "✓ Copied!" : `${smartWalletPubkey.toBase58().slice(0, 8)}...${smartWalletPubkey.toBase58().slice(-4)}`}
                        </span>
                        {!copied && (
                            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </div>
                ) : error ? (
                    <span className="text-xs text-red-500 truncate">{error}</span>
                ) : (
                    <span className="text-xs text-gray-400">No wallet connected</span>
                )}
            </div>

            {/* Connect/Disconnect Button */}
            <Button
                onClick={isConnected ? () => disconnect() : handleConnect}
                loading={isConnecting}
                fullWidth
                size="sm"
                variant={isConnected ? "ghost" : "primary"}
                className={isConnected ? "!text-red-500 hover:!bg-red-50" : ""}
            >
                {isConnecting ? "Connecting..." : isConnected ? "Disconnect" : "Create Wallet"}
            </Button>
        </div>
    );
}
