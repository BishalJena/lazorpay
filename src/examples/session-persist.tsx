"use client";

import { useWallet } from "@lazorkit/wallet";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Session Persistence Example - Standardized layout
 */
export function SessionPersistExample() {
    const { isConnected, isConnecting, connect, disconnect } = useWallet();
    const [hasSession, setHasSession] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    useEffect(() => {
        const check = () => setHasSession(Object.keys(localStorage).some(k => k.includes("lazor")));
        check();
        const interval = setInterval(check, 500);
        return () => clearInterval(interval);
    }, [isConnected]);

    const handleClear = async () => {
        try {
            setIsClearing(true);
            await disconnect();
            Object.keys(localStorage).forEach(k => k.includes("lazor") && localStorage.removeItem(k));
            setHasSession(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="w-full space-y-2">
            {/* Row 1: Status area - fixed height */}
            <div
                className={`h-10 rounded-lg border flex items-center justify-center gap-2 text-xs font-medium ${hasSession
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-gray-50 border-gray-200 text-gray-500"
                    }`}
            >
                <span className={`w-1.5 h-1.5 rounded-full ${hasSession ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                {hasSession ? "Session Active" : "No Session"}
            </div>

            {/* Row 2: Action button - fixed height */}
            {isConnected ? (
                <Button
                    onClick={handleClear}
                    loading={isClearing}
                    fullWidth
                    size="sm"
                    variant="ghost"
                    className="!text-red-500 hover:!bg-red-50"
                >
                    {isClearing ? "Clearing..." : "Clear Session"}
                </Button>
            ) : (
                <Button
                    onClick={() => connect()}
                    loading={isConnecting}
                    disabled={!hasSession}
                    fullWidth
                    size="sm"
                    variant="secondary"
                >
                    {isConnecting ? "Restoring..." : hasSession ? "Restore Session" : "No Session"}
                </Button>
            )}
        </div>
    );
}
