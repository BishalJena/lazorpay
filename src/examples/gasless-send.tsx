"use client";

/**
 * =============================================================================
 * GASLESS SOL TRANSFER EXAMPLE
 * =============================================================================
 * 
 * This component demonstrates how to:
 * 1. Build a Solana transfer instruction
 * 2. Send it via LazorKit with gas sponsorship (Paymaster)
 * 3. Handle success/error states
 * 
 * Key LazorKit SDK methods used:
 * - signAndSendTransaction({ instructions }) - Signs with passkey and sends via Paymaster
 * 
 * How Gasless Works:
 * The Paymaster (gas sponsor) pays the transaction fees on behalf of the user.
 * Users don't need SOL for gas - they only need the SOL they want to send.
 * 
 * @see https://docs.lazorkit.com/react-sdk/use-wallet#signandsendtransaction
 */

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function GaslessSendExample() {
    // =========================================================================
    // STEP 1: Get the signAndSendTransaction function from useWallet
    // =========================================================================
    // signAndSendTransaction is the main method for sending transactions.
    // It handles:
    // - Building the transaction with your instructions
    // - Signing with the user's passkey (biometric prompt)
    // - Submitting via the Paymaster (gas is sponsored)
    const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();

    const [amount, setAmount] = useState("0.001");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSend = async () => {
        if (!smartWalletPubkey) return;

        try {
            setStatus("sending");
            setErrorMsg(null);

            // =========================================================================
            // STEP 2: Create the transfer instruction
            // =========================================================================
            // This is standard Solana - create a SystemProgram.transfer instruction.
            // The `fromPubkey` is the user's smart wallet address.
            const demoRecipient = new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");

            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,  // User's smart wallet (sender)
                toPubkey: demoRecipient,         // Recipient address
                lamports: parseFloat(amount) * LAMPORTS_PER_SOL,  // Amount in lamports
            });

            // =========================================================================
            // STEP 3: Send the transaction via LazorKit
            // =========================================================================
            // Pass an array of instructions. LazorKit will:
            // 1. Build a transaction with these instructions
            // 2. Prompt user for biometric authentication (passkey signature)
            // 3. Submit to the Paymaster which pays gas and broadcasts to Solana
            // 4. Return the transaction signature
            await signAndSendTransaction({
                instructions: [instruction]
            });

            setStatus("success");
            setTimeout(() => setStatus("idle"), 3000);

        } catch (err) {
            console.error(err);
            setStatus("error");
            setErrorMsg(err instanceof Error ? err.message.slice(0, 50) : "Transaction failed");
            setTimeout(() => {
                setStatus("idle");
                setErrorMsg(null);
            }, 3000);
        }
    };

    return (
        <div className="w-full space-y-2">
            {/* Amount Input + Status Display */}
            <div className="h-10 flex gap-2">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={!isConnected}
                    className="w-20 h-full px-3 text-sm text-center rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                />
                <div className={`flex-1 h-full rounded-lg border flex items-center justify-center transition-colors ${status === "success" ? "bg-green-50 border-green-300"
                    : status === "error" ? "bg-red-50 border-red-300"
                        : "bg-gray-50 border-gray-200"
                    }`}>
                    <span className={`text-xs ${status === "success" ? "text-green-600"
                        : status === "error" ? "text-red-500"
                            : "text-gray-400"
                        }`}>
                        {status === "success" ? "✓ Transaction Sent!"
                            : status === "error" ? (errorMsg || "Failed")
                                : "SOL (0 gas)"}
                    </span>
                </div>
            </div>

            {/* Send Button */}
            <Button
                onClick={handleSend}
                loading={status === "sending"}
                disabled={!isConnected}
                fullWidth
                size="sm"
                variant="primary"
                className={
                    status === "success" ? "!bg-green-500"
                        : status === "error" ? "!bg-red-500"
                            : "!bg-gray-900 hover:!bg-black"
                }
            >
                {!isConnected ? "Connect First"
                    : status === "success" ? "✓ Sent!"
                        : status === "error" ? "Failed"
                            : status === "sending" ? "Sending..."
                                : "Send SOL"}
            </Button>
        </div>
    );
}
