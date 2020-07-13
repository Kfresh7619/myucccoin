const {Blockchain, Activity} = require('./blockchain');
const MYELLIPTIC = require('elliptic').ec;
const ec = new MYELLIPTIC('secp256k1');

const myKey = ec.keyFromPrivate("0d85820cecc17303f801723c92e1e1be73b0c7c16b2787b8e9db6da539ef0afc");
const myWalletAddress = myKey.getPublic('hex');


let myUCCCoin = new Blockchain();

const act1 = new Activity(myWalletAddress, "Public key goes here", 40);
act1.signActivities(myKey);
myUCCCoin.addActivity(act1);

console.log("\nStarting the mining...");
myUCCCoin.minePendingActivities(myWalletAddress);

console.log("\nBalance of Kboy is", myUCCCoin.myAddressBalance(myWalletAddress));





