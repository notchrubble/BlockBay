const Marketplace = artifacts.require("Marketplace");

module.exports = async function (deployer) {
  // Deploy with 10 ETH so the faucet can pay out
  const initialFunding = web3.utils.toWei("10", "ether");
  await deployer.deploy(Marketplace, { value: initialFunding });
};