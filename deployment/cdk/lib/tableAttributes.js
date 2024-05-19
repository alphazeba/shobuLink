


// original definitions can be found in service/.../Game.py
const gameTableKey = {
    blackId: 'buId',
    blackName: 'buName',
    whiteId: 'wuId',
    whiteName: 'wuName',
    phaseTime: 'phsT',
    preview: 'prv',
    gameId: 'id',
    gameState: 'state',
    startTime: 'startTime',
}

const connectionTableKey = {
    playerId: 'pid',
    gameId: 'gid',
    expirationTimestamp: 'ttl',
}

module.exports = { gameTableKey, connectionTableKey }