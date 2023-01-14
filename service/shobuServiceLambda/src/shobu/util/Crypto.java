package shobu.util;

import org.springframework.security.crypto.bcrypt.BCrypt;

public class Crypto {

    public boolean checkMatch( String saltHash, String password ){
        return BCrypt.checkpw( password, saltHash );
    }

    public String hashNewPassword( String password ){
        return hash( generateSalt(), password );
    }

    private String generateSalt(){
        return BCrypt.gensalt();
    }

    private String hash( String salt, String password ){
        return BCrypt.hashpw( password, salt );
    }
}
