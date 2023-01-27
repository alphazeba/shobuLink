#!/bin/zsh

echo hello
baseDirectory=$(pwd)
echo running from ${baseDirectory}
echo building client program
cd ../client/shobu_client
npm run build

cd ${baseDirectory}
cd ./cdk 

serviceStack=ShobuClientStack
cdk synth ${serviceStack} && cdk deploy ${serviceStack} --profile cliAdmin
