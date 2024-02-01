const axios = require('axios');
const { Transaction } = require('./transactions');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const { Keygens } = require('./keyGenerator');

const serverUrl = 'http://localhost:3000';

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

const myKey = ec.keyFromPrivate(privateKey);
const myWalletAddress = myKey.getPublic('hex');

async function createTransaction(toAddress, amount) {
  try {
    const response = await axios.post(`${serverUrl}/createTransaction`, {
      fromAddress: myWalletAddress,
      toAddress,
      amount,
    });
    console.log(response.data.message);
  } catch (error) {
    console.error('\u001b[38;5;88m'+'Error creating transaction:', error.message);
    console.log('\u001b[0m');
    process.exit(0);
  }
}

async function mineBlock() {
    while(true){
        try {
            const response = await axios.post(`${serverUrl}/mineBlock`, {
              miningRewardAddress: myWalletAddress,
            });
            console.log(response.data.message);
        
            getBalance();
        } 
        catch (error) {
            console.error('\u001b[38;5;88m'+'Error mining block:', error.message);
            console.log('\u001b[0m');
            process.exit(0);
        }
    }
}

async function getBalance() {
  try {
    const response = await axios.get(`${serverUrl}/getBalance/${myWalletAddress}`);
    console.log(`Balance of My Wallet: ${response.data.balance}`);
  } catch (error) {
    console.error('\u001b[38;5;88m'+'Error getting balance:', error.message);
    console.log('\u001b[0m');
    process.exit(0);
  }
}

function printCentered(text) {
  const columns = process.stdout.columns;
  const spaces = Math.floor((columns - text.length) / 2);

  const centeredText = ' '.repeat(spaces) + text;

  console.log(centeredText);
}

console.clear();
printCentered('\u001b[38;5;34m'+'                 +=================='+'\u001b[38;5;35m'+'=================='+'\u001b[38;5;36m'+'==================+');
printCentered(' ');
printCentered('\u001b[38;5;34m'+'    _/_/_/      _/_/_/  _/      _/   ');
printCentered('\u001b[38;5;35m'+'   _/    _/  _/        _/_/    _/    ');
printCentered('\u001b[38;5;36m'+'  _/    _/  _/        _/  _/  _/     ');
printCentered('\u001b[38;5;37m'+' _/    _/  _/        _/    _/_/      ');
printCentered('\u001b[38;5;38m'+'_/_/_/      _/_/_/  _/      _/       ');
printCentered(' ');
printCentered('\u001b[38;5;34m'+'                                   deve'+'\u001b[38;5;35m'+'lope'+'\u001b[38;5;36m'+'d by '+'\u001b[38;5;37m'+'reza'+'\u001b[38;5;38m'+'ee34');
printCentered(' ');
printCentered('\u001b[38;5;34m'+'                 +=================='+'\u001b[38;5;35m'+'=================='+'\u001b[38;5;36m'+'==================+');
console.log('\u001b[0m');
console.log(' ');


mineBlock();