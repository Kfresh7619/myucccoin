//const SHA256 = require("crypto-js/sha256");
const SHA256 = require('crypto');
const MYELLIPTIC = require('elliptic').ec;
const ec = new MYELLIPTIC('secp256k1');

class Activity {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
	this.timestamp = Date.now();
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signActivities(signKey) {
        if(signKey.getPublic('hex') !== this.fromAddress) {
            throw new Error("Invalid transaction");
        }

        const actHash = this.calculateHash();
        const actSign = signKey.sign(actHash, 'base64');
        this.signature = actSign.toDER('hex');

    }

    validate() {
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0) {
            throw new Error("Signature required");
        }

        const publickey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publickey.verify(this.calculateHash(), this.signature);
    }
}

class MyBlock {
    constructor(timestamp, activities, previousHash = "") {
        this.timestamp = timestamp;
        this.activities = activities;
        this.previousHash = previousHash;
        this.hash = this.hashComputation();
        this.nonce = 0;
    }

    hashComputation() {
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.activities) + this.nonce).toString();
    }

    // proof of work method
    pofBlock(level) {
        while(this.hash.substring(0, level) !==Array(level + 1).join("0")) {
            this.nonce ++;
            this.hash = this.hashComputation();
        }
        
        console.log("Block Mined: " + this.hash);
    }

    activitiesIsValid() {
        for (const act of this.activities) {
            if(!act.validate()) {
                return false;
            }
        }

        return true;
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.addGenesisBlock()];
        this.level = 3;
        this.pendingActivities = [];
        this.miningReward = 100;
    }

    addGenesisBlock() {
        return new MyBlock("18/06/2020", "Genesis block", "0");
    }

    newestBlock() {
        return this.chain[this.chain.length - 1];
    }

   minePendingActivities(miningRewardAddress) {
       const rewardAct = new Activity(null, miningRewardAddress, this.miningReward);
       this.pendingActivities.push(rewardAct);
       let block = new MyBlock(Date.now(), this.pendingActivities);
       block.pofBlock(this.level);

       console.log("Block mined successfully!");
       this.chain.push(block);

       this.pendingActivities = [
           new Activity(null, miningRewardAddress, this.miningReward)
       ]
   }

   addActivity(activities) {

    if(!activities.fromAddress || !activities.toAddress) {
        throw new Error("Activities must include to and from address");
    }

    if(!activities.validate()) {
        throw new Error("Cannot add invalid activities to chain");
    }
       this.pendingActivities.push(activities);
   }

   myAddressBalance(address) {
       let balance = 0;

       for (const block of this.chain) {
           for(const dealings of block.activities) {
               if(dealings.fromAddress === address) {
                   balance -= dealings.amount;
               }

               if(dealings.toAddress === address) {
                   balance += dealings.amount;
               }
           }
       }

       return balance;
   }

    validateEntries() {
        for (let i = 1; i < this.chain.length; i++) {
            const presentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(!presentBlock.activitiesIsValid()) {
                return false;
            }

            if(presentBlock.hash !== presentBlock.hashComputation()) {
                return false;
            }

            if(presentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

module.exports.Blockchain = Blockchain;
module.exports.Activity = Activity;