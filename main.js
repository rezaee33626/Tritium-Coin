const { Transaction } = require('./transactions');
const { Blockchain } = require('./blockChain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('ab04bfc88b58208f99f0b9a121f254f2bfcb6c48c6898e7ba7080add12fd0490');
const myWalletAddress = myKey.getPublic('hex');

let dragonCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
dragonCoin.addTransaction(tx1)

console.log('\nStarting mining...');

while(true){
    console.log('Try to getting a job from DCN Node');
    dragonCoin.minePendingTransactions(myWalletAddress);

    console.log('Balance of Z AVR: ', dragonCoin.getBalanceOfAddress(myWalletAddress));
}