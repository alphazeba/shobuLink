const { Construct } = require( "constructs" );
const apigateway = require("aws-cdk-lib/aws-apigateway");
const lambda = require("aws-cdk-lib/aws-lambda");
const ddb = require("aws-cdk-lib/aws-dynamodb");
const { gameTableKey } = require("./tableAttributes");

class ShobuService extends Construct {
    constructor( scope, id, props ){
        super( scope, id );

        const corsOrigin = "*";

        // ddb tables
        const gameTableName = "GameTable";
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
                gameTableKey.whiteName,
                gameTableKey.gameState,
            ],
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
                gameTableKey.blackName,
                gameTableKey.gameState,
            ],
        } );

        const openGameTableName = "OpenGameTable";
        const openGameTable = new ddb.Table( this, openGameTableName, {
            tableName: openGameTableName,
            partitionKey: { name: gameTableKey.gameId, type: ddb.AttributeType.STRING },
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
        openGameTable.grantReadWriteData( this.lambdaFn );
        props.connectionTable.grantReadWriteData( this.lambdaFn );
        props.webSocketApi.grantManagementApiAccess( this.lambdaFn );
    }
}

module.exports = { ShobuService }