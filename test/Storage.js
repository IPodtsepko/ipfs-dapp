const { ethers } = require('hardhat');
const { expect } = require('chai');

const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');


describe('Storage contract', function () {
    async function deployStorage() {
        const [user] = await ethers.getSigners();
        const Storage = await ethers.getContractFactory('Storage');

        const contract = await Storage.deploy();

        await contract.deployed();

        return { Storage, contract, user };
    };

    it('Deployment',
        async function () {
            await loadFixture(deployStorage); // without exceptions, just finished successfully
        });

    it('The user should not have files in the newly created contract',
        async function () {
            const { contract, user } = await loadFixture(deployStorage);

            expect(await contract.connect(user).getFile()).to.equal('');
        });

    it('After sending the hash to the smart contract, it can be received when calling getter',
        async function () {
            const { contract, user } = await loadFixture(deployStorage);

            const cid = 'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR';
            await contract.connect(user).setFile(cid);

            expect(await contract.connect(user).getFile()).to.equal(cid);
        });

    it('The contract should emit an event when registering a hash',
        async function () {
            const { contract, user } = await loadFixture(deployStorage);

            const cid = 'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR';
            await expect(contract.connect(user).setFile(cid))
                .to.emit(contract, "FileAdded")
                .withArgs(user.address, cid);
        });
});
