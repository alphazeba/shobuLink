import util.time as time

_pid = "pid"
_gid = "gid"
_ttl = "ttl"

_INDEX_BY_GAME = "ConnectionTableByGameId"

_CONNECTION_TIMEOUT_MINS = 3

def new( playerId, gameId ):
    this = {
        _pid: playerId,
        _gid: gameId,
        _ttl: time.getNowSeconds() + _CONNECTION_TIMEOUT_MINS * 60,
    }
    return this