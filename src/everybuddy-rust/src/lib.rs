//use std::collections::HashSet;
use num_derive::FromPrimitive;
use solana_sdk::{
    account_info::next_account_info,
    account_info::AccountInfo,
    decode_error::DecodeError,
    //entrypoint,
    //entrypoint::ProgramResult,
    entrypoint_deprecated,
    entrypoint_deprecated::ProgramResult,
    info,
    program_error::ProgramError,
    program_pack::{Pack, Sealed, IsInitialized},
    pubkey::Pubkey,
    rent::Rent,
    sysvar::{self, Sysvar},
    hash::{hash, Hash},
};
use thiserror::Error;

#[derive(Clone, Debug, Eq, Error, FromPrimitive, PartialEq)]
pub enum GameError {
    #[error("Incorrect Owner")]
    IncorrectOwner,
    #[error("Incorrect Size")]
    IncorrectSize,
    #[error("Account Not Rent Exempt")]
    AccountNotRentExempt,
    #[error("Not a Match")]
    NotAMatch,
    #[error("Card not in play")]
    InvalidCard,
}
impl From<GameError> for ProgramError {
    fn from(e: GameError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
impl<T> DecodeError<T> for GameError {
    fn type_of() -> &'static str {
        "Vote Error"
    }
}

pub struct EveryBuddy {
    pub deck: Vec<u8>,
    pub shown: Vec<u8>,
    pub matches: [u8; 8],
}

impl IsInitialized for EveryBuddy {
    fn is_initialized(&self) -> bool { true }
}
impl Sealed for EveryBuddy {}

impl Pack for EveryBuddy {
    const LEN: usize = 64 + 64 + 8;

    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        let mut eb = EveryBuddy { deck: Vec::new(), shown: Vec::new(), matches: [0 as u8; 8] };
        eb.deck.extend(src[0..64].iter().filter(|&x| *x > 0));
        eb.shown.extend(src[64..128].iter().filter(|&x| *x > 0));
        for (&x, p) in src[128..].iter().zip(eb.matches.iter_mut()) {
            *p = x;
        }
        Ok(eb)
    }

    fn pack_into_slice(&self, dst: &mut [u8]) {
        dst[0..136].clone_from_slice(&[0u8; 136]);
        for (&x, p) in self.deck.iter().zip(dst[0..64].iter_mut()) {
             *p = x;
        }
        for (&x, p) in self.shown.iter().zip(dst[64..128].iter_mut()) {
            *p = x;
        }
        dst[128..136].clone_from_slice(&self.matches);
    }
}


// Declare and export the program's entrypoint
entrypoint_deprecated!(process_instruction);

// Program entrypoint's implementation
fn process_instruction(
    program_id: &Pubkey,      // Public key of program account
    accounts: &[AccountInfo], // data accounts
    instruction_data: &[u8],  // string to use for indexed name
) -> ProgramResult {
    info!("Rust program entrypoint");

    // Iterating accounts is safer then indexing
    let accounts_iter = &mut accounts.iter();

    let data_account = next_account_info(accounts_iter)?;
    
    // Get the account that holds the game.
    let game_account = next_account_info(accounts_iter)?;

    let signer_account = next_account_info(accounts_iter)?;

    info!(&*game_account.key.to_string());
    info!(&*signer_account.key.to_string());
    // The account must be owned by the program in order to modify its data
    if game_account.owner != program_id {
        info!("Game account not owned by program");
        return Err(GameError::IncorrectOwner.into());
    }

    let mut raw_game_data = game_account.try_borrow_mut_data()?;
    let mut game = EveryBuddy::unpack_unchecked(&raw_game_data)?;
    if instruction_data.len() == 0 {
        for _ in &[0, 1, 2] {
            if let Some(s1) = game.deck.pop() {
                game.shown.push(s1);
            }
        }
    } else if instruction_data.len() == 4 {
        let player = instruction_data[0];
        let match_cards = &instruction_data[1..];
        let mut xor_result = 0u8;
        for &c in match_cards.iter() {
            xor_result ^= c;
            if let Some(i) = game.shown.iter().position(|&x| x == c) {
                game.shown.remove(i);
            } else {
                return Err(GameError::InvalidCard.into());
            }
        }
        if xor_result != 0 {
            return Err(GameError::NotAMatch.into());
        }
        game.matches[player as usize] += 1;
        while game.shown.len() < 12 && game.deck.len() > 0 {
            if let Some(c) = game.deck.pop() {
                game.shown.push(c);
            }
        }
    } else if instruction_data.len() == 136 {
        game = EveryBuddy::unpack_unchecked(instruction_data)?;
        while game.shown.len() < 12 && game.deck.len() > 0 {
            if let Some(c) = game.deck.pop() {
                game.shown.push(c);
            }
        }
    }else {
        return Err(GameError::IncorrectSize.into());
    }
    
    EveryBuddy::pack(game, &mut raw_game_data).expect("Failed to write EveryBuddy data");
    Ok(())
}

// Required to support info! in tests
#[cfg(not(target_arch = "bpf"))]
solana_sdk::program_stubs!();
