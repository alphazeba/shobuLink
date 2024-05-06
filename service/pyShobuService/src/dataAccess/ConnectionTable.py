import handler.eventIO.ddb as DDB
from boto3.dynamodb.conditions import Key, Attr
import data.connection as connection
import util.time as time

def newConnectionTable( ddb ):
    return DDB.getTable( ddb, "ConnectionTable" )

def connectPlayer( connectionTable, playerId, gameId ):
    connectionTable.put_item( Item=connection.new(playerId, gameId) )

def disconnectPlayer( connectionTable, playerId ):
    connectionTable.delete_item(
        Key={
            connection._pid: playerId
        }
    )

# table docs: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb/table/index.html#table
def getConnectedPlayers( connectionTable, gameId ):
    result = connectionTable.query(
        IndexName=connection._INDEX_BY_GAME,
        Select='ALL_PROJECTED_ATTRIBUTES',
        # it is suggested to filter out expired items even with ttl on table set.
        # https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html
        KeyConditionExpression=Key(connection._gid).eq(gameId),
        FilterExpression=Attr(connection._ttl).gte(time.getNowSeconds()),
    )
    output = []
    for item in result['Items']:
        output.append(item[connection._pid])
    return output