async function connectAccount(event) {

    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userId = accounts[0];

            const role = document.querySelector('input[name="role"]:checked').value;

            const data = {
                user_id: userId,
                role: role
            };

            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log("User registered successfully");
            } else {
                console.error("Error registering user:", await response.text());
            }
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        alert('Non-Ethereum browser detected. Please install MetaMask!');
        console.log('Non-Ethereum browser detected. Please install MetaMask!');
    }
}