"use client";

/**
 * ===========================================
 * EXAMPLE 3: SESSION PERSISTENCE
 * ===========================================
 *
 * This example demonstrates how to:
 * 1. Persist wallet sessions across browser refreshes
 * 2. Auto-reconnect returning users
 * 3. Manage session state and expiry
 *
 * KEY CONCEPTS:
 * - Session: A temporary authentication state stored locally
 * - Auto-reconnect: Checks for existing session on page load
 * - Session expiry: Sessions have a limited lifetime for security
 *
 * @see https://docs.lazorkit.com/react-sdk/use-wallet
 */

import { useWallet } from "@lazorkit/wallet";
import { useEffect, useState } from "react";

/**
 * SessionPersistExample Component
 *
 * Demonstrates session management for a seamless user experience.
 * Users stay logged in across browser sessions without re-authenticating.
 */
export function SessionPersistExample() {
    // ============================================
    // STEP 1: Get wallet and session state
    // ============================================
    const {
        isConnected,
        isConnecting,
        wallet,
        connect,
        disconnect,
    } = useWallet();

    const [sessionInfo, setSessionInfo] = useState<{
        hasStoredSession: boolean;
        sessionAge: string | null;
    }>({
        hasStoredSession: false,
        sessionAge: null,
    });

    // ============================================
    // STEP 2: Check for existing session on mount
    // ============================================
    /**
     * Auto-reconnect Logic
     *
     * HOW IT WORKS:
     * 1. On component mount, check localStorage for saved session
     * 2. LazorKit automatically handles session restoration
     * 3. If session exists and is valid, user is auto-connected
     *
     * SESSION STORAGE:
     * LazorKit stores session data in localStorage under specific keys.
     * This includes the credential ID and session tokens.
     */
    useEffect(() => {
        checkStoredSession();
    }, []);

    /**
     * Checks if there's a stored session in localStorage
     */
    const checkStoredSession = () => {
        try {
            // LazorKit stores session data - we check if it exists
            // The actual keys may vary - this is for demonstration
            const hasSession = localStorage.getItem("lazorkit-session") !== null ||
                localStorage.getItem("lazorkit-wallet") !== null;

            // Calculate session age if stored timestamp exists
            const storedTimestamp = localStorage.getItem("lazorkit-session-time");
            let sessionAge = null;

            if (storedTimestamp) {
                const ageMs = Date.now() - parseInt(storedTimestamp);
                const ageMinutes = Math.floor(ageMs / 60000);
                sessionAge = ageMinutes < 60
                    ? `${ageMinutes} minutes ago`
                    : `${Math.floor(ageMinutes / 60)} hours ago`;
            }

            setSessionInfo({
                hasStoredSession: hasSession,
                sessionAge,
            });
        } catch {
            // localStorage might not be available
            setSessionInfo({ hasStoredSession: false, sessionAge: null });
        }
    };

    // ============================================
    // STEP 3: Handle Manual Reconnect
    // ============================================
    /**
     * Attempts to reconnect using stored session
     *
     * HOW IT WORKS:
     * 1. LazorKit checks for valid stored credentials
     * 2. If found, prompts for biometric verification
     * 3. On success, restores the wallet connection
     *
     * NOTE: This is automatic if you have auto-connect enabled,
     * but we show it manually here for educational purposes.
     */
    const handleReconnect = async () => {
        try {
            await connect();
            // Update session timestamp
            localStorage.setItem("lazorkit-session-time", Date.now().toString());
            checkStoredSession();
        } catch (error) {
            console.error("Reconnection failed:", error);
        }
    };

    // ============================================
    // STEP 4: Handle Clear Session
    // ============================================
    /**
     * Clears all stored session data
     *
     * USE CASE:
     * - User wants to switch wallets
     * - Security: clearing session on shared device
     * - Debugging: start fresh
     */
    const handleClearSession = async () => {
        try {
            // Disconnect the wallet
            await disconnect();

            // Clear any stored session data
            // Note: LazorKit may use different keys - adjust as needed
            localStorage.removeItem("lazorkit-session");
            localStorage.removeItem("lazorkit-wallet");
            localStorage.removeItem("lazorkit-session-time");

            checkStoredSession();
        } catch (error) {
            console.error("Failed to clear session:", error);
        }
    };

    // ============================================
    // STEP 5: Render UI
    // ============================================
    return (
        <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-bold mb-4">🔄 Session Persistence</h2>

            {/* Current Status */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Session Status</h3>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Connected:</span>
                        <span className={isConnected ? "text-green-600" : "text-red-600"}>
                            {isConnected ? "Yes ✅" : "No ❌"}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Stored Session:</span>
                        <span className={sessionInfo.hasStoredSession ? "text-green-600" : "text-gray-400"}>
                            {sessionInfo.hasStoredSession ? "Found ✅" : "None"}
                        </span>
                    </div>
                    {sessionInfo.sessionAge && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Last Used:</span>
                            <span className="text-gray-600">{sessionInfo.sessionAge}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Connected Wallet Info */}
            {isConnected && wallet && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-800 font-medium">Wallet Connected</p>
                    <p className="text-xs text-green-600 mt-1 font-mono break-all">
                        {wallet.smartWallet}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
                {!isConnected && (
                    <button
                        onClick={handleReconnect}
                        disabled={isConnecting}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                    >
                        {isConnecting ? "Connecting..." : "Connect / Restore Session"}
                    </button>
                )}

                <button
                    onClick={handleClearSession}
                    className="w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors"
                >
                    Clear Session & Disconnect
                </button>

                <button
                    onClick={checkStoredSession}
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                    Check Session Status
                </button>
            </div>

            {/* Developer Info */}
            <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-gray-400">
                    💡 Sessions are stored locally. Close this tab, reopen it, and your
                    wallet will still be connected!
                </p>
            </div>
        </div>
    );
}
