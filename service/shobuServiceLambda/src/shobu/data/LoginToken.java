package shobu.data;


import java.util.Date;

public class LoginToken {
    public String token;
    public Date lastRefreshTime;
    public String userId;
    public Date originalCreationTime;

    public LoginToken(){}

    public LoginToken( String userId ){
        lastRefreshTime = new Date();
        originalCreationTime = new Date();
        this.userId = userId;
        token = generateToken();
    }

    private String generateToken(){
        return "TODO"; // TODO
    }
}
