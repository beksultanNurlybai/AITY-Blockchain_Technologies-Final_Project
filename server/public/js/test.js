const AgreementStatus = {
    0: "Active",
    1: "Completed",
};

async function fetchAgreement(agreementId) {
    try {
        const contract = await getContract();
        const agreement = await contract.methods.getAgreement(agreementId).call();
        console.log("Agreement Data:", agreement);

        // Destructure the data for readability
        const { renter, provider, startTime, endTime, isCompleted, amount, status } = agreement;
        
        // Displaying agreement information
        console.log(`Agreement ID: ${agreementId}`);
        console.log(`Renter: ${renter}`);
        console.log(`Provider: ${provider}`);
        console.log(`Start Time: ${new Date(startTime * 1000).toLocaleString()}`);
        console.log(`End Time: ${new Date(endTime * 1000).toLocaleString()}`);
        console.log(`Is Completed: ${isCompleted}`);
        console.log(`Amount (in Wei): ${amount}`);
        console.log(`Status: ${Object.keys(AgreementStatus)[status]}`); // assuming AgreementStatus is an enum map
    } catch (error) {
        console.error("Error fetching agreement:", error);
    }
}


async function fetchAllAgreements() {
    try {
        const contract = await getContract();
        const agreements = await contract.methods.getAllAgreements().call();
        console.log("All Agreements:", agreements);

        agreements.forEach((agreement, index) => {
            // Convert BigInt values to Number or String as needed
            const startTime = Number(agreement.startTime);
            const endTime = Number(agreement.endTime);
            const amount = agreement.amount.toString(); // keep amount as string for larger numbers
            const status = AgreementStatus[agreement.status];

            // Displaying agreement information
            console.log(`Agreement ${index + 1}:`);
            console.log(`  Renter: ${agreement.renter}`);
            console.log(`  Provider: ${agreement.provider}`);
            console.log(`  Start Time: ${new Date(startTime * 1000).toLocaleString()}`);
            console.log(`  End Time: ${new Date(endTime * 1000).toLocaleString()}`);
            console.log(`  Is Completed: ${agreement.isCompleted}`);
            console.log(`  Amount (in Wei): ${amount}`);
            console.log(`  Status: ${status}`);
        });
    } catch (error) {
        console.error("Error fetching all agreements:", error);
    }
}


fetchAllAgreements();