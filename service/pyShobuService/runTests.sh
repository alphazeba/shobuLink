#!/bin/zsh

myCutePython=~/opt/anaconda3/envs/py3_9_shobu/bin/python
testScript=pleaseUseRunTestshToRunTests.py

echo $(${myCutePython} --version)
echo ^^ this should be python 3.9 because that is what the cloud will use

echo "running tests"
${myCutePython} ./${testScript}
result=$?

./cleanPythonDirectory.sh
echo done testing
return $result