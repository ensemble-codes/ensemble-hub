#!/bin/bash

pkill -f "hardhat node"

rm -rf cache
rm -rf ignition/deployments/chain-31337

npx hardhat node &

sleep 3

npx hardhat run scripts/deploy.ts --network localhost 