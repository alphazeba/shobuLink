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
import data.preview as prv

_id = "id"
_buId = "buId"
_buName = "buName"
_wuId = "wuId"
_wuName = "wuName"
_moves = "moves"
_startTime = "startTime"
_state = "state"
_secs = "secs"
_preview = "prv"
_phaseTime = "phsT"
_userId = "userId"
_gameId = "gameId"
_opponentId = "oId"
_opponentName = "oName"
_userSide = "userSide"
_rules = "rules"

_rules_timeMode = "tm"
_rules_timeMode_correspondance = "cor"
_rules_timeMode_standard = "std" # standard games do not have a timeMode, this is for internal usage

# main interactions
def toGetGameOutputForm( gameTableGame, latestTimeStamp ):
    output = _filterObjByKeys( gameTableGame, [
        _id,
        _buId,
        _wuId,
        _buName,
        _wuName,
        _startTime,
        _state,
        _secs,
        _rules,
    ] )
    outputMoves = []
    for move in gameTableGame[_moves]:
        if Move.getTime(move) > latestTimeStamp:
            outputMoves.append( move )
    output[_moves] = outputMoves
    return output

def toGetPlayerGamesOutputForm( gameTablePreview ):
    output = _filterObjByKeys( gameTablePreview, [
        _userId,
        _startTime,
        _preview,
        _gameId,
        _opponentId,
        _opponentName,
        _userSide,
        _state,
    ] )
    return output

def new_standard_game( playerId, playerName, playerSide, seconds ):
    this = {
        _id: newGuid(),
        _secs: seconds,
        _state: GameState.waitingForPlayer,
        _startTime: time.getNowMs(),
        _moves: [],
    }
    _updatePhaseTime( this )
    _setPreviewBoard( this, B.initBoard() )
    _setPlayer( this, playerId, playerName, playerSide )
    return this

def new_correspondance_game( playerId, playerName, playerSide, secondsPerTurn):
    this = new_standard_game( playerId, playerName, playerSide, secondsPerTurn)
    this[_rules] = {
        _rules_timeMode: _rules_timeMode_correspondance
    }
    return this

def joinGame( this, playerId, playerName ):
    if not _isJoinable( this ):
        raise ExceptionToReturn( "Game is already full", 400 )
    side = _getMissingPlayerSide( this )
    _setPlayer( this, playerId, playerName, side )
    setStartTime( this, time.getNowMs() )
    setGameState( this, GameState.blackMove )
    return side

def playMove( this, playerSide, moveString ):
    if not _isPlayersTurn( this, playerSide ):
        raise ExceptionToReturn( "It is not the player's turn", 403 )
    fullMove = mp.parseMove( moveString )
    board = _getCurrentBoardState( this )
    if not mv.validateFullMove( board, fullMove ):
        raise ExceptionToReturn( "MOVE NOT LEGAL", 403 )
    board = B.makeValidatedMove( board, fullMove )
    _addMove( this, Move.new( moveString ), board )
    _handleGameOverCheck( this, board )

def setTimeout(this):
    if GameState.isBlacksMove(this[_state]):
        setGameState(this, GameState.blackTimeout)
    else:
        setGameState(this, GameState.whiteTimeout)

def isGameOutOfTime( this ):
    timeMode = getTimeMode(this)
    if timeMode == _rules_timeMode_correspondance:
        return _isGameOutOfTime_correspondance(this)
    return _isGameOutOfTime_standard(this)

def _isGameOutOfTime_correspondance(this):
    timeControlMs = getSecsMs(this)
    latestTimeStamp = getLatestMoveTimestamp(this)
    deltaMs = _timeSinceTimestampMs(latestTimeStamp)
    return timeControlMs < deltaMs

def _isGameOutOfTime_standard(this):
    # check if the player whose turn it is, is out of time
    # check if game is active
    gameState = getGameState(this)
    if not GameState.isActive(gameState):
        return False
    # get how much time they've used
    blackTime, whiteTime = _getPlayerTotalUsedTimeMs(this)
    curPlayerUsedTimeMs = whiteTime
    if GameState.isBlacksMove(gameState):
        curPlayerUsedTimeMs = blackTime
    timeControlMs = getSecsMs(this)
    print("blackTime: ", blackTime,
        " whiteTime: ", whiteTime,
        " curPlayerTime: ", curPlayerUsedTimeMs,
        " timeControlMs: ", timeControlMs)
    return timeControlMs < curPlayerUsedTimeMs

# private
def _filterObjByKeys( obj, keys ):
    output = {}
    for key in keys:
        if key in obj:
            output[key] = obj[key]
    return output

def _handleGameOverCheck( this, board ):
    winResult = gameover.checkForWin( board )
    if winResult == t.SIDE_BLACK:
        setGameState( this, GameState.blackWon )
    elif winResult == t.SIDE_WHITE:
        setGameState( this, GameState.whiteWon )

# checks
def _isPlayersTurn( this, playerSide ):
    state = getGameState( this )
    return playerSide == PlayerSide.black and state == GameState.blackMove \
        or playerSide == PlayerSide.white and state == GameState.whiteMove

def _isJoinable( this ):
    return get(this,_buId) == None or get(this,_wuId) == None

def _blackIsMissing( this ):
    return get(this,_buId) == None

# getter setter
def get( this, key ):
    if key in this:
        return this[key]
    return None

def getSecs( this ):
    return get(this,_secs)

def getSecsMs( this ):
    return getSecs(this) * 1000

def getLatestMoveTimestamp( this ):
    moves = getMoves(this)
    if len(moves) <= 0:
        return getStartTime(this)
    return Move.getTime(moves[-1])

def getId( this ):
    return get(this,_id)

def getRules( this ):
    return get(this, _rules)

def getMoves( this ):
    return get(this, _moves)

def getTimeMode( this ):
    rules = getRules(this)
    if rules is None:
        return _rules_timeMode_standard
    timeMode = get(rules, _rules_timeMode)
    if timeMode is None:
        return _rules_timeMode_standard
    return timeMode

def getGameState( this ):
    return get(this,_state)

def setGameState( this, gameState ):
    this[_state] = gameState
    _updatePhaseTime( this )

def getPlayerSide( this, playerId ):
    if playerId == get( this, _buId ):
        return PlayerSide.black
    if playerId == get( this, _wuId ):
        return PlayerSide.white
    raise ExceptionToReturn( "Player is not in the game", 403 )

def getStartTime( this ) -> int:
    return this[_startTime]

def setStartTime( this, startTime ):
    this[_startTime] = startTime
    _updatePhaseTime( this )

def _getPreviewBoard( this ):
    preview = get( this, _preview )
    if preview != None:
        return prv.previewToBoard( preview )
    return None

def _setPreviewBoard( this, board ):
    this[_preview] = prv.boardToPreview( board )

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

def _flipTurn( this ):
    if this[_state] == GameState.blackMove:
        setGameState( this, GameState.whiteMove )
    elif this[_state] == GameState.whiteMove:
        setGameState( this, GameState.blackMove )

def _getCurrentBoardState( this ):
    board = _getPreviewBoard( this )
    if board != None:
        return board
    board = _buildBoardFromMoves( this )
    _setPreviewBoard( this, board )
    return board

def _buildBoardFromMoves( this ):
    board = B.initBoard()
    for move in this[_moves]:
        shobuMove = mp.parseMove( Move.getFullMove( move ) )
        board = B.makeValidatedMove( board, shobuMove )
    return board

def _addMove( this, move, newBoard ):
    this[_moves].append( move )
    _flipTurn( this )
    _setPreviewBoard( this, newBoard )

def _updatePhaseTime( this ):
    this[_phaseTime] = GameState.getPhase( getGameState( this ) ) + str( this[_startTime] )

def _getPlayerTotalUsedTimeMs( this ):
    blackTime, whiteTime = 0, 0
    lastTimestamp = getStartTime(this)
    isBlackSide = True
    for move in this[_moves]:
        curTimestamp = Move.getTime(move)
        delta = curTimestamp - lastTimestamp
        lastTimestamp = curTimestamp
        if (isBlackSide):
            blackTime += delta
        else:
            whiteTime += delta
        isBlackSide = not isBlackSide
    # handle time elapsed since last move
    extraTime = _timeSinceTimestampMs( lastTimestamp )
    if isBlackSide:
        blackTime += extraTime
    else:
        whiteTime += extraTime
    return blackTime, whiteTime

def _timeSinceTimestampMs(timeStampMs):
    return time.getNowMs() - timeStampMs