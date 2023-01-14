package shobu.io;

import shobu.data.sub.PlayerSide;

public class CreateGameRequest {
    public String loginToken;
    public String userId;
    public String userName;
    public String side;
    public int timePerSide;

    public PlayerSide getSide(){
        return PlayerSide.parse( side );
    }
}
