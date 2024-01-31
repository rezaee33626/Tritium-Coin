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
    console.error('Error creating transaction:', error.message);
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
            console.error('Error mining block:', error.message);
        }
    }
}

async function getBalance() {
  try {
    const response = await axios.get(`${serverUrl}/getBalance/${myWalletAddress}`);
    console.log(`Balance of My Wallet: ${response.data.balance}`);
  } catch (error) {
    console.error('Error getting balance:', error.message);
  }
}

function printCentered(text) {
  const columns = process.stdout.columns;
  const spaces = Math.floor((columns - text.length) / 2);

  const centeredText = ' '.repeat(spaces) + text;

  console.log(centeredText);
}

console.clear();
printCentered('\u001b[38;5;22m'+'                 +=========='+'\u001b[38;5;28m'+'=================='+'\u001b[38;5;34m'+'==================+');
printCentered('\u001b[38;5;17m'+'                            DC'+'\u001b[38;5;18m'+'N MI'+'\u001b[38;5;19m'+'NE'+'\u001b[38;5;20m'+'R');
printCentered('\u001b[38;5;17m'+'developed by rezaee34');
printCentered('\u001b[38;5;22m'+'                 +=========='+'\u001b[38;5;28m'+'=================='+'\u001b[38;5;34m'+'==================+');
console.log('\u001b[0m');

mineBlock();
