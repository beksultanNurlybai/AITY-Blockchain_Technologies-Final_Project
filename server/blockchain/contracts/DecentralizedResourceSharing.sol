// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedResourceSharing {

    struct Provider {
        address providerAddress;
        uint256 pricePerMonth;
        bool isRegistered;
    }

    enum AgreementStatus { Active, Completed }

    struct RentalAgreement {
        address renter;
        address provider;
        uint256 startTime;
        uint256 endTime;
        bool isCompleted;
        uint256 amount;
        AgreementStatus status;
    }

    mapping(address => Provider) public providers;
    mapping(uint256 => RentalAgreement) public agreements;
    mapping(address => uint256) public balances;

    uint256 public agreementCount;

    event ProviderRegistered(address indexed provider, uint256 pricePerMonth);
    event AgreementCreated(uint256 indexed agreementId, address renter, address provider, uint256 amount);
    event TaskCompleted(uint256 indexed agreementId, address renter, address provider);
    event PaymentMade(uint256 indexed agreementId, address renter, address provider, uint256 amount);

    function registerProvider(uint256 _pricePerMonth) external {
        require(_pricePerMonth > 0, "Price must be greater than zero");

        providers[msg.sender] = Provider({
            providerAddress: msg.sender,
            pricePerMonth: _pricePerMonth,
            isRegistered: true
        });

        emit ProviderRegistered(msg.sender, _pricePerMonth);
    }

    function createAgreement(address _provider, uint256 _durationMonths) external payable {
        Provider storage provider = providers[_provider];
        require(provider.isRegistered, "Provider is not registered");

        uint256 totalAmount = provider.pricePerMonth * _durationMonths;
        require(msg.value >= totalAmount, "Insufficient payment for the rental duration");

        agreementCount++;
        agreements[agreementCount] = RentalAgreement({
            renter: msg.sender,
            provider: _provider,
            startTime: block.timestamp,
            endTime: block.timestamp + (_durationMonths * 30 days),
            isCompleted: false,
            amount: msg.value,
            status: AgreementStatus.Active // Automatically set to active
        });

        emit AgreementCreated(agreementCount, msg.sender, _provider, msg.value);
    }

    function completeTask(uint256 _agreementId) external {
        RentalAgreement storage agreement = agreements[_agreementId];

        require(agreement.provider == msg.sender, "Only provider can complete the task");
        require(agreement.status == AgreementStatus.Active, "Agreement is not active");
        require(block.timestamp >= agreement.endTime, "Rental period has not ended yet");

        agreement.isCompleted = true;
        agreement.status = AgreementStatus.Completed;

        emit TaskCompleted(_agreementId, agreement.renter, msg.sender);
    }

    function confirmCompletion(uint256 _agreementId) external {
        RentalAgreement storage agreement = agreements[_agreementId];
        require(agreement.renter == msg.sender, "Only renter can confirm completion");
        require(agreement.status == AgreementStatus.Completed, "Task not yet completed by provider");

        // Transfer payment to provider
        balances[agreement.provider] += agreement.amount;
        emit PaymentMade(_agreementId, msg.sender, agreement.provider, agreement.amount);
    }

    function withdrawFunds() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No funds to withdraw");

        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function getAgreement(uint256 _agreementId) external view returns (
        address renter,
        address provider,
        uint256 startTime,
        uint256 endTime,
        bool isCompleted,
        uint256 amount,
        AgreementStatus status
    ) {
        RentalAgreement storage agreement = agreements[_agreementId];
        return (
            agreement.renter,
            agreement.provider,
            agreement.startTime,
            agreement.endTime,
            agreement.isCompleted,
            agreement.amount,
            agreement.status
        );
    }

    function getAllAgreements() external view returns (RentalAgreement[] memory) {
        RentalAgreement[] memory allAgreements = new RentalAgreement[](agreementCount);
        for (uint256 i = 1; i <= agreementCount; i++) {
            allAgreements[i - 1] = agreements[i];
        }
        return allAgreements;
    }
}
