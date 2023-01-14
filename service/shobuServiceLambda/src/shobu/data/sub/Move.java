package shobu.data.sub;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBDocument;
import java.util.Date;

@DynamoDBDocument
public class Move {
    @DynamoDBAttribute(attributeName = "fullMove")
    public String fullMove;
    @DynamoDBAttribute(attributeName = "time")
    public Date time;
}
