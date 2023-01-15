package shobu.dataAccess;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import shobu.data.Game;
import shobu.data.sub.PlayerSide;

import shobu.exception.ExceptionToReturn;
import shobu.util.Log;

public class Games {
    private static Games games;
    public static Games getGames(){
        if( games == null ){
            games = new Games();
        }
        return games;
    }

    private final DynamoDBMapper gameTableMapper;

    private Games(){
        Log.log("building the Games mapper");
        gameTableMapper = new DynamoDBMapper( ReusableDdbClient.getClient() );
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
        return game.getId();
    }

    public PlayerSide joinGame( String playerId, String playerName, String gameId ) throws ExceptionToReturn {
        Game game = getGame( gameId );
        PlayerSide side = game.joinGame( playerId, playerName );
        gameTableMapper.save( game );
        return side;
    }
}
