package shobu.dataAccess;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import shobu.data.Game;
import shobu.data.sub.PlayerSide;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;


import com.amazonaws.services.lambda.runtime.Context;

import java.util.Map;

public class Games {

    public Games( Context context ){
        Map<String,String> env = context.getClientContext().getEnvironment();
        String gameTableName = env.get( "GameTable" );
        String region = env.get( "region" );
        AmazonDynamoDB ddb = AmazonDynamoDBClientBuilder.standard().withRegion( region ).build();
    }

    public String createGame(String playerId, String playerName, PlayerSide side, int timePerSide ){
        Game game = new Game( playerId, playerName, side, timePerSide );
        // needs to put itself in the cloud.
        return game.id;
    }
}
