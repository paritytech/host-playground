// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HostApiDemo {
    address public owner;
    uint256 public storedValue;
    bytes public storedData;
    uint256 public totalDeposits;

    event ValueStored(uint256 oldValue, uint256 newValue);
    event DataStored(uint256 length);
    event Deposited(address indexed sender, uint256 amount);
    event Withdrawn(address indexed to, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    // ── Read functions ──

    function version() public pure returns (uint256) {
        return 1;
    }

    function getStoredValue() public view returns (uint256) {
        return storedValue;
    }

    function getStoredData() public view returns (bytes memory) {
        return storedData;
    }

    function getStoredDataLength() public view returns (uint256) {
        return storedData.length;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // ── Write functions ──

    function storeValue(uint256 _value) public {
        uint256 oldValue = storedValue;
        storedValue = _value;
        emit ValueStored(oldValue, _value);
    }

    function storeData(bytes calldata _data) public {
        storedData = _data;
        emit DataStored(_data.length);
    }

    // ── Payable ──

    function deposit() public payable {
        require(msg.value > 0, "Zero deposit");
        totalDeposits += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    receive() external payable {
        totalDeposits += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) public {
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(msg.sender).transfer(_amount);
        emit Withdrawn(msg.sender, _amount);
    }
}
