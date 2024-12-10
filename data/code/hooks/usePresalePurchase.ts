import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction } from '@solana/web3.js';
import { PresaleContract } from '../contracts/PresaleContract';

export const usePresalePurchase = () => {
    const { publicKey, signTransaction } = useWallet();
    const { connection } = useConnection();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const purchaseTokens = async (solAmount: number) => {
        if (!publicKey || !signTransaction) {
            setError('Please connect your wallet');
            return;
        }

        setLoading(true);
        try {
            // Initialize contract (you'll need to provide proper values)
            const contract = new PresaleContract(
                connection,
                // You'll need to initialize these properly:
                {} as any, // program
                new PublicKey('your_presale_account')
            );

            // Check if user has enough SOL
            const hasBalance = await contract.checkBalance(publicKey);
            if (!hasBalance) {
                throw new Error('Insufficient SOL balance');
            }

            // Create the transaction
            const transaction = await contract.purchaseTokens(
                publicKey,
                solAmount,
                // You'll need to create or find user's token account
                new PublicKey('user_token_account')
            );

            // Sign and send transaction
            const signed = await signTransaction(transaction);
            const signature = await connection.sendRawTransaction(
                signed.serialize()
            );

            // Wait for confirmation
            await connection.confirmTransaction(signature);

            return signature;
        } catch (err) {
            console.error('Purchase failed:', err);
            setError(err instanceof Error ? err.message : 'Transaction failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        purchaseTokens,
        loading,
        error,
    };
};