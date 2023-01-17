
const { CfnModuleDefaultVersion } = require("aws-cdk-lib");
const cdk = require( "aws-cdk-lib" );
const { Construct } = require( "constructs" );
const apigateway = require("aws-cdk-lib/aws-apigateway");
const lambda = require("aws-cdk-lib/aws-lambda");
const ddb = require("aws-cdk-lib/aws-dynamodb");

class ShobuService extends Construct {
    constructor( scope, id, props ){
        super( scope, id );

        const domainName = "shobu.link"
        // idk how to make the link get a certificate so maybe i won't be handling the 
        // the certificate process through the cdk.

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
        }
        const lambdaFn = new lambda.Function( this, "pyShobuLambda", {
            runtime: lambda.Runtime.PYTHON_3_9,
            code: lambda.Code.fromAsset( '../../service/pyShobuService/src'),
            handler: "main.lambda_handler",
            environment: lambdaEnv
        });
        // permissions
        gameTable.grantReadWriteData( lambdaFn )

        // api gateway
        const api = new apigateway.LambdaRestApi( this, 'shobuApi', {
            handler: lambdaFn
        });
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