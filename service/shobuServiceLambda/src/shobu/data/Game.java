package shobu.data;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverted;
import shobu.data.sub.GameState;
import shobu.data.sub.GameStateDdbConverter;
import shobu.data.sub.Move;
import shobu.data.sub.PlayerSide;
import shobu.exception.ExceptionToReturn;
import shobu.util.Guid;
import shobu.util.Time;

import java.util.ArrayList;
import java.util.List;

@DynamoDBTable(tableName="GameTable")
public class Game {
    @DynamoDBHashKey(attributeName = "id")
    public String getId(){ return id; }
    public void setId( String id ){ this.id = id; }
    private String id;
    @DynamoDBAttribute(attributeName = "buId")
    public String getBuId(){ return buId; }
    public void setBuId( String buId ){ this.buId = buId; }
    private String buId;
    @DynamoDBAttribute(attributeName = "wuId")
    public String getWuId(){ return wuId; }
    public void setWuId( String wuId ){ this.wuId = wuId; }
    private String wuId;
    @DynamoDBAttribute(attributeName = "buName")
    public String getBuName(){ return buName; }
    public void setBuName( String buName ){ this.buName = buName; }
    private String buName;
    @DynamoDBAttribute(attributeName = "wuName")
    public String getWuName(){ return wuName; }
    public void setWuName( String wuName ){ this.wuName = wuName; }
    private String wuName;
    @DynamoDBAttribute(attributeName = "moves")
    public List<Move> getMoves(){ return moves; }
    public void setMoves( List<Move> moves ){ this.moves = moves; }
    private List<Move> moves;
    @DynamoDBAttribute(attributeName = "startTime")
    public long getStartTime(){ return startTime; }
    public void setStartTime( long startTime ){ this.startTime = startTime; }
    private long startTime;
    @DynamoDBTypeConverted(converter = GameStateDdbConverter.class)
    @DynamoDBAttribute(attributeName = "state")
    public GameState getState(){ return state; }
    public void setState( GameState state ){ this.state = state; }
    private GameState state;
    @DynamoDBAttribute(attributeName = "secs")
    public int getSecs(){ return secs; }
    public void setSecs( int secs ){ this.secs = secs; }
    private int secs;

    public Game(){
    }

    public Game(String id, String name, PlayerSide side, int timePerSide ){
        setPlayer( id, name, side );
        this.moves = new ArrayList<>();
        this.id = Guid.newGuid();
        this.secs = timePerSide;
        this.state = GameState.waitingForPlayer;
        this.startTime = Time.getNow();
    }

    private boolean gameIsJoinable(){
        return buId == null || wuId == null;
    }

    private boolean blackIsMissing(){
        return buId == null;
    }

    private PlayerSide getMissingPlayerSide(){
        if( blackIsMissing() ){
            return PlayerSide.black;
        }
        return PlayerSide.white;
    }

    public PlayerSide joinGame( String id, String name ) throws ExceptionToReturn {
        if( ! gameIsJoinable() ){
            throw new ExceptionToReturn( "Game is already full", 400 );
        }
        PlayerSide side = getMissingPlayerSide();
        setPlayer( id, name, side );
        state = GameState.blackMove;
        return side;
    }

    private void setPlayer( String id, String name, PlayerSide side ){
        if( side == PlayerSide.black ){
            this.buId = id;
            this.buName = name;
        }
        else {
            this.wuId = id;
            this.wuName = name;
        }
    }
}
