#!/bin/zsh

myCutePython=python
testScript=pleaseUseRunTestshToRunTests.py

echo $(${myCutePython} --version)
echo ^^ this should be python 3.9 because that is what the cloud will use

echo "running tests"
${myCutePython} ./${testScript}

./cleanPythonDirectory.sh

echo done