const {Blockchain, Activity} = require('./blockchain');
const MYELLIPTIC = require('elliptic').ec;
const ec = new MYELLIPTIC('secp256k1');

//This is my private key
const myKey = ec.keyFromPrivate("0d85820cecc17303f801723c92e1e1be73b0c7c16b2787b8e9db6da539ef0afc");

// Wallet address
const myWalletAddress = myKey.getPublic('hex');

// This will create new instance of my Blockchain class
const myUCCCoin = new Blockchain();

const act1 = new Activity(myWalletAddress, "address2", 40);
act1.signActivities(myKey);
myUCCCoin.addActivity(act1);

//console.log("\nStarting the mining...");
myUCCCoin.minePendingActivities(myWalletAddress);

//console.log("\nBalance of Kboy is", myUCCCoin.myAddressBalance(myWalletAddress));


// Create second transaction
const act2 = new Activity(myWalletAddress, "address1", 100);
act2.signActivities(myKey);
myUCCCoin.addActivity(act2);


// Mine block
myUCCCoin.minePendingActivities(myWalletAddress);

console.log();
console.log("\nBalance of Kboy is", myUCCCoin.myAddressBalance(myWalletAddress));



// Check if the chain is valid
console.log();
console.log('Blockchain valid?', myUCCCoin.validateEntires() ? 'Yes' : 'No');






