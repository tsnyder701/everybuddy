
import {
    SystemProgram,
    PublicKey,
    Transaction,
    TransactionInstruction,
    LAMPORTS_PER_SOL,
    SYSVAR_RENT_PUBKEY,
} from '@solana/web3.js'

import * as BufferLayout from 'buffer-layout';

import {sendAndConfirmTransaction} from './util/send-and-confirm-transaction';

import {getOurAccount} from './ourAccount'
import {getNodeConnection} from './nodeConnection'
import {getStore} from './storeConfig'


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

async function main() {
    
    const ourAccount = await getOurAccount()
    
    const connection = await getNodeConnection()
    
    const s = await getStore(connection, 'everybuddy.json')
    
    if ( !s.inStore ) {
        console.log("Deploy program first")
        process.exit(1)
    }

    let deck = shuffle(range(63, 1))
    console.log("Deck:", deck.toString());
    console.log("-----")

    const instruction_data = new Uint8Array(136)
    for (var i = 0; i < 63; i++) {
        instruction_data[i] = deck[i];
    }
    
    const balBeforeGame = await connection.getBalance( ourAccount.publicKey )
    
    //--------------------------------
    // Create game data account.
    //--------------------------------
    
    const numBytes = 136
    
    const gameRentExemption = await connection.getMinimumBalanceForRentExemption(numBytes);
    const seed = instruction_data.toString().substring(0, 32)
    const gamePubkey = await PublicKey.createWithSeed(ourAccount.publicKey, seed, s.programId)
    
    
    let params = {
        fromPubkey: ourAccount.publicKey,       // payer
        lamports: gameRentExemption,            // funds to deposit on the new account
        space: numBytes,                        // space required in bytes

        basePubkey: ourAccount.publicKey,
        seed: seed,
        programId: s.programId,                 // derive from... and will be owner of account        

        newAccountPubkey: gamePubkey,
    }

    let createTransaction = new Transaction().add( SystemProgram.createAccountWithSeed( params ) )
    
    await sendAndConfirmTransaction(
        'createAccountWithSeed',
        connection,
        createTransaction,
        ourAccount,            // payer, signer
    )

    console.log("Game account created at:", gamePubkey.toString())
    
    //-----------------
    // Then initialize.
    //-----------------
    
    // NB: it's possible to be confused about instruction creation, 
    // when we say isSigner: true -- we are making an instruction where that is the case,
    // we are not telling the node if the account signed or not.

    let keys = [
        {pubkey: s.accountId, isSigner: false, isWritable: true},              // contract's data account
        {pubkey: gamePubkey, isSigner: false, isWritable: true},               // voter's check-account
        //{pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},    // a system account with rent variables
        {pubkey: ourAccount.publicKey, isSigner: true, isWritable: false}      // voter account
    ]

    const instruction = new TransactionInstruction({
        keys: keys,
        programId: s.programId,
        data: instruction_data,
    })
    await sendAndConfirmTransaction(
        'init',
        connection,
        new Transaction().add(instruction),
        ourAccount,
    )
    
    const balAfterGame = await connection.getBalance( ourAccount.publicKey )
    
    const costOfGame = balBeforeGame - balAfterGame
    
    console.log("Cost of game:",costOfGame, "lamports (", costOfGame/LAMPORTS_PER_SOL, ")")
    
    console.log("-----")
}

main()
    .catch(err => {
        console.error(err)
    })
    .then(() => process.exit())
