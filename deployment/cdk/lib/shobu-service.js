
const { CfnModuleDefaultVersion } = require("aws-cdk-lib");
const cdk = require( "aws-cdk-lib" );
const { Construct } = require( "constructs" );
const apigateway = require("aws-cdk-lib/aws-apigateway");
const lambda = require("aws-cdk-lib/aws-lambda");
const ddb = require("aws-cdk-lib/aws-dynamodb");

class ShobuService extends Construct {
    constructor( scope, id ){
        super( scope, id );

        // lambda functions
        const lambdaEnv = {
            AdminPasswordHash: ""
        }
        const lambdaFns = [
            "GetGame",
            "Login"
        ].map( ( fnName ) => buildShobuLambda( this, fnName, lambdaEnv ) );

        // ddb tables
        const gameTable = new ddb.Table( this, "GameTable", {
            partitionKey: { name: 'id', type: ddb.AttributeType.STRING }
        })

        for( const fn of lambdaFns ){
            console.log( fn )
            gameTable.grantReadWriteData( fn );
        }
    }
}

function buildShobuLambda( scope, functionName, env ){
    return new lambda.Function( scope, functionName + "Lambda", {
        runtime: lambda.Runtime.JAVA_11,
        code: lambda.Code.fromAsset( "../../service/shobuServiceLambda/out/artifacts/" + functionName + "_jar/shobuServiceLambda.jar" ),
        handler: "shobu." + functionName + "::handleRequest",
        environment: env
    } );
}

module.exports = { ShobuService }