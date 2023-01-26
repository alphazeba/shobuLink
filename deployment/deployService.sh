#!/bin/zsh

echo hello, deploying the service.
baseDirectory=$(pwd)

# run tests in the project
cd ../service/pyShobuService
./runTests.sh
if [[ $? = 0 ]]; then 
    echo tests passed
else 
    echo the tests failed
    return 1
fi

# run deployment script
cd ${baseDirectory}
cd ./cdk
cdk synth && cdk deploy --profile cliAdmin


# 
echo deployment complete