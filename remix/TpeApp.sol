// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TransactionHashRegistry {
    mapping(uint => string) public transactionHashes; // Associe un ID de transaction à un hash
    uint public transactionCount = 0; // Compteur de transactions

    // Enregistrer un nouveau hash
    function addTransactionHash(string memory _hash) public {
        transactionCount++;
        transactionHashes[transactionCount] = _hash;
    }

    // Récupérer un hash via son ID
    function getTransactionHash(uint _id) public view returns (string memory) {
        return transactionHashes[_id];
    }
}
