package shobu.data.sub;

import java.util.Locale;

public enum PlayerSide {
    black, white;
    public static PlayerSide parsePlayerSide( String side ){
        if( side.toUpperCase(Locale.ROOT).equals("BLACK") ){
            return black;
        }
        return white;
    }
}
