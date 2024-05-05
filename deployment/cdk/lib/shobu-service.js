const cdk = require( "aws-cdk-lib" );
const { Construct } = require( "constructs" );
const apigateway = require("aws-cdk-lib/aws-apigateway");
const apigateway2 = require("aws-cdk-lib/aws-apigatewayv2");
const lambda = require("aws-cdk-lib/aws-lambda");
const ddb = require("aws-cdk-lib/aws-dynamodb");
const { gameTableKey } = require("./tableAttributes");
const { WebSocketLambdaIntegration } = require("aws-cdk-lib/aws-apigatewayv2-integrations");

class ShobuService extends Construct {
    constructor( scope, id, props ){
        super( scope, id );

        const domainName = "shobu.link"
        const corsOrigin = "*";
        // idk how to make the link get a certificate so maybe i won't be handling the 
        // the certificate process through the cdk.

        // ddb tables
        const gameTableName = "GameTable"
        const gameTable = new ddb.Table( this, gameTableName, {
            tableName: gameTableName,
            partitionKey: { name: gameTableKey.gameId, type: ddb.AttributeType.STRING },
        } );


        // due to bug with cdk, must add gsi one at a time https://github.com/aws/aws-cdk/issues/12246
        // comment gsi out and deploy cdk multiple times when first setting up.
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
            region: props.env.region,
            corsOrigin: corsOrigin,
            websocketUrl: props.webSocketApi.callbackUrl,
        }
        this.lambdaFn = new lambda.Function( this, "pyShobuLambda", {
            runtime: lambda.Runtime.PYTHON_3_9,
            code: lambda.Code.fromAsset( '../../service/pyShobuService/src'),
            handler: "main.lambda_handler",
            environment: lambdaEnv,
        });

        // rest api
        const api = new apigateway.LambdaRestApi( this, 'shobuApi', {
            handler: this.lambdaFn,
            proxy: false,
        });
        const items = api.root.addResource('api');
        items.addMethod('POST');
        items.addCorsPreflight({
            allowOrigins: corsOrigin,
            allowMethods: [ 'POST' ]
        });

        // permissions
        gameTable.grantReadWriteData( this.lambdaFn );
        props.connectionTable.grantReadWriteData( this.lambdaFn );
        props.webSocketApi.grantManagementApiAccess( this.lambdaFn );
    }
}

module.exports = { ShobuService }