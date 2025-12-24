"use client";

import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Gasless SOL Transfer Example - Standardized layout
 */
export function GaslessSendExample() {
    const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();
    const [amount, setAmount] = useState("0.001");
    const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

    const handleSend = async () => {
        if (!smartWalletPubkey) return;
        try {
            setStatus("sending");
            const demoKey = new PublicKey("GgM5j8jG5z3b2v5z5z5z5z5z5z5z5z5z5z5z5z5z5z5");
            const instruction = SystemProgram.transfer({
                fromPubkey: smartWalletPubkey,
                toPubkey: demoKey,
                lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
            });
            await signAndSendTransaction({ instructions: [instruction] });
            setStatus("success");
            setTimeout(() => setStatus("idle"), 2000);
        } catch (err) {
            console.error(err);
            setStatus("idle");
        }
    };

    return (
        <div className="w-full space-y-2">
            {/* Row 1: Input area - fixed height */}
            <div className="h-10 flex gap-2">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={!isConnected}
                    className="w-20 h-full px-3 text-sm text-center rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                />
                <div className="flex-1 h-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <span className="text-xs text-gray-400">SOL (0 gas)</span>
                </div>
            </div>

            {/* Row 2: Action button - fixed height */}
            <Button
                onClick={handleSend}
                loading={status === "sending"}
                disabled={!isConnected}
                fullWidth
                size="sm"
                variant="primary"
                className={status === "success" ? "!bg-green-500" : "!bg-gray-900 hover:!bg-black"}
            >
                {!isConnected ? "Connect First" : status === "success" ? "✓ Sent!" : status === "sending" ? "Sending..." : "Send SOL"}
            </Button>
        </div>
    );
}
