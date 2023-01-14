package shobu.data;

import org.joda.time.DateTime;
import shobu.data.sub.GameState;
import shobu.data.sub.Move;

import java.util.List;

public class Game {
    String id;
    String buId;
    String wuId;
    String buName;
    String wuName;
    List<Move> moves;
    DateTime startTime;
    GameState state;
}
