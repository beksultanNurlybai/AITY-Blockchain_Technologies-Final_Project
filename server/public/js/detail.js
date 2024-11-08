const createAgreement = async function() {
    const months = document.getElementById("monthsInput").value;

    if (!months || months <= 0) {
        alert("Please enter a valid number of months.");
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAccount = accounts[0];

        const price = +document.getElementById('price').innerHTML;
        const providerId = document.getElementById('provider_id').innerHTML;

        const contract = await getContract();

        const tx = await contract.methods.createAgreement(providerId, months).send({
            from: userAccount,
            value: months * price
        });

        console.log("Transaction successful:", tx);
        alert("Agreement created successfully!");

        await fetch('/resource/buy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userAccount,
                provider_id: providerId
            })
        });
        alert("Provider connected to renter successfully in the database!");

    } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred during the transaction. Please try again.");
    }
};
