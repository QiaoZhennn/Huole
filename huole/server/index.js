'use strict';

require('dotenv').config();

var express = require('express');
var app = express();

var port = process.env.PORT || 8000;

// Add headers
app.use(function (req, res, next) {
  var allowedOrigins = ['http://localhost:3000', 'http://huole.huobidev.com'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  } 

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

import morganBody from 'morgan-body';
morganBody(app);

app.get('/', function(req, res) {
  res.status(200).send({success: 'true', message: 'hooray! welcome to our api!'});
});

var Web3 = require('web3');
var web3;
if (process.env.NODE_ENV == 'prod') {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8501'));
} else {
  web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

web3.eth.defaultAccount = process.env.WALLET_ADDRESS;
const addr = process.env.WALLET_ADDRESS;
console.log("private", process.env.WALLET_PRIVATE_KEY);
console.log("addr",addr)
web3.eth.getBalance(web3.eth.defaultAccount).then((res) => {
  let myBalanceWei = res
  console.log('my blance wei: ', myBalanceWei);
  let myBalance = web3.utils.fromWei(myBalanceWei, 'ether');
  console.log('my balance: ', myBalance);
});
var EthereumTx = require('ethereumjs-tx')

app.post('/showmethemoney', (req, res) => {
  if(!req.body.addr) {
    return res.status(400).send({
      success: 'false',
      message: 'addr is required'
    });
  }

  const to_addr = req.body.addr;
  let txhash;
  web3.eth.getTransactionCount(web3.eth.defaultAccount).then((nonce) => {

    let details = {
      "to": to_addr,
      "value": web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
      "gas": 21000,
      "gasPrice": 1000,
      "nonce": nonce,
      "chainId": 888
    }

    const transaction = new EthereumTx(details)
    transaction.sign( Buffer.from(process.env.WALLET_PRIVATE_KEY, 'hex') )
    const serializedTransaction = transaction.serialize()
    web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex')).then((resp) => {
      txhash = resp.transactionHash;
      return res.status(200).send({
        success: 'true',
        message: `funds added successfully for ${req.body.addr}`,
        txhash: txhash,
        nonce: nonce
      });
    });
  });

});

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});
