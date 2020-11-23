
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

    console.log("Scores:", game.scores)
    console.log("Cards in play:")
    console.log(game.shown.filter(c => c !== 0))
}

main()
    .catch(err => {
        console.error(err)
    })
    .then(() => process.exit())
