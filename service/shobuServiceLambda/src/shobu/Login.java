package shobu;


import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import shobu.data.LoginToken;
import shobu.data.User;
import shobu.dataAccess.LoginTokens;
import shobu.dataAccess.TestUsers;
import shobu.dataAccess.Users;
import shobu.exception.ExceptionToReturn;
import shobu.exception.KeyNotFoundException;
import shobu.util.Crypto;
import shobu.util.Parser;

import shobu.io.general.GatewayInput;
import shobu.io.general.GatewayOutput;
import shobu.io.LoginRequest;
import shobu.io.LoginResponse;

public class Login implements RequestHandler<GatewayInput, GatewayOutput>{

    private Users users = new TestUsers();
    private LoginTokens loginTokens = new LoginTokens();
    private Crypto crypto = new Crypto();

    public GatewayOutput handleRequest( final GatewayInput rawInput, final Context context ){
        try {
            LoginResponse response = run( Parser.fromJson(rawInput.body, LoginRequest.class ) );
            return new GatewayOutput(
                    Parser.toJson( response ),
                    GatewayOutput.buildSimpleHeaders("application/json"),
                    200
            );
        }
        catch( JsonProcessingException e ){
            return new ExceptionToReturn("Issue parsing request input or potentially serializing output lel", 403 ).output;
        }
        catch( ExceptionToReturn e ){
            return e.output;
        }
    }

    private LoginResponse run( LoginRequest request ) throws ExceptionToReturn {
       User user;
        try{
            // find the username in the user table
            user = users.getUserByName( request.userName );
        }
        catch( KeyNotFoundException e ){
            throw new ExceptionToReturn( "Could not find user name", 401 );
        }
        // hash the provided password and see if it matches the one in the user table.
        if( !crypto.checkMatch( user.saltHash, request.password ) ){
            throw new ExceptionToReturn( "Password did not match", 401 );
        }
        // need to return a login token.
        LoginToken loginToken = loginTokens.LoginUser( user.id );
        return new LoginResponse( user.id, loginToken.token );
    }
}