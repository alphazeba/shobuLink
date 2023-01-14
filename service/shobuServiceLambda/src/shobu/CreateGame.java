package shobu;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import shobu.dataAccess.Games;
import shobu.dataAccess.LoginTokens;
import shobu.exception.ExceptionToReturn;
import shobu.io.CreateGameRequest;
import shobu.io.CreateGameResponse;
import shobu.io.general.GatewayInput;
import shobu.io.general.GatewayOutput;
import shobu.util.Parser;

public class CreateGame implements RequestHandler<GatewayInput,GatewayOutput> {
    private LoginTokens loginTokens = new LoginTokens();
    private Games games;

    public GatewayOutput handleRequest(final GatewayInput rawInput, final Context context ){
        games = new Games( context );
        try{
            CreateGameResponse response = run( Parser.fromJson( rawInput.body, CreateGameRequest.class ) );
            return new GatewayOutput(
                    Parser.toJson( response ),
                    GatewayOutput.buildSimpleHeaders("application/json"),
                    200
            );
        }
        catch( ExceptionToReturn e ){
            return e.output;
        }
    }

    private CreateGameResponse run( CreateGameRequest request ) throws ExceptionToReturn {
        loginTokens.VerifyLogin(request.userId, request.loginToken);
        // need to handle actually creating a game.
        String gameId = games.createGame(  request.userId, request.userName, request.getSide(), request.timePerSide );
        return new CreateGameResponse( gameId );
    }
}
