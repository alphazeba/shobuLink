package shobu.data.sub;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTypeConverter;

public class GameStateDdbConverter implements DynamoDBTypeConverter<String, GameState> {
    @Override
    public String convert(GameState gameState) {
        if( gameState == null ){
            return "";
        }
        return gameState.name();
    }

    @Override
    public GameState unconvert(String s) {
        for( GameState state: GameState.values() ){
            if( state.name().equals( s ) ){
                return state;
            }
        }
        return null;
    }
}