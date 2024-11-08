const contractAddress = '0x191B19277D3A7F6b2623E54EaDf67bcF060A9C89';
let web3;
let contract;

async function connectWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log("Connected to Ethereum via MetaMask");
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        alert('Non-Ethereum browser detected. Please install MetaMask!');
        console.log('Non-Ethereum browser detected. Please install MetaMask!');
    }
}

async function loadContract() {
    const response = await fetch('../DecentralizedResourceSharing.json');
    const contractData = await response.json();
    return new web3.eth.Contract(contractData.abi, contractAddress);
}

async function getContract() {
    if (!web3) {
        await connectWeb3();
    }
    if (!contract) {
        contract = await loadContract();
    }
    return contract;
}

connectWeb3();