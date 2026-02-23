// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Counter {
    uint256 private count;

    function increment() external {
        count += 1;
    }

    function decrement() external {
        require(count > 0, "Counter: underflow");
        count -= 1;
    }

    function get() external view returns (uint256) {
        return count;
    }
}
