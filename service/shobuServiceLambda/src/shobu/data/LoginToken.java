package shobu.data;


import shobu.util.Time;

import java.util.Date;

public class LoginToken {
    public String token;
    public long lastRefreshTime;
    public String userId;
    public long originalCreationTime;

    public LoginToken(){}

    public LoginToken( String userId ){
        lastRefreshTime = Time.getNow();
        originalCreationTime = Time.getNow();
        this.userId = userId;
        token = generateToken();
    }

    private String generateToken(){
        return "TODO"; // TODO
    }
}
