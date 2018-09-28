FROM ubuntu:xenial

RUN apt-get update \
    && apt-get install -y software-properties-common \
    && add-apt-repository -y ppa:ethereum/ethereum \
    && apt-get update \
    && apt-get install -y ethereum \
    && mkdir -p /home/ubuntu/sunnynet_node_test/node1

WORKDIR "/home/ubuntu/sunnynet_node_test"

ADD ./genesis.json ./genesis.json
RUN geth init genesis.json

ARG password
ARG privatekey
RUN echo $password > ./node1/.accountpassword \
    && echo $privatekey > ./node1/.privatekey \
    && geth account import --datadir node1/ --password ./node1/.accountpassword  ./node1/.privatekey

ARG address
ARG bootnodeId
ARG bootnodeIp

CMD exec geth --datadir node1/ --syncmode 'full' --port 30311 --rpc --rpcaddr '0.0.0.0' --rpcport 8501 --rpccorsdomain "*" --rpcapi 'personal,db,eth,net,web3,txpool,miner' --bootnodes "enode://$bootnodeId@$bootnodeIp:30310" --networkid 888 --gasprice '1' --etherbase $address --unlock $address --password node1/.accountpassword --mine

EXPOSE 8501
EXPOSE 30311
