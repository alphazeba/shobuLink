
import data_playerSide as PlayerSide
import data_gameState as GameState
from exception_ExceptionToReturn import ExceptionToReturn
import util_time as time
from util_guid import newGuid
import data_move as Move

_id = "id"
_buId = "buId"
_buName = "buName"
_wuId = "wuId"
_wuName = "wuName"
_moves = "moves"
_startTime = "startTime"
_state = "state"
_secs = "secs"

def new( playerId, playerName, playerSide, secondPerSide ):
    this = {
        _id: newGuid(),
        _secs: secondPerSide,
        _state: GameState.waitingForPlayer,
        _startTime: time.getNow(),
        _moves: [],
    }
    _setPlayer( this, playerId, playerName, playerSide )
    return this

def joinGame( this, playerId, playerName ):
    if not _isJoinable( this ):
        raise ExceptionToReturn( "Game is already full", 400 )
    side = _getMissingPlayerSide( this )
    _setPlayer( this, playerId, playerName, side )
    this[_startTime] = time.getNow()
    this[_state] = GameState.blackMove
    return side

def playMove( this, playerSide, fullMove ):
    if not _isPlayersTurn( this, playerSide ):
        raise ExceptionToReturn( "It is not the player's turn", 403 )
    move = Move.new( fullMove )
    # validate that the player is not already out of time 
    # TODO should update the game table with the fact the other player won.
    # validate the move is legal
    # TODO should throw error that the move is not legal.
    # make the move
    _addMove( this, move )

def _addMove( this, move ):
    this[_moves].append( move )

def get( this, key ):
    if key in this:
        return this[key]
    return None

def getId( this ):
    return get(this,_id)

def getState( this ):
    return get(this,_state)

def getPlayerSide( this, playerId ):
    if playerId == get( this, _buId ):
        return PlayerSide.black
    elif playerId == get( this, _wuId ):
        return PlayerSide.white
    else:
        raise ExceptionToReturn( "Player is not in the game", 403 )

def _isPlayersTurn( this, playerSide ):
    state = getState( this )
    return playerSide == PlayerSide.black and state == GameState.blackMove \
        or playerSide == PlayerSide.white and state == GameState.whiteMove

def _isJoinable( this ):
    return get(this,_buId) == None or get(this,_wuId) == None

def _blackIsMissing( this ):
    return get(this,_buId) == None

def _getMissingPlayerSide( this ):
    if( _blackIsMissing( this ) ):
        return PlayerSide.black
    return PlayerSide.white

def _setPlayer( this, playerId, playerName, side ):
    if( side == PlayerSide.black ):
        this[_buId] = playerId
        this[_buName] = playerName
    else:
        this[_wuId] = playerId
        this[_wuName] = playerName