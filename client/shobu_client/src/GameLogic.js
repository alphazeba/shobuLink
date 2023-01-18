


export const useGameState = ( gameId ) => {
    var curBoard = initBoard()
    var history = [
        curBoard
    ]
    return [ history ]
}

function initHistory(){

}

function initBoard(){
    return [
        [ initSubboard(), initSubboard() ],
        [ initSubboard(), initSubboard() ]
    ]
}

function initSubboard(){
    return [
        initRow(1),
        initRow(0),
        initRow(0),
        initRow(-1)
    ]
}

function initRow( token ){
    return [token, token, token, token ]
}