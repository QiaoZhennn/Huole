var HuoLe = artifacts.require('./HuoLe.sol');

module.exports = async function(deployer) {
  return deployer.then(async () => {
    await deployer.deploy(HuoLe);
  });
}