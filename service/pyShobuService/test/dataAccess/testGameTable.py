
import src.dataAccess.GameTable as GameTable
import src.handler.eventIO.ddb as DDB

if False:
    ddb = DDB.initTest()
    gameTable = GameTable.newGameTable( ddb )
    print( "attempting to query the index" )
    print( GameTable.queryGames( gameTable, "Flower") )