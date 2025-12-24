"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Gasless SOL Transfer Example - With success/error feedback
 */
export function GaslessSendExample() {
    const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();
    const [amount, setAmount] = useState("0.001");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSend = async () => {
        if (!smartWalletPubkey) return;
        try {
            setStatus("sending");
            setErrorMsg(null);
            // Demo recipient - sends to a random valid address
            const demoKey = new PublicKey("9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM");
            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: demoKey,
                lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
            });
            await signAndSendTransaction({ instructions: [instruction] });
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
            {/* Row 1: Input + Status area */}
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

            {/* Row 2: Action button */}
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

