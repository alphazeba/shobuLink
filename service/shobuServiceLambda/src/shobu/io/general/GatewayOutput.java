package shobu.io.general;


import java.util.Map;
import java.util.HashMap;

public class GatewayOutput {
    public static Map<String,String> buildSimpleHeaders( String contentType ){
        Map<String,String> headers = new HashMap<>();
        headers.put("Content-Type", contentType);
        headers.put("X-Custom-Header", contentType);
        return headers;
    }

    private final String body;
    private final Map<String, String> headers;
    private final int statusCode;

    public GatewayOutput(final String body, final Map<String, String> headers, final int statusCode) {
        this.statusCode = statusCode;
        this.body = body;
        this.headers = Map.copyOf(headers);
    }

    public String getBody() {
        return body;
    }

    public Map<String, String> getHeaders() {
        return headers;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
