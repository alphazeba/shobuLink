import handler.eventIO.ddb as DDB

ARBITRARILY_CHOSEN_MAX_ROWS_TO_SCAN = 30

def newOpenGameTable( ddb ):
    return DDB.getTable( ddb, "OpenGameTable" )

def addOpenGame( openGameTable, openGameFormatGame ):
    openGameTable.put_item( Item=openGameFormatGame )

def listOpenGames( openGameTable ):
    response = openGameTable.scan(
        Limit=ARBITRARILY_CHOSEN_MAX_ROWS_TO_SCAN,
        Select='ALL_ATTRIBUTES',
    )
    return response['Items']

def closeOpenGame( openGameTable, gameId ):
    openGameTable.delete_item(
        Key={ "id": gameId }
    )