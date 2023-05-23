import logic.Game as Game
import dataAccess.GameTable as GameTable
from handler.eventIO.eventValidation import getValidatedOptionValue, getValidatedRangeValue, getValidatedStringValue
import data.playerSide as PlayerSide

def CreateGame( event, context, props ):
    # validate incoming data
    loginToken = getValidatedStringValue( "loginToken", event )
    playerId = getValidatedStringValue( "userId", event )
    playerName = getValidatedStringValue( "userName", event )
    playerSide = getValidatedOptionValue( "side", event, PlayerSide.options )
    secondsPerSide = getValidatedRangeValue( "secondsPerSide", event, 10, 20 * 60 )
    # verfiy logged in
    # TODO
    gameTable = props["gameTable"]
    game = Game.new( playerId, playerName, playerSide, secondsPerSide )
    # save the game object in ddb table.
    GameTable.saveGame( gameTable, game )
    return { "gameId": Game.getId( game ) }