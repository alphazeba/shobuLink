package shobu.util;

import java.util.Date;

public class Time {
    public static long getNow(){
        return new Date().getTime();
    }

    public static String getNowString(){
        return new Date().toString();
    }
}
