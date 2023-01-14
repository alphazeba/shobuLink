package shobu.io;

import shobu.data.sub.PlayerSide;

public class JoinGameResponse {
    public String side;

    public JoinGameResponse( PlayerSide side ){
        this.side = PlayerSide.toString( side );
    }
}
