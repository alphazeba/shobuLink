package shobu.data;

import org.joda.time.DateTime;

public class LoginToken {
    public String token;
    public DateTime lastRefreshTime;
    public String userId;
    public DateTime originalCreationTime;

    public LoginToken(){}

    public LoginToken( String userId ){
        lastRefreshTime = DateTime.now();
        originalCreationTime = DateTime.now();
        this.userId = userId;
        token = generateToken();
    }

    private String generateToken(){
        return "TODO"; // TODO
    }
}
