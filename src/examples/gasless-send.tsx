"use client";

/**
 * EXAMPLE 2: GASLESS TRANSACTIONS
 * Clean, minimal component for sending SOL without gas fees.
 */

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";

export function GaslessSendExample() {
    const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();

    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("0.001");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [txSignature, setTxSignature] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async () => {
        if (!smartWalletPubkey) return;
        if (!recipient) {
            setError("Enter recipient address");
            return;
        }

        try {
            setStatus("sending");
            setError(null);
            setTxSignature(null);

            const destinationPubkey = new PublicKey(recipient);
            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: destinationPubkey,
                lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
            });

            const signature = await signAndSendTransaction({
                instructions: [instruction],
            });

            setTxSignature(signature);
            setStatus("success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Transaction failed");
            setStatus("error");
        }
    };

    return (
        <div className="flex flex-col p-5 bg-neutral-900 border border-neutral-800 rounded-2xl">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-400 text-sm">💸</span>
                </div>
                <h3 className="font-semibold text-white">Gasless Send</h3>
            </div>

            {/* Content */}
            <div className="flex-1">
                {!isConnected ? (
                    <p className="text-sm text-neutral-500">Connect wallet first.</p>
                ) : (
                    <div className="space-y-3">
                        {/* Status messages */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <p className="text-xs text-red-400">{error}</p>
                            </div>
                        )}

                        {status === "success" && txSignature && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <p className="text-xs font-medium text-emerald-400 mb-1">Sent!</p>
                                <a
                                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-emerald-300/70 hover:text-emerald-300 underline"
                                >
                                    View on Explorer →
                                </a>
                            </div>
                        )}

                        {/* Form */}
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="Recipient address"
                            className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600"
                        />

                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0.001"
                            min="0"
                            placeholder="Amount (SOL)"
                            className="w-full px-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-600"
                        />

                        <button
                            onClick={handleSend}
                            disabled={status === "sending"}
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 rounded-xl text-sm font-medium text-white transition-colors"
                        >
                            {status === "sending" ? "Sending..." : "Send (Gasless)"}
                        </button>
                    </div>
                )}
            </div>

            {/* Footer tip */}
            <p className="mt-4 pt-4 border-t border-neutral-800 text-xs text-neutral-600">
                Gas fees sponsored by Paymaster. You pay nothing.
            </p>
        </div>
    );
}
