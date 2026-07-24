// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {HostDemo} from "../src/HostDemo.sol";
import {IPersonhood} from "../src/interfaces/IPersonhood.sol";

/// Minimal Foundry cheatcode surface — avoids a forge-std dependency for this
/// single test. `vm` lives at the well-known hevm cheatcode address.
interface Vm {
    function mockCall(address callee, bytes calldata data, bytes calldata returnData) external;
    function expectCall(address callee, bytes calldata data) external;
    function expectRevert() external;
}

contract HostDemoPersonhoodTest {
    Vm constant vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
    // Proof-of-personhood precompile address (see IPersonhood).
    address constant PERSONHOOD = 0x000000000000000000000000000000000a010000;

    HostDemo demo;

    function setUp() public {
        demo = new HostDemo();
    }

    function _request()
        internal
        pure
        returns (IPersonhood.ProofVerificationRequest memory)
    {
        return
            IPersonhood.ProofVerificationRequest({
                expectedStatus: 2, // Full
                proof: hex"",
                expectedAlias: bytes32(uint256(0xA11A5)),
                ringIndex: 0,
                context: bytes32("host-playground"),
                revision: 0,
                message: hex"" // overwritten with msg.sender inside the contract
            });
    }

    /// Valid proof → the precompile is consulted and the value is stored.
    function test_storeValueIfPerson_storesWhenProofValid() public {
        vm.mockCall(
            PERSONHOOD,
            abi.encodeWithSelector(IPersonhood.personhoodInfoByProof.selector),
            abi.encode(true)
        );
        vm.expectCall(
            PERSONHOOD,
            abi.encodeWithSelector(IPersonhood.personhoodInfoByProof.selector)
        );

        demo.storeValueIfPerson(42, _request());

        require(demo.getStoredValue() == 42, "value not stored");
    }

    /// Invalid proof → the call reverts and storage is left untouched.
    function test_storeValueIfPerson_revertsWhenProofInvalid() public {
        vm.mockCall(
            PERSONHOOD,
            abi.encodeWithSelector(IPersonhood.personhoodInfoByProof.selector),
            abi.encode(false)
        );

        vm.expectRevert();
        demo.storeValueIfPerson(99, _request());

        require(demo.getStoredValue() == 0, "value should be unchanged");
    }
}
