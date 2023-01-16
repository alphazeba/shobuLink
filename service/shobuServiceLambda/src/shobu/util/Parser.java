package shobu.util;

// import com.google.gson.Gson;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;

public class Parser {

    private static ObjectMapper mapper = new ObjectMapper();

    public static <T> T fromJson( String jsonString, Class<T> outputClass ) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.readValue( jsonString, outputClass );
    }

    public static String toJson( Object thing ) throws JsonProcessingException {
        return mapper.writeValueAsString( thing );
    }
}
