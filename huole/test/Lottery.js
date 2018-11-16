let Lottery = artifacts.require('./Lottery.sol');

contract('Lottery', (accounts) => {
  let lottery;

  before('get deployed instance', async () => {
    lottery = await Lottery.deployed()
  });

  it('deploys a contract', () => {
    assert.ok(lottery);
  });

  it('allows one account to ender', async () => {
    await lottery.enter({
      from: accounts[0],
      value: 1e+18
    });

    const players = await lottery.getPlayers();

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
    const address = await lottery.address;
    assert.equal(1e+18, web3.eth.getBalance(address).toNumber());
  });

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  it('get owner', async () => {
    const owner = await lottery.owner();
    assert.equal(owner, accounts[0]);
  });

  it('set time', async() => {
    let cur = parseInt((new Date().getTime() / 1000));
    let dur = 2;
    await lottery.setTime(cur, dur);
    const startTime = await lottery.startTime_();
    const duration = await lottery.duration_();
    assert.equal(startTime.toNumber(), cur);
    assert.equal(duration.toNumber(), dur);
  });

  it('pick winner', async() => {
    await lottery.enter({
      from: accounts[1],
      value: 1e+18
    });
    await lottery.enter({
      from: accounts[2],
      value: 1e+18
    });
    const duration = await lottery.duration_();
    const dur = duration.toNumber() * 1000;
    await timeout(dur);
    const players = await lottery.getPlayers();
    console.log('players: ',players);
    await lottery.pickWinner();
    const winner = await lottery.winner_();
    assert.ok(winner);
  });
});
