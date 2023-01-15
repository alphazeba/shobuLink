package shobu.io;

import shobu.GetGame;
import shobu.data.Game;

public class GetGameResponse {
    public Game game;
    public GetGameResponse( Game game ){
        this.game = game;
    }
}
