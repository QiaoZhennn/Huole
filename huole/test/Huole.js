import expectThrow from './helpers/expectThrow';

let HuoLe = artifacts.require('./HuoLe.sol');

contract('HuoLe', (accounts) => {
  let huole

  before('get deployed instance', async () => {
    huole = await HuoLe.deployed()
  });

  it('should have zero user and posts to begin with', async () => {
    let initialUserCount = await huole.userCount_();
    let initialPostCount = await huole.postCount_();
    assert.equal(initialUserCount, 0);
    assert.equal(initialPostCount, 0);   
  });

  it('should be able to create a post', async () => {
    // const tester1 = accounts[1];
    await huole.newPost('hello world', 'tester', 'huole@huobi.com');
    let userCount = await huole.userCount_();
    let postCount = await huole.postCount_();
    assert.equal(userCount, 1);
    assert.equal(postCount, 1);   
  });

  it('only owner can call setCharCost', async () => {
    await expectThrow(huole.setCharCost.call(1000, {from: accounts[1]}));
    await huole.setCharCost(1000);
    let charCost = await huole.charCost_();
    assert.equal(charCost, 1000);
  });
});
