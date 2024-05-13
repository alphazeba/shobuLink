import logic.Game as Game
import dataAccess.GameTable as GameTable
from handler.eventIO.eventValidation import getValidatedOptionValue, getValidatedRangeValue, getValidatedStringValue, getOptionalValidatedOptionValue
import data.playerSide as PlayerSide

VALID_TIME_MODES = [
    Game._rules_timeMode_standard,
    Game._rules_timeMode_correspondance
]

def CreateGame( event, context, props ):
    # validate incoming data
    loginToken = getValidatedStringValue( "loginToken", event )
    playerId = getValidatedStringValue( "userId", event )
    playerName = getValidatedStringValue( "userName", event )
    playerSide = getValidatedOptionValue( "side", event, PlayerSide.options )
    secondsPerSide = getValidatedRangeValue( "secondsPerSide", event, 10, 20 * 60 )
    timeMode = getOptionalValidatedOptionValue(
        "timeMode", event, 
        VALID_TIME_MODES, 
        Game._rules_timeMode_standard )
    gameTable = props["gameTable"]
    game = None
    if timeMode == Game._rules_timeMode_correspondance:
        game = Game.new_correspondance_game( playerId, playerName, playerSide, secondsPerSide )
    else:
        game = Game.new_standard_game( playerId, playerName, playerSide, secondsPerSide )
    # save the game object in ddb table.
    GameTable.saveGame( gameTable, game )
    return { "gameId": Game.getId( game ) }