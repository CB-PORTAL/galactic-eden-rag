use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount};

declare_id!("YOUR_PROGRAM_ID"); // We'll get this after deployment

#[program]
pub mod xyn_presale {
    use super::*;

    pub fn initialize_presale(
        ctx: Context<InitializePresale>,
        price_per_token: u64,
        total_tokens: u64,
    ) -> Result<()> {
        let presale = &mut ctx.accounts.presale;
        presale.authority = ctx.accounts.authority.key();
        presale.token_mint = ctx.accounts.token_mint.key();
        presale.vault = ctx.accounts.vault.key();
        presale.price_per_token = price_per_token;
        presale.total_tokens = total_tokens;
        presale.tokens_sold = 0;
        Ok(())
    }

    pub fn purchase_tokens(
        ctx: Context<PurchaseTokens>,
        amount: u64,
    ) -> Result<()> {
        let presale = &mut ctx.accounts.presale;
        require!(
            presale.tokens_sold + amount <= presale.total_tokens,
            PresaleError::SoldOut
        );

        // Calculate SOL cost
        let sol_amount = amount
            .checked_mul(presale.price_per_token)
            .ok_or(PresaleError::Overflow)?;

        // Transfer SOL
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                },
            ),
            sol_amount,
        )?;

        // Transfer tokens
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.presale_token_account.to_account_info(),
                    to: ctx.accounts.buyer_token_account.to_account_info(),
                    authority: ctx.accounts.presale.to_account_info(),
                },
                &[&[b"presale", &[presale.bump]]],
            ),
            amount,
        )?;

        presale.tokens_sold += amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePresale<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 32 + 8 + 8 + 8 + 1
    )]
    pub presale: Account<'info, PresaleState>,
    pub token_mint: Account<'info, token::Mint>,
    /// CHECK: Vault for receiving SOL
    pub vault: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseTokens<'info> {
    #[account(mut)]
    pub presale: Account<'info, PresaleState>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    /// CHECK: Vault for receiving SOL
    pub vault: AccountInfo<'info>,
    #[account(mut)]
    pub presale_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PresaleState {
    pub authority: Pubkey,
    pub token_mint: Pubkey,
    pub vault: Pubkey,
    pub price_per_token: u64,
    pub total_tokens: u64,
    pub tokens_sold: u64,
    pub bump: u8,
}

#[error_code]
pub enum PresaleError {
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Presale is sold out")]
    SoldOut,
}