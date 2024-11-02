async function connectAccount(event) {
    event.preventDefault();
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userId = accounts[0];
            console.log(accounts);
            console.log(userId);
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
                alert('User registered successfully');
                window.location.href = '/';
            } else {
                alert("User already exists");
            }
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        alert('Non-Ethereum browser detected. Please install MetaMask!');
        console.log('Non-Ethereum browser detected. Please install MetaMask!');
    }
}


async function loginWithMetaMask() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userId = accounts[0];

            const data = {
                user_id: userId
            };

            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('User logged in successfully');
                window.location.href = '/';
            } else {
                alert('User is not registered.');
            }
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        alert('Non-Ethereum browser detected. Please install MetaMask!');
        console.log('Non-Ethereum browser detected. Please install MetaMask!');
    }
}
