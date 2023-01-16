import boto3

ddb = boto3.resource( 'dynamodb' ) # could be sped up using the the environmetn credentials and feeding in the region, but its already fast.

def getTable( tableName ) :
    return ddb.Table( tableName )
