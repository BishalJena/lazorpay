"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Biometric Auth Example - With copy address functionality
 */
export function PasskeyAuthExample() {
    const { connect, disconnect, isConnected, isConnecting, smartWalletPubkey } = useWallet();
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleConnect = async () => {
        try {
            setError(null);
            await connect();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed");
        }
    };

    const handleCopy = () => {
        if (smartWalletPubkey) {
            navigator.clipboard.writeText(smartWalletPubkey.toBase58());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="w-full space-y-2">
            {/* Row 1: Wallet Address with Copy Button */}
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

            {/* Row 2: Action button */}
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

