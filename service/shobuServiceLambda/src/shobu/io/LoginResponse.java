package shobu.io;

public class LoginResponse {

    public LoginResponse( String userId, String token ){
        loginToken = token;
        this.userId = userId;
    }

    public String loginToken;
    public String userId;
}
