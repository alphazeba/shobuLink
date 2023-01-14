package shobu.dataAccess;

import shobu.data.User;
import shobu.exception.KeyNotFoundException;

public interface Users {
    User getUserByName( String name ) throws KeyNotFoundException;

    User getUserById( String id ) throws KeyNotFoundException;
}
