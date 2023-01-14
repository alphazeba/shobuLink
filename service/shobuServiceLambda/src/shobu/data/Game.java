package shobu.data;

import org.joda.time.DateTime;
import shobu.data.sub.GameState;
import shobu.data.sub.Move;
import shobu.data.sub.PlayerSide;
import shobu.exception.ExceptionToReturn;
import shobu.util.Guid;

import java.util.ArrayList;
import java.util.List;

public class Game {
    public String id;
    public String buId;
    public String wuId;
    public String buName;
    public String wuName;
    public List<Move> moves;
    public DateTime startTime;
    public GameState state;
    public int secs;

    public Game(){}

    public Game(String id, String name, PlayerSide side, int timePerSide ){
        setPlayer( id, name, side );
        moves = new ArrayList<>();
        id = Guid.newGuid();
        secs = timePerSide;
    }

    private boolean gameIsJoinable(){
        return buId == null || wuId == null;
    }

    private boolean blackIsMissing(){
        return buId == null;
    }

    public PlayerSide joinGame( String id, String name ) throws ExceptionToReturn {
        if( ! gameIsJoinable() ){
            throw new ExceptionToReturn( "Game is already full", 400 );
        }
        PlayerSide side = PlayerSide.white;
        if( blackIsMissing() ){
            side = PlayerSide.black;
        }
        setPlayer( id, name, side );
        return side;
    }

    private void setPlayer( String id, String name, PlayerSide side ){
        if( side == PlayerSide.black ){
            buId = id;
            buName = name;
        }
        else {
            wuId = id;
            wuName = name;
        }
    }
}
