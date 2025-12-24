"use client";

import { useWallet } from "@lazorkit/wallet";
import {
    createTransferInstruction,
    getAssociatedTokenAddressSync,
    createAssociatedTokenAccountIdempotentInstruction
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * USDC Transfer Example - With ATA creation for recipient
 */
const USDC_MINT_DEVNET = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

export function UsdcTransferExample() {
    const { signAndSendTransaction, smartWalletPubkey, isConnected } = useWallet();
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("1");
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleTransfer = async () => {
        if (!smartWalletPubkey || !recipient) return;
        try {
            setStatus("sending");
            setErrorMsg(null);

            const recipientPubkey = new PublicKey(recipient);
            const senderATA = getAssociatedTokenAddressSync(USDC_MINT_DEVNET, smartWalletPubkey, true);
            const recipientATA = getAssociatedTokenAddressSync(USDC_MINT_DEVNET, recipientPubkey, true);

            // Create recipient ATA if it doesn't exist (idempotent - won't fail if exists)
            const createAtaIx = createAssociatedTokenAccountIdempotentInstruction(
                smartWalletPubkey,  // payer
                recipientATA,       // ata
                recipientPubkey,    // owner
                USDC_MINT_DEVNET    // mint
            );

            const transferIx = createTransferInstruction(
                senderATA, recipientATA, smartWalletPubkey,
                parseFloat(amount) * 1_000_000
            );

            await signAndSendTransaction({ instructions: [createAtaIx, transferIx] });
            setStatus("success");
            setTimeout(() => setStatus("idle"), 2000);
        } catch (err) {
            console.error(err);
            setStatus("error");
            setErrorMsg(err instanceof Error ? err.message.slice(0, 40) : "Transfer failed");
            setTimeout(() => {
                setStatus("idle");
                setErrorMsg(null);
            }, 3000);
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
                    className="w-16 h-full px-2 text-sm text-center rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                />
                <input
                    placeholder="Recipient address..."
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    disabled={!isConnected}
                    className="flex-1 h-full px-3 text-xs font-mono rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400 placeholder:text-gray-400"
                />
            </div>

            {/* Row 2: Action button - fixed height */}
            <Button
                onClick={handleTransfer}
                loading={status === "sending"}
                disabled={!isConnected || !recipient}
                fullWidth
                size="sm"
                variant="primary"
                className={
                    status === "success" ? "!bg-green-500"
                        : status === "error" ? "!bg-red-500"
                            : ""
                }
            >
                {!isConnected ? "Connect First" : status === "success" ? "✓ Sent!" : status === "error" ? "Failed" : status === "sending" ? "Sending..." : "Send USDC"}
            </Button>
        </div>
    );
}
