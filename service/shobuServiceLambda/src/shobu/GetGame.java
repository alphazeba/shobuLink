package shobu;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import shobu.data.Game;
import shobu.dataAccess.Games;
import shobu.exception.ExceptionToReturn;
import shobu.util.Parser;

import shobu.io.general.GatewayInput;
import shobu.io.general.GatewayOutput;
import shobu.io.GetGameRequest;
import shobu.io.GetGameResponse;

public class GetGame implements RequestHandler<GatewayInput,GatewayOutput>{

    public GatewayOutput handleRequest( final GatewayInput rawInput, final Context context ){
        try {
            GetGameResponse response = run(Parser.fromJson(rawInput.body, GetGameRequest.class));
            return new GatewayOutput(
                    Parser.toJson(response),
                    GatewayOutput.buildSimpleHeaders("application/json"),
                    200
            );
        }
        catch( JsonProcessingException e ){
            return new ExceptionToReturn("Issue parsing json", 403 ).output;
        }
    }

    private GetGameResponse run( GetGameRequest request ){
        // query GameTable for the game id.
        Game game = Games.getGames().getGame( request.gameId );
        // return the game if it exists.
        return new GetGameResponse( game );
    }
}
