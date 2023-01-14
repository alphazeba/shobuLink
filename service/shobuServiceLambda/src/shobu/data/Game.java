package shobu.data;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import java.util.Date;
import shobu.data.sub.GameState;
import shobu.data.sub.Move;
import shobu.data.sub.PlayerSide;
import shobu.exception.ExceptionToReturn;
import shobu.util.Guid;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.amazonaws.services.dynamodbv2.model.AttributeValue;
@DynamoDBTable(tableName="GameTable")
public class Game {
    @DynamoDBHashKey(attributeName = "id")
    public String id;
    @DynamoDBAttribute(attributeName = "buId")
    public String buId;
    @DynamoDBAttribute(attributeName = "wuId")
    public String wuId;
    @DynamoDBAttribute(attributeName = "buName")
    public String buName;
    @DynamoDBAttribute(attributeName = "wuName")
    public String wuName;
    @DynamoDBAttribute(attributeName = "moves")
    public List<Move> moves;
    @DynamoDBAttribute(attributeName = "startTime")
    public Date startTime;
    @DynamoDBAttribute(attributeName = "state")
    public GameState state;
    @DynamoDBAttribute(attributeName = "secs")
    public int secs;

    public Game(){
    }

    public Game(String id, String name, PlayerSide side, int timePerSide ){
        setPlayer( id, name, side );
        this.moves = new ArrayList<>();
        this.id = Guid.newGuid();
        this.secs = timePerSide;
        this.state = GameState.waitingForPlayer;
        this.startTime = new Date();
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
