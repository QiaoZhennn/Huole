#~/bin/bash
NODE=$1
PASS=$2
KEY=$3

sudo rm -rf ./$NODE
mkdir -p $NODE

cd $NODE

geth --datadir . init ../genesis.json

echo $PASS > ./.pass
echo $KEY> ./.key

geth --datadir . account import --password ./.pass ./.key
geth --datadir . account list
