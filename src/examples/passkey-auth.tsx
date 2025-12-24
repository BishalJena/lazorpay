"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Example: Passkey Authentication
 * 
 * This component demonstrates how to create and connect a smart wallet
 * using biometrics (FaceID/TouchID). It uses the `useWallet` hook from
 * `@lazorkit/wallet` which handles the entire WebAuthn handshake.
 * 
 * Key Concepts:
 * - `connect()`: Triggers the browser's native passkey prompt.
 * - `disconnect()`: Clears the current session.
 * - `isConnecting`: Loading state while passkey prompt is active.
 * - `isConnected`: True after successful authentication.
 */
export function PasskeyAuthExample() {
    // Step 1: Get wallet controls from the LazorKit SDK
    const { connect, disconnect, isConnected, isConnecting } = useWallet();
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async () => {
        try {
            setError(null);
            // Step 2: This triggers the browser's native passkey prompt
            // If user doesn't have a passkey, it will prompt to create one.
            await connect();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Connection failed");
        }
    };

    return (
        <div className="w-full space-y-4">
            {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {error}
                </div>
            )}

            {isConnected ? (
                <Button
                    variant="danger"
                    fullWidth
                    onClick={() => disconnect()}
                >
                    Disconnect Wallet
                </Button>
            ) : (
                <Button
                    variant="primary"
                    fullWidth
                    loading={isConnecting}
                    onClick={handleConnect}
                >
                    Create Passkey Wallet
                </Button>
            )}
        </div>
    );
}
