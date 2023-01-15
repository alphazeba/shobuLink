package shobu.data.sub;

public enum GameState {
    // pending
    waitingForPlayer,
    // active
    blackMove, whiteMove,
    // complete
    blackResigned, whiteResigned,
    blackWon, whiteWon,
    blackTimeout, whiteTimeout,
    draw;
    public boolean isActive( GameState state ){
        return state == blackMove || state == whiteMove;
    }
    public boolean isComplete( GameState state ){
        return ! isActive( state );
    }
}