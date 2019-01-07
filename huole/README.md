# 基于私有链的去中心化信息发布平台
[产品定义](http://phabricator.huobidev.com/T32598)

## 我的任务
#### Post
 - SmartContract, 我写了新的feature，并测试。我的工作量大约占这个完成的合约工作量的30%
 - 前端：Mentor提供了单页框架。我负责前端UI的分页及美化，以及增加了很多新的feature。我的代码量大约占70%
 - 后端：Mentor写了faucet功能，我负责连接MongoDB，写其他API。我的代码量大约占70%。
 - 部署：Mentor帮我把Post这个DApp部署到了公司内部的私链上。
#### Lottery
 - 开发工作100%由我完成。
 - 部署：Mentor帮我把Post这个DApp部署到了公司内部的私链上。  
后期Mentor在远程server上加了staging，之后的代码优化，维护，部署就全部由我来做。
其中有很多棘手的bug是mentor指导我修复的。比如drizzle.js无法在我们的private POA上捕捉到MetaMask confirm transaction的动作。这个问题，在local环境下并不显现，但是部署到private POA上就会出现。

## 命名规则

 - 合约全局变量：smallCamel_
 - 函数传入参数：_smallCamel
 - 函数内变量, Struct 内变量： smallCamel

## 如何运行

1. git clone
2. install required packages if running for the first time. Skip this step, if it's already been run before
```
cd to huole/, npm install
cd to server/, npm install
cd to client/, npm install
```
4. migrate contract to localhost or private POA network, if running the first time or contract has been changed.
```
# make sure you have .env file and ETH_MNEMONI set, if migrating to networks other than localhost. Make sure your account[0] has some ETH to deploy the contract.
truffle migrate --network privatepoa
```
5. start server
If starting the server the first time, make sure you have .env file in server/ directory:
    * cd to server/, vim .env
    * add: WALLET_ADDRESS=0x92***
    * add: WALLET_PRIVATE_KEY=c4e***
Once you have the .env file in server/, start the server:
```
# cd to server/
npm start
```
6. start client
```
# cd to client/
npm start
```

## 注意事项

1. 修改smart contract源文件后，要删除build目录，然后再truffle compile。否则MetaMask会报RPC相关错误。
2. 如果遇到了RPC error，先查看MetaMask是否与contract在同一网络，然后reset MetaMask account

## 开发总结
### 工作内容
我从最顶层的DAPP开始接触区块链，目前开发了两款具有基本功能的DAPP：留言板和彩票。在开发这两款DAPP的过程中，我总结了一下经验。
### 产品设计
DAPP与传统APP在开发中最大的不同在于数据的存储。传统APP的数据储存在中心化的数据库中，而DAPP的数据，全部或者关键数据是存在去中心化(Decentralized)的区块链中，根据需要，一小部分数据可以选择存在中心化的数据库中。  
所以开发DAPP，第一步就是设计好什么数据储存在区块链中，什么数据储存在数据库中。如果为了求快，第一步没有做好就开始开发，之后会在代码架构层面影响后续的开发工作，得不偿失。  
拿留言板应用作为一个例子：最核心的数据就是每一条留言(post)，其设计如下：
```
const postSchema = new Schema({
  postId: Number,
  content: String,
  postTime: Number,
  tip: Number,
  userAddress: String,
  nickname: String,
  contact: String,
  likeCount: Number,
  comment: [Object]
});
```
这些数据全部储存在数据库中。前端的显示也是来源数据库的数据。而链上存的数据，如下：
```
struct User {
  uint id;
  address addr;
  string nickname;
  string contact;
}

struct Post {
  uint id;
  uint postTime;
  uint tip;
  string text;
  User user;
}
```
可见，likeCount和comment这两项只存在数据库中，并没存在区块链上。留言板中，存在区块链上的数据是留言内容，存在数据库上的数据是点赞数和评论内容。作为一款DAPP，应当尽量减少对数据库的依赖，
而我引入数据库的原因是要实现点赞和评论功能。对于区块链数据的写操作，都是要支付一定的Gas的（真实金钱），同时会有MetaMask窗口弹出，严重影响了用户体验。很难想象，其他用户看到一个喜爱的帖子，
想要简单地点一下赞时，还需要弹出一个窗口来收取金钱。所以此处我选择了用数据库来储存某个帖子的点赞及评论等信息，同时也尝试探索如何同时操作数据库和区块链。然而，数据同步就是一个很棘手的问题。
我选择了一个比较妥协的解决方案。

### Drizzle VS Web3
就简单的DAPP来说，Drizzle和Web3可以实现相同的功能，Drizzle内部也包涵了Web3，可以直接调出来用。Drizzle的功能更加多样一些，可以获取每笔Transaction不同的状态：error, pending, succeed.
下面提供一些例子
* Drizzle read
```javascript
const dataKey = drizzle.contracts.SimpleStorage.methods.storedData.cacheCall()
```
* Drizzle write
```javascript
const stackId = drizzle.contracts.SimpleStorage.methods.set.cacheSend(2, {from: '0x3f...'})
```
* Web3 read
```javascript
drizzle.contracts.SimpleStorage.methods.storedData().call()
```
* Web3 write
```javascript
drizzle.contracts.SimpleStorage.methods.set(2).send({from: '0x3f...'})
```
那么该如何导入Drizzle到app中呢
```javascript
import {Drizzle, generateStore} from "drizzle";
const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);
ReactDOM.render(
  (
      <App drizzle={drizzle}/>
  ),
  document.getElementById('root')
);
```

### 如何存储
当用户想要发布新post时，用户需要填写post的内容，用户的昵称，用户的联系方式以及用户愿意为这则post支付多少小费。当这些信息录入完毕，用户需要点击发布按钮，
会弹出MetaMask对话框，用户支付总费用（字数费用+小费+gas）后，这则post信息被储存到区块链中。当前段页面监听到区块链写操作完成后，在把这则post信息附加上点赞数：
初始为0，评论内容：初始为空数组，封装为一个json，存到数据库中。前端显示的内容是从数据库中拿数据。  
监听Transaction的方式有两种。
1. 通过DrizzleState来监听。
```javascript
const stackId = await contract.methods.newPost.cacheSend(this.state.postMsg, this.state.nickname, this.state.contact, 
                                                         drizzle.web3.utils.toWei(this.state.tip, 'ether'), {
        from: drizzleState.accounts[0],
        to: contract.address,
        value: drizzle.web3.utils.toWei(this.calculatePayment(), 'ether')
      });
this.setState({stackId});
getTxStatus = () => {
    const {transactions, transactionStack} = this.props.drizzleState;
    const txHash = transactionStack[this.state.stackId];
    if (!txHash) return null;
    return `${transactions[txHash].status}`;
};
let status = this.getTxStatus();
console.log(status); // 'null', 'error', 'pending', 'succeed'
if (status === 'succeed')
    this.storeToDB(contract)
```
2. 通过web3来监听。
```javascript
await contract.methods.newPost(this.state.postMsg, this.state.nickname, this.state.contact, drizzle.web3.utils.toWei(this.state.tip, 'ether')).send({
        from: drizzleState.accounts[0],
        to: contract.address,
        value: drizzle.web3.utils.toWei(this.calculatePayment(), 'ether')
      });
await this.storeToDB(contract);
```
在开发时，碰到了一个问题，在公司搭建的私有链上，前端无法获得链上transaction的succeed状态。当MetaMask点击confirm后，DrizzleState只可以捕捉到pending，即使当MetaMask转账完成，
Drizzle也没法拿到成功的状态，无法触发storeToDB，导致新的post没有存到数据库，从而前端没有显示新的post


### MetaMask相关的问题
DAPP上的任何转账，都需要通过MetaMask来进行。但是MetaMask并不是一款很好用的软件。经常会崩溃。我个人遇到的崩溃情况有以下几种
* 网络不对应
  比如应用部署在localhost上，而metamask却连接着私链。把二者设置一致即可。
* 私链连接超时
  解决方法
  1. 通过Custom RPC重新设置私链的url
  2. connect to main net first，reset account，switch to private net
  3. 重启浏览器
* localhost连接超时
  解决方法
  1. connect to main net first，reset account，switch to private net
  2. 重启浏览器
有时MetaMask窗口并不弹出，而是隐藏在Chrome工具栏的MetaMask图标下。留意工具栏中MetaMask图标的数字，它代表现在待处理的transaction的数量。
如果是在自己localhost上做测试，可以把Ganache的账户导入到MetaMask，这样MetaMask初始会有100 ETH，足够测试用。