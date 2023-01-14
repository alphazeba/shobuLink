package shobu.util;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import org.joda.time.DateTime;

public class Log {
    private static LambdaLogger logger;

    public static void setLogger( LambdaLogger l ){
        logger = l;
    }

    public static void log( String s ){
        if( logger != null ){
            logger.log(DateTime.now().toString() + s );
        }
    }
}
