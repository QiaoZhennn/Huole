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

ENV password: 'todamoon1'
ENV privatekey: '9f8eb96f1dabed2008831dd6c04a0814b3daaf36a823ffe366ddd8c42c04d0dc'
RUN echo $password > ./node1/.accountpassword \
    && echo $privatekey > ./node1/.privatekey \
    && geth account import --datadir node1/ --password ./node1/.accountpassword  ./node1/.privatekey

ENV address: '0x158105f19def1777582cdaebb593326e2156f0b8'
ENV bootnodeId: '84ba012c18d64c6b128e0d4052f2e444ca9cf7068f4938adc4fdaadb367449fade42a7546247faa45069bdef7428d4c46e2ee7d71840e15e7d478aeaa21395c4'
ENV bootnodeIp: '172.18.14.10'

CMD exec geth --datadir node1/ --syncmode 'full' --port 30311 --rpc --rpcaddr '0.0.0.0' --rpcport 8501 --rpccorsdomain "*" --rpcapi 'personal,db,eth,net,web3,txpool,miner' --bootnodes "enode://$bootnodeId@$bootnodeIp:30310" --networkid 888 --gasprice '1' --etherbase $address --unlock $address --password node1/.accountpassword --mine

EXPOSE 8501
EXPOSE 30311
