# Overview
The idea here is to create an online shobu server similar to chess servers ie lichess.  Though the scope of shobu2 would be much smaller.


# Goals
- create an online playable shobu game
- minimal upkeep costs
- practice fully cloud native building styles
- use cdk instead of manual resource magagement
- make scripts to fully automate updates to the service

# Architecture
## Client hosting
will be storing the web client in an s3 bucket.
example details
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/website-hosting-custom-domain-walkthrough.html (how to set url)
- https://aws.amazon.com/getting-started/projects/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/module-1/ ( tutorial for getting s3 bucket setup ) ( this is also good for getting the rest of the project setup. This would be a good base to use )
- very helpful document for using the python sdk (https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/python/example_code/dynamodb/GettingStarted/scenario_getting_started_movies.py)

- might be a fix for the Decimal issue https://stackoverflow.com/questions/43678946/python-3-x-cannot-serialize-decimal-to-json

## API
### Commands
- createGame( loginToken, userId, userName, side, secondsPerSide )
    - return gameId
- joinGame( loginToken, userId, userName, gameId )
    - return side
- getGame( gameId )
    - return: game
- getPlayerGames( player )
    - return: [ game, ... ]
- getRecentGames( )
    - return: [ game, ... ]
- playMove( gameId, move, loginToken, userId )
    - return: updateGame
- createUser( userName, password )
    - return: userId
- login( userName, password )
    - return: loginToken

## Database
Will be using DynamoDB (DDB)
### Tables
- UserTable
    - id
    - name ( must be unique )
    - saltHash

- LoginToken
    - token
    - lastRefreshTime
    - userId
    - originalCreationTime

- GameTable
    - id
    - black
    - white
    - moves[]
    - startTime
    - state

### special types
- State
    - active
        - b/w'sMove
    - complete
        - b/wResign
        - b/wWin
        - draw
        - b/wTimeout

- Move
    - fullMove: string
    - time

## System design

![Design image](https://d1.awsstatic.com/Test%20Images/Kate%20Test%20Images/Serverless_Web_App_LP_assets_04.76030d61413ff43bd6aa75fbd16e02ad23aec67a.png)

Hopefully we actually get something in here soon.



# Testing plan

Right now the tests are mostly happening at the lambda input/output interfaces.
both coming into the lambda function as an event and interacting with the dynamodb tables.
setting up testing harnesses in order to run these things locally is intensive so i don't really plan to do it.

Current test procedure is that i've got some test events prepped on the lambda functions.
I then compile the artifacts and run `cdk synth && cdk deploy --profile cliAdmin` to publish the new changes.  It might be smart to have a production account.  Right now i've just got my personal account, but it seems that to test would require that i do it in the cloud.  I should configure 2 stages.  My current stage which deploys to my personal account which will become the gamma stage. and then a second stage that will be considered production.



# dev log.
01-15
I have succesfully managed to understand the interfaces between events/lambda and lambda/dynamodb in the java sdk now. But now that i've been testing the actual lambda functions i am not very excited about the results.

running the cold start is taking around 30seconds.  I read some articles on how to improve the startup times, provide the region manually (so it doesn't have to look around), provide the environment credentials ( again so it doesn't have to look around), recycle the client so it only needs to be built a single time and then can be reused for the lifecycle of the function.

So at this point in time running the functions ( createGame, joinGame, getGame ) take about 100ms, but the cold start is still a giant 30seconds.  This all seems to have to do with the interaction between the lamdba function and the dynamodb specific portions of the application.  Building the ddbClient in the first place i measured to be takign around 14seconds.  And then making the first call to the db is takign ~10seconds.  These are both incredibly inappropriate timelines.  I do not really understand why these are so giant.  From what i've looked around on the internet, people complain about cold starts, but do not seem to be experiencing the giant waits that i am seeing. Further i am having difficulty trying to figure out how to get better readings out of the dynamodb sdk.  Idk what's taking so long.

I will now attempt to write the service in python.
