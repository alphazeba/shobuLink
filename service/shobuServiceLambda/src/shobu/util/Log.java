package shobu.util;

import com.amazonaws.services.lambda.runtime.LambdaLogger;

public class Log {
    private static LambdaLogger logger;

    public static void setLogger( LambdaLogger l ){
        logger = l;
    }

    public static void log( String s ){
        if( logger != null ){
            logger.log(Time.getNowString() + "::" + s );
        }
    }
}
