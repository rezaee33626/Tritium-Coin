const SHA256 = require('crypto-js/sha256');
const { Block } = require('./blocks');
const { Transaction } = require('./transactions');

class Blockchain {

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 5; 
    this.pendigTransactions = [];
    this.miningReward= 0.000001;
  }

  createGenesisBlock() {
    return new Block(Date.now(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress){
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendigTransactions.push(rewardTx);
    
    let block = new Block(Date.now(), this.pendigTransactions);
    block.mineBlock(this.difficulty);

    console.log("Block accepted!");
    this.chain.push(block);

    this.pendigTransactions = [
        new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }
  
  addTransaction(transaction){

    if(!transaction.fromAddress || !transaction.toAddress){
      throw new Error("Transaction must include from and to address");
    }

    if(!transaction.isValid()){
      throw new Error("Cannot add invalid transaction to chain");
    }

    this.pendigTransactions.push(transaction);
  }

  getBalanceOfAddress(address){
    let balance = 0;

    for(const block of this.chain){
        for(const trans of block.transactions){
            if(trans.fromAddress === address){
                balance -= trans.amount;
            }

            if(trans.toAddress === address){
                balance += trans.amount;
            }
        }
    }

    return balance;
  }

  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];  
      const previousBlock = this.chain[i - 1];

      if(!currentBlock.hasValidTransactions){
        return false;
      }

      if(currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      
      if(currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  } 
}

module.exports.Blockchain = Blockchain;