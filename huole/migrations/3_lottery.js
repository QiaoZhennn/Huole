var Lottery = artifacts.require('./Lottery.sol');

module.exports = async function(deployer) {
  return deployer.then(async () => {
    await deployer.deploy(Lottery);
  });
}