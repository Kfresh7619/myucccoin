const MYELLIPTIC = require('elliptic').ec;
const ec = new MYELLIPTIC('secp256k1');

const mykey = ec.genKeyPair();
const publicKey = mykey.getPublic('hex');
const privateKey = mykey.getPrivate('hex');

console.log();
console.log("Private key:", privateKey);

console.log("");
console.log("Public key:" ,publicKey);
