"use client";

/**
 * =============================================================================
 * USDC (SPL TOKEN) TRANSFER EXAMPLE
 * =============================================================================
 * 
 * This component demonstrates how to:
 * 1. Transfer SPL tokens (like USDC) using LazorKit
 * 2. Create Associated Token Accounts (ATAs) for recipients
 * 3. Handle token-specific errors gracefully
 * 
 * Key Concepts:
 * - SPL Tokens: Solana's token standard (like ERC-20 on Ethereum)
 * - ATA (Associated Token Account): Each wallet needs a token account per mint
 * - Mint: The token contract address (USDC has a specific mint address)
 * 
 * How This Works:
 * 1. Get sender's ATA (where their USDC is stored)
 * 2. Get/create recipient's ATA (where USDC will be received)
 * 3. Create transfer instruction
 * 4. Send via LazorKit (gasless)
 * 
 * @see https://docs.lazorkit.com/react-sdk/use-wallet#signandsendtransaction
 */

import { useWallet } from "@lazorkit/wallet";
import {
    createTransferInstruction,
    getAssociatedTokenAddressSync,
    createAssociatedTokenAccountIdempotentInstruction
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

// =========================================================================
// USDC MINT ADDRESS (Devnet)
// =========================================================================
// This is the official USDC mint on Solana Devnet (from Circle's faucet).
// For mainnet, use: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
const USDC_MINT_DEVNET = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

export function UsdcTransferExample() {
    // =========================================================================
    // STEP 1: Get wallet methods from useWallet
    // =========================================================================
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

            // =========================================================================
            // STEP 2: Get Associated Token Accounts (ATAs)
            // =========================================================================
            // Each wallet has a unique ATA for each token mint.
            // getAssociatedTokenAddressSync derives the ATA address deterministically.
            // The `true` parameter allows PDAs (program-derived addresses) as owners.
            const senderATA = getAssociatedTokenAddressSync(
                USDC_MINT_DEVNET,      // The token mint
                smartWalletPubkey,      // The wallet owner
                true                    // Allow PDA owners (smart wallets are PDAs)
            );

            const recipientATA = getAssociatedTokenAddressSync(
                USDC_MINT_DEVNET,
                recipientPubkey,
                true
            );

            // =========================================================================
            // STEP 3: Create recipient's ATA if it doesn't exist
            // =========================================================================
            // If the recipient has never held this token, their ATA won't exist.
            // createAssociatedTokenAccountIdempotentInstruction creates it if needed,
            // and does nothing if it already exists (safe to include every time).
            const createAtaIx = createAssociatedTokenAccountIdempotentInstruction(
                smartWalletPubkey,  // Payer (will pay rent for new account)
                recipientATA,       // The ATA address to create
                recipientPubkey,    // The owner of the new ATA
                USDC_MINT_DEVNET    // The token mint
            );

            // =========================================================================
            // STEP 4: Create the transfer instruction
            // =========================================================================
            // USDC has 6 decimal places, so 1 USDC = 1,000,000 base units
            const transferIx = createTransferInstruction(
                senderATA,          // Source token account
                recipientATA,       // Destination token account
                smartWalletPubkey,  // Authority (owner of source)
                parseFloat(amount) * 1_000_000  // Amount in base units
            );

            // =========================================================================
            // STEP 5: Send both instructions via LazorKit
            // =========================================================================
            // LazorKit batches these into a single transaction.
            // The Paymaster sponsors the gas fees.
            await signAndSendTransaction({
                instructions: [createAtaIx, transferIx]
            });

            setStatus("success");
            setTimeout(() => setStatus("idle"), 2000);

        } catch (err: unknown) {
            // =========================================================================
            // STEP 6: Handle errors gracefully
            // =========================================================================
            // Parse common error messages for user-friendly display
            const errMsg = err instanceof Error ? err.message : "Transfer failed";
            let displayMsg = "Transfer failed";

            if (errMsg.includes("insufficient funds") || errMsg.includes("0x1")) {
                displayMsg = "Insufficient USDC balance";
            } else if (errMsg.includes("invalid account")) {
                displayMsg = "No USDC in wallet";
            } else if (errMsg.includes("User rejected") || errMsg.includes("cancelled")) {
                displayMsg = "Cancelled";
            } else {
                displayMsg = errMsg.slice(0, 30);
            }

            setStatus("error");
            setErrorMsg(displayMsg);
            setTimeout(() => {
                setStatus("idle");
                setErrorMsg(null);
            }, 3000);
        }
    };

    return (
        <div className="w-full space-y-2">
            {/* Amount + Recipient Inputs */}
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

            {/* Send Button */}
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
                {!isConnected ? "Connect First" : status === "success" ? "✓ Sent!" : status === "error" ? (errorMsg || "Failed") : status === "sending" ? "Sending..." : "Send USDC"}
            </Button>
        </div>
    );
}
