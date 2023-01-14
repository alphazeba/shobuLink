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

## API
### Commands
- createGame( loginToken, userId, userName, side )
    - return gameId
- getGame( id )
    - return: game
- getPlayerGames( player )
    - return: [ game, ... ]
- getRecentGames( )
    - return: [ game, ... ]
- playMove( gameId, move, loginToken )
    - return: success
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

I honestly do not know.  It would be best if most things had local unit tests.
And then i guess were just expected to work while on the real internet.

