package shobu.dataAccess;

import shobu.data.LoginToken;

import java.util.ArrayList;
import java.util.List;

public class LoginTokens {
    private String fakeLoginToken = "LOGGEDIN";
    private List<LoginToken> loginTokens = new ArrayList<>(){{
    }};

    public boolean VerifyLogin( String userId, String token ){
        return fakeLoginToken.equals( fakeLoginToken );
    }

    public LoginToken LoginUser(String userId ){
        LoginToken loginToken = new LoginToken( userId );
        loginToken.token = fakeLoginToken;
        loginTokens.add( loginToken );
        return loginToken;
    }
}
