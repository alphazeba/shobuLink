
import eventIo.ddb as ddb

gameTable = ddb.getTable( "GameTable" )

def getGame( gameId ):
    response = gameTable.get_item( Key={ 'id': gameId } )
    return response['Item']

def saveGame( game ):
    gameTable.put_item( Item=game )