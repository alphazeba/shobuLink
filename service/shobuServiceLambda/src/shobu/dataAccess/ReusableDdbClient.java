package shobu.dataAccess;

import com.amazonaws.auth.EnvironmentVariableCredentialsProvider;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import shobu.util.Log;

public class ReusableDdbClient {
    private static AmazonDynamoDB client;

    public static AmazonDynamoDB getClient(){
        if( client == null ){
            Log.log("building the ddb client");
            client = AmazonDynamoDBClientBuilder.standard()
                    .withRegion( System.getenv("region") )
                    .withCredentials( new EnvironmentVariableCredentialsProvider() ).build();
            Log.log("finished building ddb client" );
        }
        return client;
    }
}
