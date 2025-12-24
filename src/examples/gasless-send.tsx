"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * Example: Gasless Transactions (Paymaster)
 * 
 * This component sends a Solana transaction where the gas fees are paid
 * by LazorKit's Paymaster service, not the user. Zero SOL required!
 * 
 * Key Concepts:
 * - `smartWalletPubkey`: The on-chain address of the user's smart wallet.
 * - `signAndSendTransaction`: Handles Paymaster signing + user passkey signing.
 * - The Paymaster URL is configured in the LazorkitProvider.
 */
export function GaslessSendExample() {
    // smartWalletPubkey = user's actual on-chain address
    const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();
    const [amount, setAmount] = useState("0.001");
    const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

    const handleSend = async () => {
        if (!smartWalletPubkey) return;
        try {
            setStatus("sending");

            // Step A: Create a standard Solana transfer instruction
            // Note: Use `smartWalletPubkey` as sender (NOT the passkey signer address)
            const demoKey = new PublicKey("GgM5j8jG5z3b2v5z5z5z5z5z5z5z5z5z5z5z5z5z5z5");
            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: demoKey,
                lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
            });

            // Step B: Send via LazorKit SDK
            // Under the hood this: 
            // 1. Requests partial signature from Paymaster (gas sponsor)
            // 2. Prompts user for passkey signature
            // 3. Submits the final transaction to Solana
            await signAndSendTransaction({ instructions: [instruction] });

            setStatus("success");
            setTimeout(() => setStatus("idle"), 3000);
        } catch (err) {
            console.error(err);
            setStatus("idle");
        }
    };

    return (
        <div className="w-full">
            {!isConnected ? (
                <div className="h-12 flex items-center justify-center border border-dashed border-gray-300 rounded-xl text-gray-400 text-sm bg-gray-50">
                    Wallet Required
                </div>
            ) : (
                <div className="flex gap-4">
                    <div className="w-24">
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-center font-mono"
                        />
                    </div>
                    <Button
                        onClick={handleSend}
                        loading={status === "sending"}
                        fullWidth
                        variant={status === "success" ? "secondary" : "secondary"}
                        className={status === "success" ? "!bg-green-50 !text-green-600 !border-green-200" : "!bg-gray-900 !text-white hover:!bg-black"}
                    >
                        {status === "success" ? "✓ Sent!" : "Send (0 Gas)"}
                    </Button>
                </div>
            )}
        </div>
    );
}
