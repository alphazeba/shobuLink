package shobu.util;

import com.google.gson.Gson;

public class Parser {

    private static Gson gson = new Gson();

    public static <T> T fromJson( String jsonString, Class<T> outputClass ){
        return gson.fromJson( jsonString, outputClass );
    }

    public static String toJson( Object thing ){
        return gson.toJson( thing );
    }
}
