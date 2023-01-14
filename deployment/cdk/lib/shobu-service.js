
const { CfnModuleDefaultVersion } = require("aws-cdk-lib");
const cdk = require( "aws-cdk-lib" );
const { Construct } = require( "constructs" );
const apigateway = require("aws-cdk-lib/aws-apigateway");
const lambda = require("aws-cdk-lib/aws-lambda");
const ddb = require("aws-cdk-lib/aws-dynamodb");
const ec2 = require("aws-cdk-lib/aws-ec2");

class ShobuService extends Construct {
    constructor( scope, id, props ){
        super( scope, id );

        // vpc 
        const shobuVpc = new ec2.Vpc( this, "shobuVpc", {
            /*
            DYNAMODB: {
                service: ec2.GatewayVpcEndpointAwsService.DYNAMODB
            }*/
        });

        // ddb tables
        const gameTableName = "GameTable"
        const gameTable = new ddb.Table( this, "GameTable", {
            tableName: gameTableName,
            partitionKey: { name: 'id', type: ddb.AttributeType.STRING },
            vpc: shobuVpc
        });

        // lambda functions
        const lambdaEnv = {
            AdminPasswordHash: "",
            region: props.env.region,
            //gameTableName: gameTableName
        }
        const lambdaFns = [
            "GetGame",
            "Login",
            "CreateGame",
            "JoinGame"
        ].map( ( fnName ) => buildShobuLambda( this, fnName, lambdaEnv, shobuVpc ) );

        for( const fn of lambdaFns ){
            gameTable.grantReadWriteData( fn );
        }
    }
}

function buildShobuLambda( scope, functionName, env, vpc ){
    return new lambda.Function( scope, functionName + "Lambda", {
        runtime: lambda.Runtime.JAVA_11,
        code: lambda.Code.fromAsset( "../../service/shobuServiceLambda/out/artifacts/" + functionName + "_jar/shobuServiceLambda.jar" ),
        handler: "shobu." + functionName + "::handleRequest",
        environment: env,
        vpc: vpc
    } );
}

module.exports = { ShobuService }