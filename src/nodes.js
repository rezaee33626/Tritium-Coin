const express = require('express');
const bodyParser = require('body-parser');
const { Blockchain, Transaction } = require('./blockchain');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const DCN = new Blockchain();

app.get('/blockchain', (req, res) => {
  res.json(DCN);
});

app.post('/mineBlock', (req, res) => {
  const miningRewardAddress = req.body.miningRewardAddress;
  DCN.minePendingTransactions(miningRewardAddress);
  res.json({ message: 'Block mined successfully!' });
});

app.post('/createTransaction', (req, res) => {
  const { fromAddress, toAddress, amount } = req.body;
  const newTransaction = new Transaction(fromAddress, toAddress, amount);
  newTransaction.signTransaction();
  DCN.addTransaction(newTransaction);
  res.json({ message: 'Transaction created successfully!' });
});

app.get('/getBalance/:address', (req, res) => {
  const address = req.params.address;
  const balance = DCN.getBalanceOfAddress(address);
  res.json({ balance });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
