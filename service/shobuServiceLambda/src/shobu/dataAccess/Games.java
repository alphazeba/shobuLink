package shobu.dataAccess;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import shobu.data.Game;
import shobu.data.sub.PlayerSide;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;


import com.amazonaws.services.lambda.runtime.Context;
import shobu.exception.ExceptionToReturn;
import shobu.util.DdbHelper;
import shobu.util.Log;

import java.util.Map;

public class Games {

    private final String gameTableName;
    private final DynamoDBMapper gameTableMapper;

    public Games( Context context ){
        Log.log("grabbing gameTbaleName" );
        gameTableName = System.getenv( "gameTableName" );
        Log.log("grabbing region");
        String region = System.getenv( "region" );
        Log.log("building the client");
        AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
        Log.log("building the mapper");
        gameTableMapper = new DynamoDBMapper( client );
        Log.log("finished init Games");
    }

    public Game getGame( String gameId ){
        return gameTableMapper.load( Game.class, gameId );
    }

    public String createGame(String playerId, String playerName, PlayerSide side, int timePerSide ){
        Log.log("entering Games createGame");
        Game game = new Game( playerId, playerName, side, timePerSide );
        Log.log("game created, and now attempting to save the game to the table.");
        // needs to put itself in the cloud.
        gameTableMapper.save( game );
        Log.log("succesfully saved the game to the table");
        return game.id;
    }

    public PlayerSide joinGame( String playerId, String playerName, String gameId ) throws ExceptionToReturn {
        Game game = getGame( gameId );
        PlayerSide side = game.joinGame( playerId, playerName );
        gameTableMapper.save( game );
        return side;
    }
}
