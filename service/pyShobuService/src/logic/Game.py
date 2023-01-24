
import data.playerSide as PlayerSide
import data.gameState as GameState
from exception.ExceptionToReturn import ExceptionToReturn
import util.time as time
from util.guid import newGuid
import data.move as Move
import logic.shobu.board as B
import logic.shobu.moveValidation as mv
import logic.shobu.moveParser as mp
import logic.shobu.gameoverChecker as gameover
import logic.shobu.token as t

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

def playMove( this, playerSide, moveString ):
    if not _isPlayersTurn( this, playerSide ):
        raise ExceptionToReturn( "It is not the player's turn", 403 )
    fullMove = mp.parseMove( moveString )
    # validate that the player is not already out of time 
    # TODO should update the game table with the fact the other player won.
    # validate the move is legal
    board = _getCurrentBoardState( this )
    # validate the new move.
    if not mv.validateFullMove( board, fullMove ):
        raise ExceptionToReturn( "MOVE NOT LEGAL", 403 )
    board = B.makeValidatedMove( board, fullMove )
    # add move to history sinces its legal.
    _addMove( this, Move.new( moveString ) )
    # check for win
    _handleGameOverCheck( this, board )

def _getCurrentBoardState( this ):
    board = B.initBoard()
    for move in this[_moves]:
        shobuMove = mp.parseMove( Move.getFullMove( move ) )
        board = B.makeValidatedMove( board, shobuMove )
    return board

def _addMove( this, move ):
    this[_moves].append( move )
    _flipTurn( this )

def _handleGameOverCheck( this, board ):
    winResult = gameover.checkForWin( board )
    if winResult != None:
        if winResult == t.SIDE_BLACK:
            this[_state] = GameState.blackWon
        elif winResult == t.SIDE_WHITE:
            this[_state] = GameState.whiteWon

def _flipTurn( this ):
    if this[_state] == GameState.blackMove:
        this[_state] = GameState.whiteMove
    elif this[_state] == GameState.whiteMove:
        this[_state] = GameState.blackMove

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