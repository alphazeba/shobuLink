package shobu.data.sub;

import java.util.Locale;

public enum PlayerSide {
    black, white;
    public static PlayerSide parse( String side ){
        if( side.toUpperCase(Locale.ROOT).equals("BLACK") ){
            return black;
        }
        return white;
    }
    public static String toString( PlayerSide side ){
        if( side == black ){
            return "BLACK";

        }
        return "WHITE";
    }
}
