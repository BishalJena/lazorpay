"use client";

/**
 * EXAMPLE 3: SESSION PERSISTENCE
 * Clean, minimal component for managing wallet sessions.
 */

import { useWallet } from "@lazorkit/wallet";
import { useEffect, useState } from "react";

export function SessionPersistExample() {
    const { isConnected, isConnecting, wallet, connect, disconnect } = useWallet();
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        checkSession();
    }, [isConnected]);

    const checkSession = () => {
        const found = Object.keys(localStorage).some(
            (key) => key.includes("lazor") || key.includes("wallet")
        );
        setHasSession(found);
    };

    const handleReconnect = async () => {
        try {
            await connect();
            checkSession();
        } catch (error) {
            console.error("Reconnection failed:", error);
        }
    };

    const handleClearSession = async () => {
        try {
            await disconnect();
            Object.keys(localStorage).forEach((key) => {
                if (key.includes("lazor") || key.includes("wallet")) {
                    localStorage.removeItem(key);
                }
            });
            checkSession();
        } catch (error) {
            console.error("Failed to clear session:", error);
        }
    };

    return (
        <div className="flex flex-col p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 text-sm">🔄</span>
                </div>
                <h3 className="font-semibold text-white">Session</h3>
            </div>

            {/* Status */}
            <div className="mb-4 p-3 bg-neutral-800/50 border border-neutral-700/50 rounded-xl">
                <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-neutral-500">Connected</span>
                    <span className={isConnected ? "text-emerald-400" : "text-neutral-500"}>
                        {isConnected ? "Yes" : "No"}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500">Session Stored</span>
                    <span className={hasSession ? "text-emerald-400" : "text-neutral-500"}>
                        {hasSession ? "Yes" : "No"}
                    </span>
                </div>
            </div>

            {/* Wallet info */}
            {isConnected && wallet && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <p className="text-xs font-medium text-emerald-400 mb-1">Wallet</p>
                    <code className="text-xs text-emerald-300/70 break-all font-mono">
                        {wallet.smartWallet.slice(0, 20)}...
                    </code>
                </div>
            )}

            {/* Actions */}
            <div className="flex-1 space-y-2">
                {!isConnected && (
                    <button
                        onClick={handleReconnect}
                        disabled={isConnecting}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 rounded-xl text-sm font-medium text-white transition-colors"
                    >
                        {isConnecting ? "Connecting..." : "Restore Session"}
                    </button>
                )}

                <button
                    onClick={handleClearSession}
                    className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl text-sm font-medium text-neutral-400 transition-colors"
                >
                    Clear Session
                </button>
            </div>

            {/* Footer tip */}
            <p className="mt-4 pt-4 border-t border-neutral-800 text-xs text-neutral-600">
                Sessions persist across browser restarts.
            </p>
        </div>
    );
}
