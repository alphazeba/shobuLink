import handler.eventIO.ddb as DDB
from boto3.dynamodb.conditions import Key, Attr
import logic.shobu.token as t
import data.playerSide as PlayerSide

def newGameTable( ddb ):
    return DDB.getTable( ddb, "GameTable" )

def getGame( gameTable, gameId ):
    response = gameTable.get_item( Key={ 'id': gameId } )
    return response['Item']

def saveGame( gameTable, game ):
    gameTable.put_item( Item=game )

def queryGamesByPlayerSide( gameTable, playerId, side ):
    indexName = 'blackGameIndex'
    keyName = 'buId'
    enemyIdName = 'wuId'
    enemyNameName = 'wuName'
    userSide = PlayerSide.black
    if side == t.SIDE_WHITE:
        indexName = 'whiteGameIndex'
        keyName = 'wuId'
        enemyIdName = 'buId'
        enemyNameName = 'buName'
        userSide = PlayerSide.white
    result = gameTable.query(
        IndexName=indexName,
        Select='ALL_PROJECTED_ATTRIBUTES',
        KeyConditionExpression=Key( keyName ).eq( playerId ) & Key( 'phsT' ).begins_with( 'c' )
    )
    output = []
    for item in result['Items']:
        outputItem = {
            "startTime": phaseTimeToStartTime( item['phsT'] ),
            "prv": item["prv"],
            "gameId": item["id"],
            "oName": item[enemyNameName],
            "oId": item[enemyIdName],
            "userSide": userSide
        }
        output.append( outputItem )
    return output

def phaseTimeToStartTime( phaseTime ):
    strippedPhaseTime = phaseTime[1:]
    return int( strippedPhaseTime )

def queryGamesByPlayerId( gameTable, playerId ):
    return queryGamesByPlayerSide( gameTable, playerId, t.SIDE_BLACK ) + queryGamesByPlayerSide( gameTable, playerId, t.SIDE_WHITE )