import { 
    Connection, 
    PublicKey, 
    Transaction, 
    SystemProgram 
} from '@solana/web3.js';
import { Program, AnchorProvider } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import BN from 'bn.js';

interface PresaleState {
    vault: PublicKey;
    tokenMint: PublicKey;
}

export class PresaleContract {
    private connection: Connection;
    private program: Program<any>;  // Added type
    private presaleAccount: PublicKey;

    constructor(
        connection: Connection,
        program: Program<any>,  // Added type
        presaleAccount: PublicKey
    ) {
        this.connection = connection;
        this.program = program;
        this.presaleAccount = presaleAccount;
    }

    async purchaseTokens(
        buyer: PublicKey,
        solAmount: number,
        buyerTokenAccount: PublicKey
    ): Promise<Transaction> {
        try {
            // Fetch presale state
            const presaleState = await this.program.account.presaleState.fetch(
                this.presaleAccount
            ) as PresaleState;

            // Calculate token amount based on SOL amount
            const tokenAmount = new BN(solAmount * 1000); // Example: 1 SOL = 1000 XYN

            const tx = await this.program.methods
                .purchaseTokens(tokenAmount)
                .accounts({
                    presale: this.presaleAccount,
                    buyer: buyer,
                    vault: presaleState.vault,
                    presaleTokenAccount: presaleState.tokenMint,
                    buyerTokenAccount: buyerTokenAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                })
                .transaction();

            return tx;
        } catch (error) {
            console.error('Purchase failed:', error);
            throw error;
        }
    }

    async checkBalance(wallet: PublicKey): Promise<boolean> {
        try {
            const balance = await this.connection.getBalance(wallet);
            return balance > 0; // Add your minimum requirement
        } catch (error) {
            console.error('Balance check failed:', error);
            return false;
        }
    }
} 