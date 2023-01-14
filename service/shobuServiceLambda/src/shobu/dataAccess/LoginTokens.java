package shobu.dataAccess;

import shobu.data.LoginToken;
import shobu.exception.ExceptionToReturn;

import java.util.ArrayList;
import java.util.List;

public class LoginTokens {
    private String fakeLoginToken = "LOGGEDIN";
    private List<LoginToken> loginTokens = new ArrayList<>(){{
    }};

    public void VerifyLogin( String userId, String token ) throws ExceptionToReturn {
        if( !fakeLoginToken.equals(fakeLoginToken) ){
            throw new ExceptionToReturn( "Please login again", 401 );
        }
    }

    public LoginToken LoginUser(String userId ){
        LoginToken loginToken = new LoginToken( userId );
        loginToken.token = fakeLoginToken;
        loginTokens.add( loginToken );
        return loginToken;
    }
}
