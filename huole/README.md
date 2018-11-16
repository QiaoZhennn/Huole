# 基于私有链的去中心化信息发布平台
[产品定义](http://phabricator.huobidev.com/T32598)

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
3. 如果需要部署客户端到 staging 和 prod 的生产环境，参照 client/README.md
