package shobu.dataAccess;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import shobu.data.Game;
import shobu.data.sub.PlayerSide;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;


import com.amazonaws.services.lambda.runtime.Context;
import shobu.exception.ExceptionToReturn;
import shobu.util.DdbHelper;

import java.util.Map;

public class Games {

    private final String gameTableName;
    private final DynamoDBMapper gameTableMapper;

    public Games( Context context ){
        Map<String,String> env = context.getClientContext().getEnvironment();
        gameTableName = env.get( "gameTableName" );
        String region = env.get( "region" );
        gameTableMapper = new DynamoDBMapper(
                AmazonDynamoDBClientBuilder.standard().withRegion( region ).build(),
                DdbHelper.getTableNameOverrideConfig( gameTableName ) );
    }

    public Game getGame( String gameId ){
        return gameTableMapper.load( Game.class, gameId );
    }

    public String createGame(String playerId, String playerName, PlayerSide side, int timePerSide ){
        Game game = new Game( playerId, playerName, side, timePerSide );
        // needs to put itself in the cloud.
        gameTableMapper.save( game );
        return game.id;
    }

    public PlayerSide joinGame( String playerId, String playerName, String gameId ) throws ExceptionToReturn {
        Game game = getGame( gameId );
        PlayerSide side = game.joinGame( playerId, playerName );
        gameTableMapper.save( game );
        return side;
    }
}
