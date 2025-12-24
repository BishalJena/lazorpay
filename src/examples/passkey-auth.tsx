"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Biometric Auth Example - Standardized layout
 */
export function PasskeyAuthExample() {
    const { connect, disconnect, isConnected, isConnecting, smartWalletPubkey } = useWallet();
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async () => {
        try {
            setError(null);
            await connect();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
        }
    };

    return (
        <div className="w-full space-y-2">
            {/* Row 1: Status/Input area - fixed height */}
            <div className="h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center px-3">
                {isConnected && smartWalletPubkey ? (
                    <span className="font-mono text-xs text-gray-600 truncate">
                        {smartWalletPubkey.toBase58().slice(0, 8)}...{smartWalletPubkey.toBase58().slice(-4)}
                    </span>
                ) : error ? (
                    <span className="text-xs text-red-500 truncate">{error}</span>
                ) : (
                    <span className="text-xs text-gray-400">No wallet connected</span>
                )}
            </div>

            {/* Row 2: Action button - fixed height */}
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
