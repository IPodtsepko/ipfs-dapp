const { ethers, artifacts } = require("hardhat");

const path = require('path');
const fs = require('fs');


async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying the contracts with the account:", await deployer.getAddress());

    const Storage = await ethers.getContractFactory('Storage');
    const storage = await Storage.deploy();
    await storage.deployed();

    console.log("Storage's address:", storage.address);

    saveAddressToConfig(storage.address);
}

function saveAddressToConfig(address) {
    const contractsDirectory = path.join(__dirname, '..', 'frontend', 'src', 'contracts');

    if (!fs.existsSync(contractsDirectory)) {
        fs.mkdirSync(contractsDirectory);
    }

    fs.writeFileSync(
        path.join(contractsDirectory, 'contract-address.json'),
        JSON.stringify({ Storage: address }, undefined, 2)
    );

    const Artifact = artifacts.readArtifactSync("Storage");

    fs.writeFileSync(
        path.join(contractsDirectory, 'Storage.json'),
        JSON.stringify(Artifact, null, 2)
    );
}

main()
    .then(
        () => {
            process.exit(0);
        }
    )
    .catch(
        (message) => {
            console.error(message);
            process.exit(1);
        }
    );
