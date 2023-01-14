package shobu.dataAccess;

import shobu.data.User;
import shobu.exception.KeyNotFoundException;

import java.util.ArrayList;
import java.util.List;

public class TestUsers implements Users{

    private List<User> users = new ArrayList<>(){{
        add( new User( "billy", "billy loves ham") );
        add( new User( "superKid", "asdfqwer") );
    }};

    @Override
    public User getUserByName(String name) throws KeyNotFoundException {
        for ( User user: users ){
            if( name.equals( user.name ) ){
                return user;
            }
        }
        throw new KeyNotFoundException();
    }

    @Override
    public User getUserById(String id) throws KeyNotFoundException {
        for( User user: users ){
            if( id.equals( user.id ) ){
                return user;
            }
        }
        throw new KeyNotFoundException();
    }
}
