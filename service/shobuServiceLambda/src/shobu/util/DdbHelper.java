package shobu.util;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapperConfig;

public class DdbHelper {
    public static DynamoDBMapperConfig getTableNameOverrideConfig(String tableName ){
        return new DynamoDBMapperConfig.Builder().withTableNameOverride(
                DynamoDBMapperConfig.TableNameOverride.withTableNameReplacement( tableName )
        ).build();
    }
}
