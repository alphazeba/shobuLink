package shobu;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import shobu.util.Parser;

import shobu.io.general.GatewayInput;
import shobu.io.general.GatewayOutput;
import shobu.io.GetGameRequest;
import shobu.io.GetGameResponse;

public class GetGame implements RequestHandler<GatewayInput,GatewayOutput>{
    public GatewayOutput handleRequest( final GatewayInput rawInput, final Context context ){
        GetGameResponse response = run( Parser.fromJson( rawInput.body, GetGameRequest.class ) );
        return new GatewayOutput(
                Parser.toJson( response ),
                GatewayOutput.buildSimpleHeaders("application/json"),
                200
        );
    }

    private GetGameResponse run( GetGameRequest request ){

        // query GameTable for the game id.

        // return the game if it exists.


        GetGameResponse response = new GetGameResponse();
        response.text = "Hello World.";
        return response;
    }
}
