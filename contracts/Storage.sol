// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Storage {
    constructor() {}

    mapping(address => string) userFiles;

    /**
     * Notifies that the user has registered the hash of the file saved in IPFS.
     *
     * @param user the address of the user who registered the hash
     * @param cid CID of the file
     */
    event FileAdded(address user, string cid);

    /**
     * Saves information in the smart contract about which file was
     * uploaded by the user to IPFS.
     *
     * @param cid CID of the file saved in IPFS on behalf of the sender
     */
    function setFile(string memory cid) public {
        userFiles[msg.sender] = cid;
        emit FileAdded(msg.sender, cid);
    }

    /**
     * @return cid the CID of the file that was uploaded by the user to IPFS.
     */
    function getFile() public view returns (string memory cid) {
        cid = userFiles[msg.sender];
    }
}
