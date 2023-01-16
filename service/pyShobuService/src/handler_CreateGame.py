
import logic_Game as Game
import dataAccess_GameTable as GameTable
from io_event_validation import getValidatedOptionValue, getValidatedRangeValue, getValidatedStringValue
import data_playerSide as PlayerSide

def CreateGame( event, context ):
    # validate incoming data
    loginToken = getValidatedStringValue( "loginToken", event )
    playerId = getValidatedStringValue( "userId", event )
    playerName = getValidatedStringValue( "userName", event )
    playerSide = getValidatedOptionValue( "side", event, PlayerSide.options )
    secondsPerSide = getValidatedRangeValue( "secondsPerSide", event, 10, 20 * 60 )
    # verfiy logged in
    # TODO

    game = Game.new( playerId, playerName, playerSide, secondsPerSide )
    # save the game object in ddb table.
    GameTable.saveGame( game )
    return { "gameId": Game.getId( game ) }