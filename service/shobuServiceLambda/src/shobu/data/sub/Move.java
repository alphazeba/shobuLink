package shobu.data.sub;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;

@DynamoDBDocument
public class Move {
    @DynamoDBAttribute(attributeName = "fullMove")
    public String getFullMove(){ return fullMove; }
    public void setFullMove( String fullMove ){ this.fullMove = fullMove; }
    private String fullMove;
    @DynamoDBAttribute(attributeName = "time")
    public long getTime(){ return time; }
    public void setTime( long time ){ this.time = time; }
    private long time;
}
