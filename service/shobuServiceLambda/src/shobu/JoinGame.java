package shobu;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import shobu.data.sub.PlayerSide;
import shobu.dataAccess.Games;
import shobu.dataAccess.LoginTokens;
import shobu.exception.ExceptionToReturn;
import shobu.io.JoinGameRequest;
import shobu.io.JoinGameResponse;
import shobu.io.general.GatewayInput;
import shobu.io.general.GatewayOutput;
import shobu.util.Parser;

public class JoinGame implements RequestHandler<GatewayInput, GatewayOutput> {
    private final LoginTokens loginTokens = new LoginTokens();
    private Games games;

    public GatewayOutput handleRequest( final GatewayInput rawInput, final Context context ){
        games = new Games( context );
        try {
            JoinGameResponse response = run(Parser.fromJson(rawInput.body, JoinGameRequest.class));
            return new GatewayOutput(
                    Parser.toJson(response),
                    GatewayOutput.buildSimpleHeaders("application/json"),
                    200
            );
        }
        catch( ExceptionToReturn e ){
            return e.output;
        }
    }

    private JoinGameResponse run(JoinGameRequest request ) throws ExceptionToReturn {
        loginTokens.VerifyLogin( request.userId, request.loginToken );
        PlayerSide side = games.joinGame( request.userId, request.userName, request.gameId );
        return new JoinGameResponse( side );
    }
}
