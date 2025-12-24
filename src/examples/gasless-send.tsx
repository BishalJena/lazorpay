"use client";

/**
 * ===========================================
 * EXAMPLE 2: GASLESS TRANSACTIONS
 * ===========================================
 *
 * This example demonstrates how to:
 * 1. Send SOL without the user paying gas fees
 * 2. Use the Paymaster for gas sponsorship
 * 3. Sign transactions with passkey biometrics
 *
 * KEY CONCEPTS:
 * - Paymaster: A service that pays gas fees on behalf of users
 * - Gasless: Users don't need SOL to make transactions
 * - Smart Wallet: Transactions are signed using passkey, not private keys
 *
 * @see https://docs.lazorkit.com/react-sdk/use-wallet
 */

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

/**
 * GaslessSendExample Component
 *
 * Demonstrates sending SOL with gas fees sponsored by the Paymaster.
 * Users can send funds without holding any SOL for transaction fees.
 */
export function GaslessSendExample() {
    // ============================================
    // STEP 1: Get wallet state and transaction function
    // ============================================
    const {
        isConnected,
        smartWalletPubkey,    // User's wallet public key
        signAndSendTransaction, // Function to sign and broadcast transaction
    } = useWallet();

    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("0.001");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // ============================================
    // STEP 2: Handle Gasless Transfer
    // ============================================
    /**
     * Sends SOL using a gasless transaction
     *
     * HOW IT WORKS:
     * 1. Create a transfer instruction (from smart wallet → recipient)
     * 2. Call signAndSendTransaction with the instruction
     * 3. LazorKit handles:
     *    - Prompting for passkey signature
     *    - Sending to Paymaster for gas sponsorship
     *    - Broadcasting to Solana network
     * 4. Returns transaction signature on success
     *
     * GAS SPONSORSHIP:
     * The Paymaster pays the ~0.000005 SOL transaction fee
     * so users can transact even with zero SOL balance!
     */
    const handleSend = async () => {
        // Validation
        if (!smartWalletPubkey) {
            setError("Please connect your wallet first");
            return;
        }

        if (!recipient) {
            setError("Please enter a recipient address");
            return;
        }

        try {
            setStatus("sending");
            setError(null);
            setTxSignature(null);

            // ----------------------------------------
            // STEP 2a: Validate recipient address
            // ----------------------------------------
            let destinationPubkey: PublicKey;
            try {
                destinationPubkey = new PublicKey(recipient);
            } catch {
                throw new Error("Invalid Solana address");
            }

            // ----------------------------------------
            // STEP 2b: Create transfer instruction
            // ----------------------------------------
            /**
             * SystemProgram.transfer creates a native SOL transfer
             *
             * IMPORTANT: fromPubkey must be the smartWalletPubkey
             * This is the PDA controlled by your passkey
             */
            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: destinationPubkey,
                lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
            });

            // ----------------------------------------
            // STEP 2c: Sign and send with paymaster
            // ----------------------------------------
            /**
             * signAndSendTransaction handles:
             * 1. Prompting for passkey authentication
             * 2. Signing the transaction
             * 3. Submitting to Paymaster for gas sponsorship
             * 4. Broadcasting to Solana network
             *
             * The `feeToken` option specifies what token to use for fees
             * - 'USDC': Pay fees in USDC (if you have USDC)
             * - undefined: Use Paymaster sponsorship (gasless)
             */
            const signature = await signAndSendTransaction({
                instructions: [instruction],
                // Uncomment below to pay gas in USDC instead of using Paymaster
                // transactionOptions: { feeToken: 'USDC' }
            });

            setTxSignature(signature);
            setStatus("success");
            console.log("✅ Transaction confirmed:", signature);

        } catch (err) {
            setError(err instanceof Error ? err.message : "Transaction failed");
            setStatus("error");
            console.error("Transaction error:", err);
        }
    };

    // ============================================
    // STEP 3: Render UI
    // ============================================

    // Not connected state
    if (!isConnected) {
        return (
            <div className="p-6 border rounded-lg bg-gray-50">
                <h2 className="text-xl font-bold mb-4">💸 Gasless Transfer</h2>
                <p className="text-gray-500">Please connect your wallet first.</p>
            </div>
        );
    }

    return (
        <div className="p-6 border rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-bold mb-4">💸 Gasless Transfer</h2>

            {/* Status Messages */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            {status === "success" && txSignature && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
                    <p className="text-green-800 font-medium text-sm">✅ Transaction sent!</p>
                    <a
                        href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-green-600 underline break-all"
                    >
                        View on Explorer →
                    </a>
                </div>
            )}

            {/* Transfer Form */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recipient Address
                    </label>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Enter Solana address..."
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (SOL)
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        step="0.001"
                        min="0"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                </div>

                <button
                    onClick={handleSend}
                    disabled={status === "sending"}
                    className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors"
                >
                    {status === "sending" ? "Sending..." : "Send (Gasless)"}
                </button>
            </div>

            {/* Developer Info */}
            <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-gray-400">
                    💡 Gas fees are paid by the Paymaster. You don&apos;t need SOL to send
                    this transaction!
                </p>
            </div>
        </div>
    );
}
