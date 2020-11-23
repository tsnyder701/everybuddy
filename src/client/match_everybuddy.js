
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
import {Store} from './util/store'

async function main() {
    
    const ourAccount = await getOurAccount()
    
    const connection = await getNodeConnection()
    
    const s = await getStore(connection, 'everybuddy.json')
    const g = await new Store().load('game.json')

    if ( !s.inStore ) {
        console.log("Deploy program first")
        process.exit(1)
    }

    if ( !g.accountId ) {
        console.log("Initialize game first")
        process.exit(1)
    }
    
    //--------------------------------
    // Load game data account.
    //--------------------------------
    
    const gameAccountInfo = await connection.getAccountInfo(new PublicKey(g.accountId))
    const data = Buffer.from(gameAccountInfo.data)
    
    const gameDataLayout = BufferLayout.struct([
        BufferLayout.seq(BufferLayout.u8(), 64, 'deck'),
        BufferLayout.seq(BufferLayout.u8(), 64, 'shown'),
        BufferLayout.seq(BufferLayout.u8(), 8, 'scores'),
    ]);

    const numBytes = 136

    const game = gameDataLayout.decode(data)

    //-----------------
    // Validate match.
    //-----------------
    let player = parseInt(process.argv[2], 10)
    let cards = process.argv.slice(3).map(c => parseInt(c, 10))
    if ( cards.length !== 3 ||
         cards.filter(c => game.shown.indexOf(c) > -1).length !== 3 ) {
        console.log("Need three cards that are shown")
        process.exit(1)
    }

    //-----------------
    // Send the match.
    //-----------------

    // const instructionDataLayout = BufferLayout.struct([
    //     BufferLayout.u8('player'),
    //     BufferLayout.seq(BufferLayout.u8(), 3, 'cards'),
    // ]);

    const instructionData = { player: player, cards: cards }
//    console.log(instructionDataLayout.encode(instructionData))
    
    // NB: it's possible to be confused about instruction creation, 
    // when we say isSigner: true -- we are making an instruction where that is the case,
    // we are not telling the node if the account signed or not.

    const gamePubkey = new PublicKey(g.accountId)
    let keys = [
        {pubkey: s.accountId, isSigner: false, isWritable: true},              // contract's data account
        {pubkey: gamePubkey, isSigner: false, isWritable: true},               // game account
        {pubkey: ourAccount.publicKey, isSigner: true, isWritable: false}      // player's account
    ]

    const instruction = new TransactionInstruction({
        keys: keys,
        programId: s.programId,
        data: [player, ...cards], //instructionDataLayout.encode(instructionData)
    })

    console.log(instruction)
    
    await sendAndConfirmTransaction(
        'match',
        connection,
        new Transaction().add(instruction),
        ourAccount,
    )
    
    console.log("Successfully made match!")
    console.log("-----")
}

main()
    .catch(err => {
        console.error(err)
    })
    .then(() => process.exit())
