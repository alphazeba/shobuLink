
import src.dataAccess.GameTable as GameTable
import src.handler.eventIO.ddb as DDB

if False:
    ddb = DDB.initTest()
    gameTable = GameTable.newGameTable( ddb )
    print( "attempting to query the index" )
    print( "this actually queries the db" )
    print( GameTable.queryGamesByPlayerId( gameTable, "Flower") )