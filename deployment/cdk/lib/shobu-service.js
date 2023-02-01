const cdk = require( "aws-cdk-lib" );
const { Construct } = require( "constructs" );
const apigateway = require("aws-cdk-lib/aws-apigateway");
const lambda = require("aws-cdk-lib/aws-lambda");
const ddb = require("aws-cdk-lib/aws-dynamodb");
const { gameTableKey } = require("./tableAttributes");

class ShobuService extends Construct {
    constructor( scope, id, props ){
        super( scope, id );

        const domainName = "shobu.link"
        const corsOrigin = "*";
        // idk how to make the link get a certificate so maybe i won't be handling the 
        // the certificate process through the cdk.

        // ddb tables
        const gameTableName = "GameTable"
        const gameTable = new ddb.Table( this, "GameTable", {
            tableName: gameTableName,
            partitionKey: { name: 'id', type: ddb.AttributeType.STRING },
        });

        gameTable.addGlobalSecondaryIndex( {
            indexName: 'blackGameIndex',
            partitionKey: { name: gameTableKey.blackId, type: ddb.AttributeType.STRING },
            sortKey: { name: gameTableKey.phaseTime, type: ddb.AttributeType.STRING },
            projectionType: ddb.ProjectionType.INCLUDE,
            nonKeyAttributes: [
                gameTableKey.gameId,
                gameTableKey.preview,
                gameTableKey.whiteId,
                gameTableKey.whiteName
            ]
        } );

        gameTable.addGlobalSecondaryIndex( {
            indexName: 'whiteGameIndex',
            partitionKey: { name: gameTableKey.whiteId, type: ddb.AttributeType.STRING },
            sortKey: { name: gameTableKey.phaseTime, type: ddb.AttributeType.STRING },
            projectionType: ddb.ProjectionType.INCLUDE,
            nonKeyAttributes: [
                gameTableKey.gameId,
                gameTableKey.preview,
                gameTableKey.blackId,
                gameTableKey.blackName
            ]
        } );

        // lambda functions
        const lambdaEnv = {
            AdminPasswordHash: "",
            region: props.env.region,
            corsOrigin: corsOrigin
        }
        const lambdaFn = new lambda.Function( this, "pyShobuLambda", {
            runtime: lambda.Runtime.PYTHON_3_9,
            code: lambda.Code.fromAsset( '../../service/pyShobuService/src'),
            handler: "main.lambda_handler",
            environment: lambdaEnv,
        });
        // permissions
        gameTable.grantReadWriteData( lambdaFn )

        // api gateway
        const api = new apigateway.LambdaRestApi( this, 'shobuApi', {
            handler: lambdaFn,
            proxy: false,
        });
        const items = api.root.addResource('api');
        items.addMethod('POST');
        items.addCorsPreflight({
            allowOrigins: corsOrigin,
            allowMethods: [ 'POST' ]
        })
    }
}

module.exports = { ShobuService }