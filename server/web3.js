const {Web3} = require('web3');
const contractArtifact = require('./blockchain/build/contracts/DecentralizedResourceSharing.json');

const web3 = new Web3('http://127.0.0.1:7545');
const contractAddress = contractArtifact.networks['5777'].address;
const contract = new web3.eth.Contract(contractArtifact.abi, contractAddress);

module.exports = { web3, contract };
