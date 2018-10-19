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

  it('creating 1 additional post from the same user shoouldn\'t increment user count', async () => {
    await huole.newPost('hello world again', 'tester', 'huole@huobi.com');
    let postCount = await huole.postCount_();
    let userCount = await huole.userCount_();
    assert.equal(postCount, 2);  
    assert.equal(userCount, 1);
  });

  it('only owner can call setCharCost', async () => {   
    // accounts[0] that deployed the contract is the contract owner by default
    await huole.setCharCost(1000, {from: accounts[0]});
    let charCost = await huole.charCost_();
    assert.equal(charCost.toNumber(), 1000);

    await expectThrow(huole.setCharCost(1000, {from: accounts[1]}));
  });

  it('should be able to return specific posts', async () => {
    let post1 = await huole.getPost(1);
    let post2 = await huole.getPost(2);
    assert.equal(post1[0], 'hello world');
    assert.equal(post1[1], 1);
    assert.equal(post2[0], 'hello world again');
    assert.equal(post2[1], 1);
  });
});
