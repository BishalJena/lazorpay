"use client";

/**
 * =============================================================================
 * SESSION PERSISTENCE EXAMPLE
 * =============================================================================
 * 
 * This component demonstrates how to:
 * 1. Detect if a previous session exists in localStorage
 * 2. Restore a session without re-authenticating
 * 3. Clear session data
 * 
 * How Session Persistence Works:
 * When a user connects their wallet, LazorKit stores session data in localStorage.
 * This allows users to return to your app without re-authenticating every time.
 * The session is cryptographically bound to the device's passkey.
 * 
 * Key Insight:
 * - connect() will auto-restore if session data exists
 * - disconnect() clears the session from memory (but not localStorage)
 * - To fully clear, remove lazor-prefixed keys from localStorage
 * 
 * @see https://docs.lazorkit.com/react-sdk/getting-started
 */

import { useWallet } from "@lazorkit/wallet";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function SessionPersistExample() {
    // =========================================================================
    // STEP 1: Get wallet state from useWallet
    // =========================================================================
    const { isConnected, isConnecting, connect, disconnect } = useWallet();

    const [hasSession, setHasSession] = useState(false);
    const [isClearing, setIsClearing] = useState(false);

    // =========================================================================
    // STEP 2: Check localStorage for existing session
    // =========================================================================
    // LazorKit stores session data in 'lazorkit-wallet-store'.
    // We need to check if the wallet field is actually set (not null).
    useEffect(() => {
        const checkForSession = () => {
            try {
                const store = localStorage.getItem("lazorkit-wallet-store");
                if (store) {
                    const parsed = JSON.parse(store);
                    // Session exists only if wallet is not null
                    setHasSession(parsed?.state?.wallet !== null);
                } else {
                    setHasSession(false);
                }
            } catch {
                setHasSession(false);
            }
        };

        checkForSession();
        // Poll every 500ms to catch changes
        const interval = setInterval(checkForSession, 500);
        return () => clearInterval(interval);
    }, [isConnected]);

    // =========================================================================
    // STEP 3: Clear session completely
    // =========================================================================
    // To fully sign out a user, we need to:
    // 1. Remove all lazor-prefixed keys from localStorage
    // 2. Call disconnect() to clear in-memory state (if connected)
    const handleClear = async () => {
        try {
            setIsClearing(true);

            // Clear all LazorKit data from localStorage FIRST
            Object.keys(localStorage).forEach(key => {
                if (key.includes("lazor")) {
                    localStorage.removeItem(key);
                }
            });

            // Try to disconnect (may fail if not connected, that's OK)
            try {
                await disconnect();
            } catch {
                // Ignore disconnect errors - we already cleared localStorage
            }

            setHasSession(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="w-full space-y-2">
            {/* Session Status Indicator */}
            <div
                className={`h-10 rounded-lg border flex items-center justify-center gap-2 text-xs font-medium ${hasSession
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-gray-50 border-gray-200 text-gray-500"
                    }`}
            >
                <span className={`w-1.5 h-1.5 rounded-full ${hasSession ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
                {hasSession ? "Session Active" : "No Session"}
            </div>

            {/* Restore/Clear Session Buttons */}
            {isConnected ? (
                // When connected: show Clear button
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
            ) : hasSession ? (
                // When not connected but session exists: show both Restore and Clear
                <div className="flex gap-2">
                    <Button
                        onClick={() => connect()}
                        loading={isConnecting}
                        fullWidth
                        size="sm"
                        variant="secondary"
                    >
                        {isConnecting ? "Restoring..." : "Restore"}
                    </Button>
                    <Button
                        onClick={handleClear}
                        loading={isClearing}
                        fullWidth
                        size="sm"
                        variant="ghost"
                        className="!text-red-500 hover:!bg-red-50"
                    >
                        {isClearing ? "Clearing..." : "Clear"}
                    </Button>
                </div>
            ) : (
                // When no session: show disabled button
                <Button
                    disabled
                    fullWidth
                    size="sm"
                    variant="secondary"
                >
                    No Session
                </Button>
            )}
        </div>
    );
}
