# IPFS Storage

This repository provides an implementation of DApp for use of IPFS with PNG images. It contains the following components: a smart contract that stores the CID of files for users, tests for it, a script for the deployment of the contract and a frontend.

## Overview

Please note that you will need an Ethereum node to run (the frontend is focused on the local network), but you will not need to run an IPFS node yourself. All the details of working with IPFS are encapsulated.

## Frontend

The frontend provides the following opportunities:

1. You can upload a photo from your computer and upload it to IPFS using the "Upload" button;
2. Using the "Download" button, you can download the last image saved in IPFS.

## Quick start

To run this program, you first need to install the dependencies. This is done with the following command:

```
$ npm install
```

Next, you will need to launch a local Ethereum node, into which the contract will be shared in the future. It is recommended to do this in a separate terminal:

```
$ npx hardhat node
```

You can deploy contracts using the deploy script.js, it also automatically fills in the frontend configuration files, so other ways to embed a smart contract are not recommended for use:


```
$ npx hardhat run scripts/deploy.js --network localhost
Compiled 2 Solidity files successfully
Deploying the contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Storage's address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

The frontend is implemented on React, so you also need to install dependencies to run it. The frontend itself is started by the `start` command:

```
$ cd frontend/
$ npm install
$ npm start
```

## Tests

To run smart contract tests, use the following command:

```
$ npx hardhat test


  Storage contract
    ✔ Deployment (1342ms)
    ✔ The user should not have files in the newly created contract
    ✔ After sending the hash to the smart contract, it can be received when calling getter (44ms)
    ✔ The contract should emit an event when registering a hash


  4 passing (1s)

```
