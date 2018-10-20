# 基于私有链的去中心化信息发布平台
[产品定义](http://phabricator.huobidev.com/T32598)

## 命名规则

 - 合约全局变量：smallCamel_
 - 函数传入参数：_smallCamel
 - 函数内变量, Struct 内变量： smallCamel

## 如何运行
1. git clone
2. install required packages
    * cd to server/, npm install
    * cd to client/, npm install
    * cd to huole/, npm install
3. start app
    * cd to server/, vim .env
    * add: WALLET_ADDRESS=0x92***
    * add: WALLET_PRIVATE_KEY=c4e***
    * cd to huole/, truffle compile, truffle migrate
    * cd to server/, npm start
    * cd to client/, npm start

## 注意事项
1. 修改smart contract源文件后，要删除build目录，然后再truffle compile。否则MetaMask会报RPC相关错误。
