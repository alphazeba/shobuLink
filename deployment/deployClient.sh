#!/bin/zsh

echo hello
baseDirectory=$(pwd)
echo running from ${baseDirectory}
echo building client program
cd ../client/shobu_client
npm run build