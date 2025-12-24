"use client";

/**
 * EXAMPLE 1: PASSKEY AUTHENTICATION
 * Clean, minimal component for passkey wallet creation and login.
 */

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";

export function PasskeyAuthExample() {
    const { connect, disconnect, isConnected, isConnecting, wallet } = useWallet();
    const [error, setError] = useState<string | null>(null);

    const handleConnect = async () => {
        try {
            setError(null);
            await connect();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Connection failed");
        }
    };

    const handleDisconnect = async () => {
        try {
            setError(null);
            await disconnect();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Disconnect failed");
        }
    };

    return (
        <div className="flex flex-col p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <span className="text-violet-400 text-sm">🔐</span>
                </div>
                <h3 className="font-semibold text-white">Passkey Auth</h3>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-xs text-red-400">{error}</p>
                </div>
            )}

            {/* Content */}
            <div className="flex-1">
                {isConnected && wallet ? (
                    <div className="space-y-4">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <p className="text-xs font-medium text-emerald-400 mb-1">Connected</p>
                            <code className="text-xs text-emerald-300/70 break-all font-mono">
                                {wallet.smartWallet}
                            </code>
                        </div>
                        <button
                            onClick={handleDisconnect}
                            className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-sm font-medium text-neutral-300 transition-colors"
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-neutral-500">
                            Connect using biometric authentication.
                        </p>
                        <button
                            onClick={handleConnect}
                            disabled={isConnecting}
                            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-600/50 rounded-xl text-sm font-medium text-white transition-colors"
                        >
                            {isConnecting ? "Connecting..." : "Connect with Passkey"}
                        </button>
                    </div>
                )}
            </div>

            {/* Footer tip */}
            <p className="mt-4 pt-4 border-t border-neutral-800 text-xs text-neutral-600">
                Creates a wallet using FaceID, TouchID, or Windows Hello.
            </p>
        </div>
    );
}
