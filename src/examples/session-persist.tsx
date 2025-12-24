"use client";

import { useWallet } from "@lazorkit/wallet";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Example: Session Persistence
 * 
 * LazorKit sessions are persisted in localStorage by default.
 * This component demonstrates how to check for an active session and handle restoration.
 * 
 * The `useWallet()` hood automatically attempts to restore the session on mount
 * if valid credentials exist in storage.
 */
export function SessionPersistExample() {
    const { isConnected, isConnecting, connect, disconnect } = useWallet();
    const [hasSession, setHasSession] = useState(false);

    // Monitor localStorage for LazorKit keys to visually indicate session state
    useEffect(() => {
        const check = () => setHasSession(Object.keys(localStorage).some(k => k.includes("lazor")));
        check();
        window.addEventListener("storage", check);
        return () => window.removeEventListener("storage", check);
    }, [isConnected]);

    const handleClear = async () => {
        try {
            await disconnect(); // This clears the SDK state
            // Explicitly clear storage for demo purposes
            Object.keys(localStorage).forEach(k => k.includes("lazor") && localStorage.removeItem(k));
            setHasSession(false);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="w-full flex gap-3">
            <div className={`h-11 px-4 rounded-full flex items-center justify-center flex-1 text-sm font-medium border ${hasSession ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
                {hasSession ? "✓ Session Saved" : "No Session"}
            </div>

            {!isConnected ? (
                <Button
                    onClick={() => connect()}
                    disabled={isConnecting}
                    variant="secondary"
                    className="flex-1"
                >
                    Restore
                </Button>
            ) : (
                <Button
                    onClick={handleClear}
                    variant="ghost"
                    className="flex-1"
                >
                    Clear
                </Button>
            )}
        </div>
    );
}
