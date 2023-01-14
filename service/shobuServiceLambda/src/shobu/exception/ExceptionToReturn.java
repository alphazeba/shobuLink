package shobu.exception;

import shobu.io.general.GatewayOutput;

public class ExceptionToReturn extends Exception{
    public GatewayOutput output;

    public ExceptionToReturn( String errorMessage, int statusCode ){
        this.output = new GatewayOutput(
                "",
                GatewayOutput.buildSimpleHeaders("application/json"),
                statusCode );
    }
}
