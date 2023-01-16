
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

        // ddb tables
        const gameTableName = "GameTable"
        const gameTable = new ddb.Table( this, "GameTable", {
            tableName: gameTableName,
            partitionKey: { name: 'id', type: ddb.AttributeType.STRING },
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
        ].map( ( fnName ) => buildShobuLambda( this, fnName, lambdaEnv ) );

        const pythonLambdaFn = new lambda.Function( this, "pyShobuLambda", {
            runtime: lambda.Runtime.PYTHON_3_9,
            code: lambda.Code.fromAsset( '../../service/pyShobuService/src'),
            handler: "main.lambda_handler",
            environment: lambdaEnv
        });
        gameTable.grantReadWriteData( pythonLambdaFn )

        for( const fn of lambdaFns ){
            gameTable.grantReadWriteData( fn );
        }
    }
}

function buildShobuLambda( scope, functionName, env ){
    return new lambda.Function( scope, functionName + "Lambda", {
        runtime: lambda.Runtime.JAVA_11,
        code: lambda.Code.fromAsset( "../../service/shobuServiceLambda/out/artifacts/" + functionName + "_jar/shobuServiceLambda.jar" ),
        handler: "shobu." + functionName + "::handleRequest",
        environment: env,
    } );
}

module.exports = { ShobuService }