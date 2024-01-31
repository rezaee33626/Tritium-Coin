const express = require('express');
const bodyParser = require('body-parser');
const { Blockchain, Transaction } = require('./blockchain');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const DCN = new Blockchain();

// Endpoint to get the entire blockchain
app.get('/blockchain', (req, res) => {
  res.json(DCN);
});

// Endpoint to mine a new block
app.post('/mineBlock', (req, res) => {
  const miningRewardAddress = req.body.miningRewardAddress;
  DCN.minePendingTransactions(miningRewardAddress);
  res.json({ message: 'Block mined successfully!' });
});

// Endpoint to create a new transaction
app.post('/createTransaction', (req, res) => {
  const { fromAddress, toAddress, amount } = req.body;
  const newTransaction = new Transaction(fromAddress, toAddress, amount);
  newTransaction.signTransaction(); // Note: You may want to pass a private key here
  DCN.addTransaction(newTransaction);
  res.json({ message: 'Transaction created successfully!' });
});

// Endpoint to get the balance of a specific address
app.get('/getBalance/:address', (req, res) => {
  const address = req.params.address;
  const balance = DCN.getBalanceOfAddress(address);
  res.json({ balance });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
