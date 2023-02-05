import boto3

print( "ddb is initializng" )

def initProd():
    print( "initializing prod ddb connection")
    return boto3.resource( 'dynamodb' ) # could be sped up using the the environmetn credentials and feeding in the region, but its already fast.

def initTest():
    print( "initializing test ddb connection")
    session = getTestSession()
    return session.resource( 'dynamodb', region_name='us-west-2' )

def getTestSession():
    session = boto3.Session( profile_name="shobuTest" )
    sts = session.client( "sts" )
    response = sts.assume_role(
        RoleArn="arn:aws:iam::012478530188:role/readShobuDynamoDb",
        RoleSessionName="shobuTestDdbReadRole" )
    creds = response["Credentials"]
    return boto3.Session( 
        aws_access_key_id=creds["AccessKeyId"],
        aws_secret_access_key=creds["SecretAccessKey"],
        aws_session_token=creds["SessionToken"] )

def getTable( ddb, tableName ) :
    return ddb.Table( tableName )
