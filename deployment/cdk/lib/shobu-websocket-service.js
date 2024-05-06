const cdk = require( "aws-cdk-lib" );
const { Construct } = require( "constructs" );
const apigateway = require("aws-cdk-lib/aws-apigateway");
const apigateway2 = require("aws-cdk-lib/aws-apigatewayv2");
const lambda = require("aws-cdk-lib/aws-lambda");
const ddb = require("aws-cdk-lib/aws-dynamodb");
const { connectionTableKey } = require("./tableAttributes");
const { WebSocketLambdaIntegration } = require("aws-cdk-lib/aws-apigatewayv2-integrations");

class ShobuWebsocketService extends Construct {
    constructor( scope, id, props ) {
        super( scope, id );
        // websocket api
        const webSocketGateway = new apigateway2.WebSocketApi(this, 'shobuWebSocketApi', {
            apiName: 'shobuWebSocketApi',
        });
        this.webSocketApi = new apigateway2.WebSocketStage(this, 'prod', {
            webSocketApi: webSocketGateway,
            stageName: 'prod',
            autoDeploy: true,
        });

        // lambda function
        const lambdaEnv = {
            region: props.env.region,
            websocketUrl: this.webSocketApi.callbackUrl,
        }
        const webSocketLambda = new lambda.Function( this, "pyShobuWebsocketLambda", {
            runtime: lambda.Runtime.PYTHON_3_9,
            code: lambda.Code.fromAsset('../../service/pyShobuService/src'),
            handler: "main.lambda_websocket_handler",
            environment: lambdaEnv,
        }); 

        // routes
        webSocketGateway.addRoute("$connect", {
            returnResponse: true,
            integration: new WebSocketLambdaIntegration('connect', webSocketLambda),
        });
        webSocketGateway.addRoute("$disconnect", {
            returnResponse: true,
            integration: new WebSocketLambdaIntegration('disconnect', webSocketLambda),
        });
        webSocketGateway.addRoute("$default", {
            integration: new WebSocketLambdaIntegration('default', webSocketLambda),
        })
       
        // connection table
        const connectionTableName = "ConnectionTable";
        this.connectionTable = new ddb.Table( this, connectionTableName, {
            tableName: connectionTableName,
            partitionKey: { name: connectionTableKey.playerId, type: ddb.AttributeType.STRING },
            timeToLiveAttribute: connectionTableKey.expirationTimestamp,
        });
        this.connectionTable.addGlobalSecondaryIndex( {
            indexName: 'ConnectionTableByGameId',
            partitionKey: { name: connectionTableKey.gameId, type: ddb.AttributeType.STRING },
            projectionType: ddb.ProjectionType.ALL,
        });

        // permissions
        this.connectionTable.grantReadWriteData(webSocketLambda);
        this.webSocketApi.grantManagementApiAccess(webSocketLambda);
    }
}

module.exports = { ShobuWebsocketService }