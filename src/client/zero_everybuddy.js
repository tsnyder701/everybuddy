
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

    //-----------------
    // Then initialize.
    //-----------------
    
    // NB: it's possible to be confused about instruction creation, 
    // when we say isSigner: true -- we are making an instruction where that is the case,
    // we are not telling the node if the account signed or not.

    let keys = [
        {pubkey: ourAccount.publicKey, isSigner: true, isWritable: false}      // voter account
    ]

    const instruction = new TransactionInstruction({
        keys: keys,
        programId: s.programId,
        data: [],
    })
    await sendAndConfirmTransaction(
        'init',
        connection,
        new Transaction().add(instruction),
        ourAccount,
    )
}

main()
    .catch(err => {
        console.error(err)
    })
    .then(() => process.exit())
