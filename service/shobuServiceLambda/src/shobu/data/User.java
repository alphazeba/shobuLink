package shobu.data;

import shobu.util.Crypto;
import shobu.util.Guid;

public class User {
    public String id;
    public String name;
    public String saltHash;

    public User(){};

    public User( String name, String password ){
        Crypto crypto = new Crypto();
        id = Guid.newGuid();
        this.name = name;
        this.saltHash = crypto.hashNewPassword( password );
    }
}
