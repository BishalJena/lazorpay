"use client";

/**
 * ===========================================
 * EXAMPLE 1: PASSKEY AUTHENTICATION
 * ===========================================
 *
 * This example demonstrates how to:
 * 1. Create a new passkey-based wallet using biometrics
 * 2. Connect/login with an existing passkey
 * 3. Disconnect and manage wallet state
 *
 * KEY CONCEPTS:
 * - WebAuthn: Browser API for biometric authentication
 * - Passkey: A credential stored in your device's Secure Enclave
 * - Smart Wallet: A PDA (Program Derived Address) controlled by your passkey
 *
 * @see https://docs.lazorkit.com/react-sdk/use-wallet
 */

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";

/**
 * PasskeyAuthExample Component
 *
 * A complete example showing passkey wallet creation and authentication.
 * Users can create a new wallet or connect an existing one using biometrics.
 */
export function PasskeyAuthExample() {
    // ============================================
    // STEP 1: Get wallet state and functions
    // ============================================
    const {
        // Connection state
        isConnected,     // Whether user is currently connected
        isConnecting,    // Whether connection is in progress

        // Wallet information
        wallet,          // Full wallet object (contains smartWallet, credentialId, etc.)
        smartWalletPubkey, // The Solana public key of the smart wallet

        // Actions
        connect,         // Function to connect (triggers passkey prompt)
        disconnect,      // Function to disconnect
    } = useWallet();

    const [error, setError] = useState<string | null>(null);

    // ============================================
    // STEP 2: Handle Connect (Create or Login)
    // ============================================
    /**
     * Connects using passkey authentication
     *
     * HOW IT WORKS:
     * 1. Triggers browser's WebAuthn prompt (FaceID/TouchID/Windows Hello)
     * 2. If no passkey exists → Creates new wallet + passkey
     * 3. If passkey exists → Authenticates and connects
     * 4. Returns wallet address on success
     */
    const handleConnect = async () => {
        try {
            setError(null);
            await connect();
            // Success! Wallet is now connected
            // The `wallet` and `smartWalletPubkey` will be populated
        } catch (err) {
            setError(err instanceof Error ? err.message : "Connection failed");
            console.error("Passkey connection error:", err);
        }
    };

    // ============================================
    // STEP 3: Handle Disconnect
    // ============================================
    /**
     * Disconnects the current wallet session
     *
     * NOTE: This does NOT delete the passkey!
     * The user can reconnect using the same passkey later.
     */
    const handleDisconnect = async () => {
        try {
            setError(null);
            await disconnect();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Disconnect failed");
        }
    };

    // ============================================
    // STEP 4: Render UI based on connection state
    // ============================================
    return (
        <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-bold mb-4">🔐 Passkey Authentication</h2>

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Connected State */}
            {isConnected && wallet ? (
                <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-800 font-medium">✅ Connected!</p>
                        <p className="text-xs text-green-600 mt-1 font-mono break-all">
                            Wallet: {wallet.smartWallet}
                        </p>
                    </div>

                    <button
                        onClick={handleDisconnect}
                        className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded font-medium transition-colors"
                    >
                        Disconnect
                    </button>
                </div>
            ) : (
                /* Disconnected State */
                <div className="space-y-4">
                    <p className="text-gray-600 text-sm">
                        Connect using your device&apos;s biometric authentication (FaceID,
                        TouchID, or Windows Hello).
                    </p>

                    <button
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                    >
                        {isConnecting ? "Connecting..." : "Connect with Passkey"}
                    </button>
                </div>
            )}

            {/* Developer Info */}
            <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-gray-400">
                    💡 First time? This will create a new wallet. Returning? It will
                    reconnect your existing wallet.
                </p>
            </div>
        </div>
    );
}
